from rest_framework import serializers
from .models import Note, Tag, Folder, NoteRevision, TagRelationship, TagCategory, NoteCapture

class TagSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    synonyms = serializers.StringRelatedField(many=True)

    class Meta:
        model = Tag
        fields = ['id', 'name', 'parent', 'children', 'synonyms']

    def get_children(self, obj):
        return TagSerializer(obj.children.all(), many=True).data

class TagRelationshipSerializer(serializers.ModelSerializer):
    from_tag = serializers.StringRelatedField()
    to_tag = serializers.StringRelatedField()

    class Meta:
        model = TagRelationship
        fields = ['from_tag', 'to_tag', 'relationship_type']

class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class NoteRevisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteRevision
        fields = ['id', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    folder = FolderSerializer(required=False)
    
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'content_word_count', 'summary', 'created_at', 'updated_at', 'tags', 'folder']
        read_only_fields = ['id', 'content_word_count', 'created_at', 'updated_at']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        folder_data = validated_data.pop('folder', None)
        
        note = Note.objects.create(**validated_data)
        
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_data['name'], user=note.user)
            note.tags.add(tag)
        
        if folder_data:
            folder, _ = Folder.objects.get_or_create(name=folder_data['name'], user=note.user)
            note.folder = folder
            note.save()
        
        return note

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        folder_data = validated_data.pop('folder', None)
        
        instance = super().update(instance, validated_data)
        
        instance.tags.clear()
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_data['name'], user=instance.user)
            instance.tags.add(tag)
        
        if folder_data:
            folder, _ = Folder.objects.get_or_create(name=folder_data['name'], user=instance.user)
            instance.folder = folder
        elif 'folder' in validated_data:
            instance.folder = None
        
        instance.save()
        return instance

class NoteListSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    folder = FolderSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'title', 'summary', 'created_at', 'updated_at', 'tags', 'folder']
        read_only_fields = ['id', 'created_at', 'updated_at']

class TagWithNotesSerializer(TagSerializer):
    notes_count = serializers.IntegerField(read_only=True)

    class Meta(TagSerializer.Meta):
        fields = TagSerializer.Meta.fields + ['notes_count']

class FolderWithStatsSerializer(FolderSerializer):
    notes_count = serializers.IntegerField(read_only=True)
    total_words = serializers.IntegerField(read_only=True)
    avg_words = serializers.FloatField(read_only=True)

    class Meta(FolderSerializer.Meta):
        fields = FolderSerializer.Meta.fields + ['notes_count', 'total_words', 'avg_words']

class TagCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TagCategory
        fields = '__all__'

class NoteCaptureSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteCapture
        fields = '__all__'
