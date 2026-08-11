from rest_framework import viewsets

from .models import Goal, Milestone
from .serializers import GoalSerializer, MilestoneSerializer


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    filterset_fields = ['academy', 'timeframe', 'status']


class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    filterset_fields = ['goal', 'is_complete']
