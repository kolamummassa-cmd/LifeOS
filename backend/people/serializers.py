from rest_framework import serializers

from .models import Person


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = [
            'id', 'name', 'role', 'where_met', 'notes',
            'last_contact', 'follow_up_notes', 'created_at',
        ]
