from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Tag
from .serializers import TagSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Simple liveness endpoint used to verify the API is up and reachable."""
    return Response({'status': 'ok'})


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


@api_view(['GET'])
def search(request):
    """
    Basic V1 search (Milestone 14): a simple case-insensitive text match
    across Resources, Notes, and Goals. Deliberately simple — real
    full-text search is deferred until the app is on Postgres in
    production with proper SearchVector indexes. See docs/Architecture.md.
    """
    from goals.models import Goal
    from goals.serializers import GoalSerializer
    from notes.models import Note
    from notes.serializers import NoteSerializer
    from resources.models import Resource
    from resources.serializers import ResourceSerializer

    query = request.GET.get('q', '').strip()
    if not query:
        return Response({'resources': [], 'notes': [], 'goals': []})

    resources = Resource.objects.filter(title__icontains=query)[:20]
    notes = Note.objects.filter(title__icontains=query)[:20]
    goals = Goal.objects.filter(title__icontains=query)[:20]

    return Response({
        'resources': ResourceSerializer(resources, many=True).data,
        'notes': NoteSerializer(notes, many=True).data,
        'goals': GoalSerializer(goals, many=True).data,
    })
