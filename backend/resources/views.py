from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Attachment, Resource
from .serializers import (
    AttachmentSerializer,
    BookSerializer,
    PodcastSerializer,
    ResourceSerializer,
    VideoSerializer,
)

GENERIC_TYPES = [
    Resource.COURSE, Resource.ARTICLE, Resource.DOCUMENTATION,
    Resource.PDF, Resource.WEBSITE,
]


class ResourceViewSet(viewsets.ModelViewSet):
    """Generic resources: courses, articles, documentation, PDFs, websites."""

    serializer_class = ResourceSerializer
    filterset_fields = ['academy', 'status', 'resource_type']
    queryset = Resource.objects.filter(resource_type__in=GENERIC_TYPES)


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    filterset_fields = ['academy', 'status']
    queryset = Resource.objects.filter(resource_type=Resource.BOOK)


class PodcastViewSet(viewsets.ModelViewSet):
    serializer_class = PodcastSerializer
    filterset_fields = ['academy', 'status']
    queryset = Resource.objects.filter(resource_type=Resource.PODCAST)


class VideoViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    filterset_fields = ['academy', 'status']
    queryset = Resource.objects.filter(resource_type=Resource.VIDEO)


class AttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = AttachmentSerializer
    filterset_fields = ['academy', 'resource', 'note']
    queryset = Attachment.objects.all()

    @action(detail=True, methods=['post'])
    def sync_to_drive(self, request, pk=None):
        """
        Uploads this attachment (any file type — image, PDF, document, etc.)
        to the Drive folder matching its Academy. Requires Milestone 18 to
        be set up (Google OAuth connected + setup_drive_folders run).
        """
        from integrations import drive_service

        attachment = self.get_object()
        if not attachment.academy or not attachment.academy.drive_folder_id:
            return Response(
                {'error': 'This attachment has no Academy with a Drive folder yet. '
                          'Run `python manage.py setup_drive_folders` first.'},
                status=400,
            )
        try:
            file_id = drive_service.upload_file(
                attachment.file.path,
                attachment.file.name.split('/')[-1],
                attachment.academy.drive_folder_id,
            )
        except RuntimeError as exc:
            return Response({'error': str(exc)}, status=400)

        attachment.drive_file_id = file_id
        attachment.synced_to_drive_at = timezone.now()
        attachment.save()
        return Response(AttachmentSerializer(attachment).data)
