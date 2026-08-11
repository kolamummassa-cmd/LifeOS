from django.db import models

from academies.models import Academy
from core.models import TimeStampedModel


class Goal(TimeStampedModel):
    LONG_TERM = 'long_term'
    YEARLY = 'yearly'
    QUARTERLY = 'quarterly'
    MONTHLY = 'monthly'
    LEARNING = 'learning'
    TIMEFRAME_CHOICES = [
        (LONG_TERM, 'Long-term'),
        (YEARLY, 'Yearly'),
        (QUARTERLY, 'Quarterly'),
        (MONTHLY, 'Monthly'),
        (LEARNING, 'Learning'),
    ]

    NOT_STARTED = 'not_started'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'
    ABANDONED = 'abandoned'
    STATUS_CHOICES = [
        (NOT_STARTED, 'Not Started'),
        (IN_PROGRESS, 'In Progress'),
        (COMPLETED, 'Completed'),
        (ABANDONED, 'Abandoned'),
    ]

    title = models.CharField(max_length=255)
    why = models.TextField(blank=True, help_text='Why this goal matters')
    description = models.TextField(blank=True)
    academy = models.ForeignKey(Academy, on_delete=models.SET_NULL, null=True, blank=True, related_name='goals')
    timeframe = models.CharField(max_length=15, choices=TIMEFRAME_CHOICES, default=LEARNING)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default=NOT_STARTED)
    deadline = models.DateField(null=True, blank=True)
    reflection = models.TextField(blank=True)

    class Meta:
        ordering = ['deadline', '-created_at']

    @property
    def progress_percent(self):
        total = self.milestones.count()
        if not total:
            return 0
        done = self.milestones.filter(is_complete=True).count()
        return round((done / total) * 100)

    def __str__(self):
        return self.title


class Milestone(TimeStampedModel):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=255)
    is_complete = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f'{self.goal.title} → {self.title}'
