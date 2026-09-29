from django.conf import settings
from django.http import HttpResponseBadRequest
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from . import drive_service
from .models import GoogleDriveCredential

# These endpoints use a browser redirect, so they cannot rely on the JWT
# header used by the SPA. The OAuth state value is stored in the signed
# Django session and validated on callback to prevent login CSRF.


@api_view(['GET'])
def drive_status(request):
    """Tells the frontend whether Google Drive is connected yet."""
    configured = bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET)
    connected = GoogleDriveCredential.objects.exists()
    return Response({'configured': configured, 'connected': connected})


@api_view(['GET'])
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
    auth_url, state = flow.authorization_url(access_type='offline', prompt='consent')
    request.session['google_oauth_state'] = state
    return Response({'authorization_url': auth_url})


@api_view(['GET'])
@permission_classes([AllowAny])
def drive_auth_callback(request):
    """Step 2: Google redirects back here with a code; we exchange it for tokens."""
    expected_state = request.session.pop('google_oauth_state', None)
    returned_state = request.GET.get('state')
    code = request.GET.get('code')
    if not expected_state or returned_state != expected_state or not code:
        return HttpResponseBadRequest('Invalid or expired Google OAuth callback.')

    flow = drive_service.build_flow(state=expected_state)
    flow.fetch_token(code=code)
    drive_service.save_credential_from_flow(flow)
    return Response({'status': 'connected'})
