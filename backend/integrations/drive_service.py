"""
Thin wrapper around the Google Drive API v3.

This module is deliberately isolated from the rest of LifeOS (see
docs/Architecture.md) — nothing else in the app should import from here
directly except integrations/views.py and the setup_drive_folders
management command. If Drive is ever swapped out or unavailable, no
other feature should break.

Requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET to be set (Milestone 18
in docs/Roadmap.md) and a GoogleDriveCredential row to exist (created by
completing the OAuth flow at /api/integrations/drive/auth/).
"""

from django.conf import settings
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

from .models import GoogleDriveCredential

SCOPES = ['https://www.googleapis.com/auth/drive.file']
FOLDER_MIME = 'application/vnd.google-apps.folder'


def build_flow(state=None):
    client_config = {
        'web': {
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
            'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
            'token_uri': 'https://oauth2.googleapis.com/token',
            'redirect_uris': [settings.GOOGLE_OAUTH_REDIRECT_URI],
        }
    }
    return Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        state=state,
        redirect_uri=settings.GOOGLE_OAUTH_REDIRECT_URI,
    )


def save_credential_from_flow(flow):
    creds = flow.credentials
    record, _ = GoogleDriveCredential.objects.get_or_create(pk=1)
    record.access_token = creds.token
    record.refresh_token = creds.refresh_token or record.refresh_token
    record.token_expiry = creds.expiry
    record.save()
    return record


def get_drive_client():
    """Returns an authenticated Drive API client, refreshing the token if needed."""
    record = GoogleDriveCredential.objects.first()
    if not record:
        raise RuntimeError(
            'No Google Drive credential found. Visit /api/integrations/drive/auth/ '
            'to connect your Google account first.'
        )

    creds = Credentials(
        token=record.access_token,
        refresh_token=record.refresh_token,
        token_uri='https://oauth2.googleapis.com/token',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=SCOPES,
    )

    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        record.access_token = creds.token
        record.token_expiry = creds.expiry
        record.save()

    return build('drive', 'v3', credentials=creds)


def find_or_create_folder(name, parent_id=None):
    client = get_drive_client()
    query = f"name = '{name}' and mimeType = '{FOLDER_MIME}' and trashed = false"
    if parent_id:
        query += f" and '{parent_id}' in parents"
    results = client.files().list(q=query, fields='files(id, name)').execute()
    files = results.get('files', [])
    if files:
        return files[0]['id']

    metadata = {'name': name, 'mimeType': FOLDER_MIME}
    if parent_id:
        metadata['parents'] = [parent_id]
    folder = client.files().create(body=metadata, fields='id').execute()
    return folder['id']


def upload_file(local_path, filename, parent_id, mimetype='application/octet-stream'):
    """Uploads any file type (image, PDF, document, etc.) to the given Drive folder."""
    client = get_drive_client()
    metadata = {'name': filename, 'parents': [parent_id]}
    media = MediaFileUpload(local_path, mimetype=mimetype, resumable=True)
    uploaded = client.files().create(body=metadata, media_body=media, fields='id').execute()
    return uploaded['id']
