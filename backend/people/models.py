from django.db import models

from core.models import TimeStampedModel


class Person(TimeStampedModel):
    """
    A minimal contact record for the Networking Academy. Deliberately
    thin — this is not a CRM. Just enough to remember who you met, why
    they matter, and what to follow up on.
    """

    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, blank=True, help_text='Role / title / relevance')
    where_met = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    last_contact = models.DateField(null=True, blank=True)
    follow_up_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'people'

    def __str__(self):
        return self.name
