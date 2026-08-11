from rest_framework import serializers

from .models import JournalEntry


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = [
            'id', 'entry_type', 'period_start', 'period_end',
            'what_did_i_learn', 'what_did_i_build', 'what_challenged_me',
            'what_mistake_did_i_make', 'what_did_i_understand_better',
            'what_am_i_grateful_for', 'what_should_i_improve',
            'what_did_i_avoid', 'what_should_i_do_differently',
            'free_write', 'created_at', 'updated_at',
        ]
