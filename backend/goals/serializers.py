from rest_framework import serializers

from .models import Goal, Milestone


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'goal', 'title', 'is_complete', 'order']


class GoalSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)
    academy_name = serializers.CharField(source='academy.name', read_only=True)
    progress_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = Goal
        fields = [
            'id', 'title', 'why', 'description', 'academy', 'academy_name',
            'timeframe', 'status', 'deadline', 'reflection',
            'milestones', 'progress_percent', 'created_at', 'updated_at',
        ]
