from django.db import models


class TimeStampedModel(models.Model):
    """Adds created/updated timestamps to any model that inherits it."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Tag(TimeStampedModel):
    """
    A shared label usable across Notes and Resources.
    This is what lets a leadership lesson be tagged the same way as a
    business lesson, enabling cross-Academy discovery later.
    """

    name = models.CharField(max_length=60, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
