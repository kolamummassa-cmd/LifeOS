from rest_framework import serializers

from core.serializers import TagRelatedField

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    tags = TagRelatedField(many=True, required=False)
    academy_name = serializers.CharField(source='academy.name', read_only=True)

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'body', 'academy', 'academy_name', 'tags',
            'related_resources', 'related_goals', 'related_notes',
            'created_at', 'updated_at',
        ]
