from django.db import models

from academies.models import Academy
from core.models import Tag, TimeStampedModel


class Note(TimeStampedModel):
    """
    The second brain. A note can belong to an Academy, carry tags, and
    link to other notes, resources, and goals — this is what makes it
    possible to connect a leadership lesson to a communication lesson,
    or a philosophy idea to a business decision.
    """

    title = models.CharField(max_length=255)
    body = models.TextField(blank=True, help_text='Markdown supported')
    academy = models.ForeignKey(Academy, on_delete=models.SET_NULL, null=True, blank=True, related_name='notes')
    tags = models.ManyToManyField(Tag, blank=True, related_name='notes')

    related_resources = models.ManyToManyField('resources.Resource', blank=True, related_name='related_notes')
    related_goals = models.ManyToManyField('goals.Goal', blank=True, related_name='related_notes')
    related_notes = models.ManyToManyField('self', blank=True, symmetrical=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title
