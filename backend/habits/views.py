import datetime

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Habit, HabitLog
from .serializers import HabitLogSerializer, HabitSerializer


class HabitViewSet(viewsets.ModelViewSet):
    queryset = Habit.objects.all()
    serializer_class = HabitSerializer
    filterset_fields = ['academy', 'is_anchor', 'is_active']

    @action(detail=True, methods=['post'])
    def toggle_today(self, request, pk=None):
        """Marks (or unmarks) this habit as done for today — used by the dashboard checkboxes."""
        habit = self.get_object()
        today = datetime.date.today()
        log, created = HabitLog.objects.get_or_create(habit=habit, date=today, defaults={'completed': True})
        if not created:
            log.completed = not log.completed
            log.save()
        return Response(HabitLogSerializer(log).data)


class HabitLogViewSet(viewsets.ModelViewSet):
    queryset = HabitLog.objects.all()
    serializer_class = HabitLogSerializer
    filterset_fields = ['habit', 'date']
