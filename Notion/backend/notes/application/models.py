from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver

class Folder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='folders')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class TagCategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(TagCategory, null=True, blank=True, on_delete=models.SET_NULL)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.SET_NULL)
    synonyms = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='synonym_tags')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.name


class TagRelationship(models.Model):
    from_tag = models.ForeignKey(Tag, related_name='from_tags', on_delete=models.CASCADE)
    to_tag = models.ForeignKey(Tag, related_name='to_tags', on_delete=models.CASCADE)
    relationship_type = models.CharField(max_length=255)  # E.g., "similar", "broader", "narrower"

    def __str__(self):
        return f"{self.from_tag} -> {self.to_tag} ({self.relationship_type})"


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    folder = models.ForeignKey(Folder, on_delete=models.SET_NULL, null=True, blank=True, related_name='notes')
    tags = models.ManyToManyField(Tag, related_name='notes')
    title = models.CharField(max_length=255)
    content = models.TextField()
    content_word_count = models.IntegerField(default=0)
    summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class NoteRevision(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='revisions')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Revision of {self.note.title} at {self.created_at}"


class NoteCapture(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='captures')
    capture_type = models.CharField(max_length=255)  # E.g., "voice", "image"
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Capture for {self.note.title} ({self.capture_type})"


@receiver(pre_save, sender=Note)
def calculate_word_count(sender, instance, **kwargs):
    instance.content_word_count = len(instance.content.split())
