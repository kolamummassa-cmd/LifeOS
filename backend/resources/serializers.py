from rest_framework import serializers

from core.serializers import TagRelatedField

from .models import Attachment, BookDetail, PodcastDetail, Resource, VideoDetail


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = [
            'id', 'file', 'file_type', 'academy', 'resource', 'note',
            'drive_file_id', 'synced_to_drive_at', 'created_at',
        ]
        read_only_fields = ['drive_file_id', 'synced_to_drive_at']


class ResourceSerializer(serializers.ModelSerializer):
    """
    Generic serializer for resource types that don't need a detail table:
    Course, Article, Documentation, PDF, Website.
    """

    tags = TagRelatedField(many=True, required=False)
    academy_name = serializers.CharField(source='academy.name', read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'resource_type', 'url', 'academy', 'academy_name',
            'status', 'tags', 'started_at', 'completed_at', 'notes',
            'key_lessons', 'created_at', 'updated_at',
        ]


class BookSerializer(serializers.ModelSerializer):
    """
    Flattens Resource + BookDetail into one payload so the frontend can
    treat 'a book' as a single object, while the database keeps them
    normalized. See docs/Architecture.md for why.
    """

    tags = TagRelatedField(many=True, required=False)
    academy_name = serializers.CharField(source='academy.name', read_only=True)

    author = serializers.CharField(source='book_detail.author', required=False, allow_blank=True)
    cover_url = serializers.URLField(source='book_detail.cover_url', required=False, allow_blank=True)
    category = serializers.CharField(source='book_detail.category', required=False, allow_blank=True)
    pages = serializers.IntegerField(source='book_detail.pages', required=False, allow_null=True)
    current_page = serializers.IntegerField(source='book_detail.current_page', required=False)
    rating = serializers.IntegerField(source='book_detail.rating', required=False, allow_null=True)
    key_ideas = serializers.CharField(source='book_detail.key_ideas', required=False, allow_blank=True)
    quotes = serializers.CharField(source='book_detail.quotes', required=False, allow_blank=True)
    reflections = serializers.CharField(source='book_detail.reflections', required=False, allow_blank=True)
    progress_percent = serializers.IntegerField(source='book_detail.progress_percent', read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'url', 'academy', 'academy_name', 'status', 'tags',
            'started_at', 'completed_at', 'notes', 'key_lessons',
            'author', 'cover_url', 'category', 'pages', 'current_page',
            'rating', 'key_ideas', 'quotes', 'reflections', 'progress_percent',
            'created_at', 'updated_at',
        ]

    def _extract_detail(self, validated_data):
        return validated_data.pop('book_detail', {})

    def create(self, validated_data):
        detail_data = self._extract_detail(validated_data)
        tags = validated_data.pop('tags', [])
        resource = Resource.objects.create(resource_type=Resource.BOOK, **validated_data)
        resource.tags.set(tags)
        BookDetail.objects.create(resource=resource, **detail_data)
        return resource

    def update(self, instance, validated_data):
        detail_data = self._extract_detail(validated_data)
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        detail, _ = BookDetail.objects.get_or_create(resource=instance)
        for attr, value in detail_data.items():
            setattr(detail, attr, value)
        detail.save()
        return instance


class PodcastSerializer(serializers.ModelSerializer):
    tags = TagRelatedField(many=True, required=False)
    academy_name = serializers.CharField(source='academy.name', read_only=True)

    episode = serializers.CharField(source='podcast_detail.episode', required=False, allow_blank=True)
    speaker = serializers.CharField(source='podcast_detail.speaker', required=False, allow_blank=True)
    platform = serializers.CharField(source='podcast_detail.platform', required=False, allow_blank=True)
    duration_minutes = serializers.IntegerField(source='podcast_detail.duration_minutes', required=False, allow_null=True)
    date_listened = serializers.DateField(source='podcast_detail.date_listened', required=False, allow_null=True)
    quotes = serializers.CharField(source='podcast_detail.quotes', required=False, allow_blank=True)
    questions = serializers.CharField(source='podcast_detail.questions', required=False, allow_blank=True)
    reflection = serializers.CharField(source='podcast_detail.reflection', required=False, allow_blank=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'url', 'academy', 'academy_name', 'status', 'tags',
            'started_at', 'completed_at', 'notes', 'key_lessons',
            'episode', 'speaker', 'platform', 'duration_minutes',
            'date_listened', 'quotes', 'questions', 'reflection',
            'created_at', 'updated_at',
        ]

    def _extract_detail(self, validated_data):
        return validated_data.pop('podcast_detail', {})

    def create(self, validated_data):
        detail_data = self._extract_detail(validated_data)
        tags = validated_data.pop('tags', [])
        resource = Resource.objects.create(resource_type=Resource.PODCAST, **validated_data)
        resource.tags.set(tags)
        PodcastDetail.objects.create(resource=resource, **detail_data)
        return resource

    def update(self, instance, validated_data):
        detail_data = self._extract_detail(validated_data)
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        detail, _ = PodcastDetail.objects.get_or_create(resource=instance)
        for attr, value in detail_data.items():
            setattr(detail, attr, value)
        detail.save()
        return instance


class VideoSerializer(serializers.ModelSerializer):
    tags = TagRelatedField(many=True, required=False)
    academy_name = serializers.CharField(source='academy.name', read_only=True)

    channel = serializers.CharField(source='video_detail.channel', required=False, allow_blank=True)
    platform = serializers.CharField(source='video_detail.platform', required=False, allow_blank=True)
    duration_minutes = serializers.IntegerField(source='video_detail.duration_minutes', required=False, allow_null=True)
    date_watched = serializers.DateField(source='video_detail.date_watched', required=False, allow_null=True)
    bookmarks = serializers.CharField(source='video_detail.bookmarks', required=False, allow_blank=True)
    questions = serializers.CharField(source='video_detail.questions', required=False, allow_blank=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'url', 'academy', 'academy_name', 'status', 'tags',
            'started_at', 'completed_at', 'notes', 'key_lessons',
            'channel', 'platform', 'duration_minutes', 'date_watched',
            'bookmarks', 'questions', 'created_at', 'updated_at',
        ]

    def _extract_detail(self, validated_data):
        return validated_data.pop('video_detail', {})

    def create(self, validated_data):
        detail_data = self._extract_detail(validated_data)
        tags = validated_data.pop('tags', [])
        resource = Resource.objects.create(resource_type=Resource.VIDEO, **validated_data)
        resource.tags.set(tags)
        VideoDetail.objects.create(resource=resource, **detail_data)
        return resource

    def update(self, instance, validated_data):
        detail_data = self._extract_detail(validated_data)
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        detail, _ = VideoDetail.objects.get_or_create(resource=instance)
        for attr, value in detail_data.items():
            setattr(detail, attr, value)
        detail.save()
        return instance
