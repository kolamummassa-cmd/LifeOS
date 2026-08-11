from django.conf import settings
from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from . import drive_service
from .models import GoogleDriveCredential

# These three endpoints are the OAuth redirect dance with Google. A plain
# browser navigation can't attach a JWT header, and this is a single-user
# app not exposed publicly, so AllowAny is an acceptable trade-off here —
# see docs/Architecture.md for why this integration is kept isolated.


@api_view(['GET'])
@permission_classes([AllowAny])
def drive_status(request):
    """Tells the frontend whether Google Drive is connected yet."""
    configured = bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET)
    connected = GoogleDriveCredential.objects.exists()
    return Response({'configured': configured, 'connected': connected})


@api_view(['GET'])
@permission_classes([AllowAny])
def drive_auth_start(request):
    """
    Step 1 of Milestone 18: redirects Kolamu to Google's consent screen.
    Requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in backend/.env.
    """
    if not (settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET):
        return Response(
            {'error': 'Google OAuth is not configured yet. Add GOOGLE_CLIENT_ID and '
                      'GOOGLE_CLIENT_SECRET to backend/.env — see docs/Roadmap.md.'},
            status=400,
        )
    flow = drive_service.build_flow()
    auth_url, _ = flow.authorization_url(access_type='offline', prompt='consent')
    return HttpResponseRedirect(auth_url)


@api_view(['GET'])
@permission_classes([AllowAny])
def drive_auth_callback(request):
    """Step 2: Google redirects back here with a code; we exchange it for tokens."""
    flow = drive_service.build_flow()
    flow.fetch_token(code=request.GET.get('code'))
    drive_service.save_credential_from_flow(flow)
    return Response({'status': 'connected'})
