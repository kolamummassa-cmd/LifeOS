import logging

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Academy, AcademyPeriod
from .serializers import AcademyPeriodSerializer, AcademySerializer

logger = logging.getLogger(__name__)


class AcademyViewSet(viewsets.ModelViewSet):
    queryset = Academy.objects.all()
    serializer_class = AcademySerializer
    filterset_fields = ['academy_type', 'is_active']

    def perform_create(self, serializer):
        """
        Creates the Academy, then — if Google Drive is already connected
        (Milestone 18) — creates its Drive subfolder immediately, so new
        Academies don't need a manual `setup_drive_folders` re-run.
        Drive sync is best-effort: if it fails, the Academy is still
        created normally and can be synced later.
        """
        academy = serializer.save()
        try:
            from integrations.models import GoogleDriveCredential

            credential = GoogleDriveCredential.objects.first()
            if credential and credential.root_folder_id:
                from integrations import drive_service

                folder_id = drive_service.find_or_create_folder(
                    academy.name, parent_id=credential.root_folder_id
                )
                academy.drive_folder_id = folder_id
                academy.save(update_fields=['drive_folder_id'])
        except Exception:
            logger.exception('Failed to auto-create Drive folder for Academy %s', academy.name)

    @action(detail=False, methods=['get'])
    def rotating_current(self, request):
        """The single rotating academy currently in focus, if any."""
        academy = Academy.objects.filter(academy_type=Academy.ROTATING, is_active=True).first()
        if not academy:
            return Response(None)
        return Response(AcademySerializer(academy).data)


class AcademyPeriodViewSet(viewsets.ModelViewSet):
    queryset = AcademyPeriod.objects.all()
    serializer_class = AcademyPeriodSerializer
    filterset_fields = ['academy', 'is_current']
