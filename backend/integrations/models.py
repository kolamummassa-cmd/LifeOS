from django.db import models

from core.models import TimeStampedModel


class GoogleDriveCredential(TimeStampedModel):
    """
    Stores the single OAuth token set for Kolamu's Google account.
    Single-user app, so this is a singleton table (at most one row).
    Populated by the OAuth flow in `integrations/views.py` once
    GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set — see Milestone 18
    in docs/Roadmap.md.
    """

    access_token = models.TextField()
    refresh_token = models.TextField()
    token_expiry = models.DateTimeField(null=True, blank=True)
    root_folder_id = models.CharField(max_length=255, blank=True, help_text="The 'LifeOS' root Drive folder")

    def __str__(self):
        return 'Google Drive credential'
