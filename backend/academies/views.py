from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Academy, AcademyPeriod
from .serializers import AcademyPeriodSerializer, AcademySerializer


class AcademyViewSet(viewsets.ModelViewSet):
    queryset = Academy.objects.all()
    serializer_class = AcademySerializer
    filterset_fields = ['academy_type', 'is_active']

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
