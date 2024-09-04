from django.db.models import Count, Q
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Note, Tag, Folder, NoteRevision, NoteCapture, TagRelationship, TagCategory
from .serializers import NoteSerializer, TagSerializer, FolderSerializer, NoteRevisionSerializer, NoteCaptureSerializer, TagRelationshipSerializer, TagCategorySerializer
import spacy
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
import numpy as np
import speech_recognition as sr
from PIL import Image
import pytesseract
import io

nlp = spacy.load("en_core_web_sm")
summarizer = pipeline("summarization")

class NoteViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'tags__name']
    ordering_fields = ['created_at', 'updated_at', 'title']

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).prefetch_related('tags').select_related('folder')

    def perform_create(self, serializer):
        try:
            note = serializer.save(user=self.request.user)
            self._process_note(note)
        except ValidationError as e:
            raise ValidationError(detail=str(e))

    def perform_update(self, serializer):
        try:
            note = serializer.save()
            self._process_note(note)
            NoteRevision.objects.create(note=note, content=note.content)
        except ValidationError as e:
            raise ValidationError(detail=str(e))

    def _process_note(self, note):
        # Extract keywords and create tags
        keywords = self._extract_keywords(note.content)
        for keyword in keywords:
            tag, _ = Tag.objects.get_or_create(name=keyword, user=self.request.user)
            note.tags.add(tag)
        
        # Generate summary
        note.summary = self._generate_summary(note.content)
        
        # Generate ML tags
        note.ml_tags = self._generate_ml_tags(note.content)
        
        # Generate note embedding
        note.embedding = self._generate_embedding(note.content)
        
        note.save()

    def _extract_keywords(self, content):
        doc = nlp(content)
        keywords = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and token.pos_ in ['NOUN', 'PROPN', 'ADJ']]
        return list(set(keywords))  # Remove duplicates

    def _generate_summary(self, content):
        summary = summarizer(content, max_length=100, min_length=30, do_sample=False)
        return summary[0]['summary_text']

    def _generate_ml_tags(self, content):
        doc = nlp(content)
        return [ent.label_ for ent in doc.ents]

    def _generate_embedding(self, content):
        doc = nlp(content)
        return doc.vector.tolist()

    @action(detail=False, methods=['get'])
    def search_notes(self, request):
        query = request.GET.get('q', '')
        notes = self.get_queryset().filter(
            Q(title__icontains=query) | 
            Q(content__icontains=query) | 
            Q(tags__name__icontains=query)
        ).distinct()
        
        notes = sorted(notes, key=lambda note: self._calculate_relevance(note, query), reverse=True)
        
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    def _calculate_relevance(self, note, query):
        relevance = 0
        query_embedding = nlp(query).vector
        note_embedding = np.array(note.embedding)
        
        # Calculate cosine similarity between query and note
        similarity = cosine_similarity([query_embedding], [note_embedding])[0][0]
        relevance += similarity * 5  # Weight similarity heavily
        
        # Additional relevance factors
        if query.lower() in note.title.lower():
            relevance += 3
        if query.lower() in note.content.lower():
            relevance += 2
        relevance += sum(1 for tag in note.tags.all() if query.lower() in tag.name.lower())
        
        return relevance

class TagViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def suggest_tags(self, request):
        query = request.GET.get('query', '')
        suggestions = Tag.objects.filter(name__icontains=query, user=self.request.user)
        
        synonym_suggestions = Tag.objects.filter(synonyms__name__icontains=query, user=self.request.user)
        suggestions = (suggestions | synonym_suggestions).distinct()

        suggestions = suggestions.annotate(usage_count=Count('notes')).order_by('-usage_count')[:10]
        
        return Response(TagSerializer(suggestions, many=True).data)

    @action(detail=True, methods=['get'])
    def hierarchy(self, request, pk=None):
        tag = self.get_object()
        hierarchy = self._build_hierarchy(tag)
        return Response(hierarchy)

    def _build_hierarchy(self, tag):
        return {
            'id': tag.id,
            'name': tag.name,
            'children': [self._build_hierarchy(child) for child in tag.children.all()]
        }

class TagRelationshipViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    serializer_class = TagRelationshipSerializer

    def get_queryset(self):
        return TagRelationship.objects.filter(
            from_tag__user=self.request.user,
            to_tag__user=self.request.user
        )

class TagCategoryViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    serializer_class = TagCategorySerializer

    def get_queryset(self):
        return TagCategory.objects.filter(user=self.request.user)

class NoteCaptureViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    serializer_class = NoteCaptureSerializer

    def get_queryset(self):
        return NoteCapture.objects.filter(note__user=self.request.user)

    def perform_create(self, serializer):
        note_capture = serializer.save()
        if note_capture.capture_type == 'voice':
            self._process_voice_capture(note_capture)
        elif note_capture.capture_type == 'image':
            self._process_image_capture(note_capture)

    def _process_voice_capture(self, note_capture):
        recognizer = sr.Recognizer()
        with sr.AudioFile(note_capture.file.path) as source:
            audio = recognizer.record(source)
        try:
            transcribed_text = recognizer.recognize_google(audio)
            note_capture.content = transcribed_text
            note_capture.save()
            note_capture.note.content += f"\n\nTranscribed voice note: {transcribed_text}"
            note_capture.note.save()
        except sr.UnknownValueError:
            raise ValidationError("Speech recognition could not understand the audio")
        except sr.RequestError:
            raise ValidationError("Could not request results from speech recognition service")

    def _process_image_capture(self, note_capture):
        try:
            with Image.open(note_capture.file.path) as img:
                recognized_text = pytesseract.image_to_string(img)
            note_capture.content = recognized_text
            note_capture.save()
            note_capture.note.content += f"\n\nRecognized text from image: {recognized_text}"
            note_capture.note.save()
        except Exception as e:
            raise ValidationError(f"Error processing image: {str(e)}")

class FolderViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    serializer_class = FolderSerializer

    def get_queryset(self):
        return Folder.objects.filter(user=self.request.user)
