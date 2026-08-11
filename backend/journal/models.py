from django.db import models

from core.models import TimeStampedModel


class JournalEntry(TimeStampedModel):
    DAILY = 'daily'
    WEEKLY = 'weekly'
    MONTHLY = 'monthly'
    QUARTERLY = 'quarterly'
    YEARLY = 'yearly'
    ENTRY_TYPE_CHOICES = [
        (DAILY, 'Daily'),
        (WEEKLY, 'Weekly'),
        (MONTHLY, 'Monthly'),
        (QUARTERLY, 'Quarterly'),
        (YEARLY, 'Yearly'),
    ]

    entry_type = models.CharField(max_length=10, choices=ENTRY_TYPE_CHOICES, default=DAILY)
    period_start = models.DateField()
    period_end = models.DateField(null=True, blank=True)

    # Guided prompts (all optional — Kolamu doesn't have to answer every one)
    what_did_i_learn = models.TextField(blank=True)
    what_did_i_build = models.TextField(blank=True)
    what_challenged_me = models.TextField(blank=True)
    what_mistake_did_i_make = models.TextField(blank=True)
    what_did_i_understand_better = models.TextField(blank=True)
    what_am_i_grateful_for = models.TextField(blank=True)
    what_should_i_improve = models.TextField(blank=True)
    what_did_i_avoid = models.TextField(blank=True)
    what_should_i_do_differently = models.TextField(blank=True)
    free_write = models.TextField(blank=True)

    class Meta:
        ordering = ['-period_start']
        verbose_name_plural = 'journal entries'

    def __str__(self):
        return f'{self.get_entry_type_display()} — {self.period_start}'
