from django.db import models

from core.models import TimeStampedModel


class Academy(TimeStampedModel):
    """
    One life domain LifeOS helps develop (Software Engineering, Business,
    Leadership, Communication, Financial Intelligence, Spiritual Growth,
    Relationships, Health, Philosophy, Networking, Journal/Reflection).

    `academy_type` distinguishes the always-on domains from the one
    domain that rotates focus at a time — see docs/Architecture.md.
    """

    ANCHOR = 'anchor'
    ROTATING = 'rotating'
    ACADEMY_TYPE_CHOICES = [
        (ANCHOR, 'Anchor (continuous)'),
        (ROTATING, 'Rotating (one at a time)'),
    ]

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    academy_type = models.CharField(max_length=10, choices=ACADEMY_TYPE_CHOICES, default=ROTATING)
    color = models.CharField(max_length=7, default='#3B82F6', help_text='Hex color used in the UI')
    icon = models.CharField(max_length=50, blank=True, help_text='Icon identifier used in the UI')
    is_active = models.BooleanField(default=True, help_text='Currently in use vs. archived')

    # Populated by the Google Drive integration (Milestone 18).
    drive_folder_id = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'academies'

    def __str__(self):
        return self.name


class AcademyPeriod(TimeStampedModel):
    """
    A focus period for an Academy — this IS the rotation system.
    Software Engineering, being an anchor academy, simply never needs a
    period marked as ended; rotating academies get one period per rotation.
    """

    academy = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='periods')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    objective = models.TextField(help_text="Primary learning objective for this period")
    expected_outcome = models.TextField(blank=True)
    is_current = models.BooleanField(default=True)

    # End-of-rotation review
    reflection_what_learned = models.TextField(blank=True)
    reflection_what_improved = models.TextField(blank=True)
    reflection_what_needs_work = models.TextField(blank=True)
    reflection_continue_practicing = models.TextField(blank=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f'{self.academy.name} ({self.start_date} → {self.end_date or "ongoing"})'
