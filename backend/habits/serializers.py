from rest_framework import serializers
from django.utils import timezone

from .models import Habit, HabitLog


class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ['id', 'habit', 'date', 'completed']


class HabitSerializer(serializers.ModelSerializer):
    academy_name = serializers.CharField(source='academy.name', read_only=True)
    completed_today = serializers.SerializerMethodField()

    class Meta:
        model = Habit
        fields = [
            'id', 'name', 'academy', 'academy_name', 'is_anchor',
            'is_active', 'completed_today', 'created_at',
        ]

    def get_completed_today(self, obj):
        today = timezone.localdate()
        return obj.logs.filter(date=today, completed=True).exists()
