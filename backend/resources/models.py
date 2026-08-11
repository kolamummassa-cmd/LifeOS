from django.db import models

from academies.models import Academy
from core.models import Tag, TimeStampedModel


class Resource(TimeStampedModel):
    """
    Base entity for anything Kolamu learns from: a book, podcast, video,
    course, article, piece of documentation, PDF, or website.

    Shared fields live here; type-specific fields live in a 1:1 detail
    table (BookDetail, PodcastDetail, VideoDetail) so we don't end up with
    one giant table full of always-null columns. See docs/Architecture.md.
    """

    BOOK = 'book'
    PODCAST = 'podcast'
    VIDEO = 'video'
    COURSE = 'course'
    ARTICLE = 'article'
    DOCUMENTATION = 'documentation'
    PDF = 'pdf'
    WEBSITE = 'website'
    RESOURCE_TYPE_CHOICES = [
        (BOOK, 'Book'),
        (PODCAST, 'Podcast'),
        (VIDEO, 'Video'),
        (COURSE, 'Course'),
        (ARTICLE, 'Article'),
        (DOCUMENTATION, 'Documentation'),
        (PDF, 'PDF'),
        (WEBSITE, 'Website'),
    ]

    DISCOVERED = 'discovered'
    WANT_TO_LEARN = 'want_to_learn'
    CURRENTLY_LEARNING = 'currently_learning'
    COMPLETED = 'completed'
    APPLIED = 'applied'
    REVIEWED = 'reviewed'
    MASTERED = 'mastered'
    STATUS_CHOICES = [
        (DISCOVERED, 'Discovered'),
        (WANT_TO_LEARN, 'Want to Learn'),
        (CURRENTLY_LEARNING, 'Currently Learning'),
        (COMPLETED, 'Completed'),
        (APPLIED, 'Applied'),
        (REVIEWED, 'Reviewed'),
        (MASTERED, 'Mastered'),
    ]

    title = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES)
    url = models.URLField(blank=True)
    academy = models.ForeignKey(Academy, on_delete=models.SET_NULL, null=True, blank=True, related_name='resources')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=DISCOVERED)
    tags = models.ManyToManyField(Tag, blank=True, related_name='resources')

    started_at = models.DateField(null=True, blank=True)
    completed_at = models.DateField(null=True, blank=True)

    notes = models.TextField(blank=True)
    key_lessons = models.TextField(blank=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title


class BookDetail(TimeStampedModel):
    resource = models.OneToOneField(Resource, on_delete=models.CASCADE, related_name='book_detail')
    author = models.CharField(max_length=255, blank=True)
    cover_url = models.URLField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    pages = models.PositiveIntegerField(null=True, blank=True)
    current_page = models.PositiveIntegerField(default=0)
    rating = models.PositiveSmallIntegerField(null=True, blank=True, help_text='1-5')
    key_ideas = models.TextField(blank=True)
    quotes = models.TextField(blank=True)
    reflections = models.TextField(blank=True)

    @property
    def progress_percent(self):
        if not self.pages:
            return 0
        return round(min(self.current_page / self.pages, 1) * 100)

    def __str__(self):
        return f'Book: {self.resource.title}'


class PodcastDetail(TimeStampedModel):
    resource = models.OneToOneField(Resource, on_delete=models.CASCADE, related_name='podcast_detail')
    episode = models.CharField(max_length=255, blank=True)
    speaker = models.CharField(max_length=255, blank=True)
    platform = models.CharField(max_length=100, blank=True)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    date_listened = models.DateField(null=True, blank=True)
    quotes = models.TextField(blank=True)
    questions = models.TextField(blank=True)
    reflection = models.TextField(blank=True)

    def __str__(self):
        return f'Podcast: {self.resource.title}'


class VideoDetail(TimeStampedModel):
    resource = models.OneToOneField(Resource, on_delete=models.CASCADE, related_name='video_detail')
    channel = models.CharField(max_length=255, blank=True)
    platform = models.CharField(max_length=100, blank=True)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    date_watched = models.DateField(null=True, blank=True)
    bookmarks = models.TextField(blank=True)
    questions = models.TextField(blank=True)

    def __str__(self):
        return f'Video: {self.resource.title}'


class Attachment(TimeStampedModel):
    """
    A file of any kind (image, PDF, document, etc.) linked to an Academy
    and optionally to a Resource or Note. On upload it can be synced to
    the matching Academy's Google Drive folder — see the `integrations`
    app (Milestone 18). Not image-specific by design.
    """

    IMAGE = 'image'
    PDF = 'pdf'
    DOCUMENT = 'document'
    OTHER = 'other'
    FILE_TYPE_CHOICES = [
        (IMAGE, 'Image'),
        (PDF, 'PDF'),
        (DOCUMENT, 'Document'),
        (OTHER, 'Other'),
    ]

    file = models.FileField(upload_to='attachments/%Y/%m/')
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES, default=OTHER)
    academy = models.ForeignKey(Academy, on_delete=models.SET_NULL, null=True, blank=True, related_name='attachments')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, null=True, blank=True, related_name='attachments')
    note = models.ForeignKey('notes.Note', on_delete=models.CASCADE, null=True, blank=True, related_name='attachments')

    # Populated once Milestone 18 (Google Drive sync) uploads this file.
    drive_file_id = models.CharField(max_length=255, blank=True)
    synced_to_drive_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.file.name
