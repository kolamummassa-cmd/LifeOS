from django.db import models

from academies.models import Academy
from core.models import TimeStampedModel


class Habit(TimeStampedModel):
    """
    A recurring daily practice — e.g. Prayer, Bible Reading, Exercise,
    Journal. Shared across Academies rather than owned by one, since the
    dashboard's anchor-habit row mixes Spiritual and Health items.
    """

    name = models.CharField(max_length=100)
    academy = models.ForeignKey(Academy, on_delete=models.SET_NULL, null=True, blank=True, related_name='habits')
    is_anchor = models.BooleanField(default=True, help_text='Shown on the daily dashboard')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class HabitLog(TimeStampedModel):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    completed = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date']
        unique_together = ('habit', 'date')

    def __str__(self):
        return f'{self.habit.name} — {self.date}'
