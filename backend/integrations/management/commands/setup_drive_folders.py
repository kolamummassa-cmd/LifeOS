from django.core.management.base import BaseCommand

from academies.models import Academy
from integrations import drive_service
from integrations.models import GoogleDriveCredential


class Command(BaseCommand):
    """
    One-time Milestone 18 setup: creates the LifeOS/ root folder in
    Kolamu's Google Drive and one subfolder per Academy, then stores the
    resulting folder IDs on each Academy so future uploads know where to go.

    Usage (after completing the OAuth flow at /api/integrations/drive/auth/):
        python manage.py setup_drive_folders
    """

    help = 'Create the LifeOS/<Academy> folder structure in Google Drive.'

    def handle(self, *args, **options):
        if not GoogleDriveCredential.objects.exists():
            self.stderr.write(self.style.ERROR(
                'No Google Drive credential found. Visit /api/integrations/drive/auth/ '
                'in your browser first to connect your Google account.'
            ))
            return

        self.stdout.write('Creating LifeOS root folder...')
        root_id = drive_service.find_or_create_folder('LifeOS')
        credential = GoogleDriveCredential.objects.first()
        credential.root_folder_id = root_id
        credential.save()

        for academy in Academy.objects.all():
            self.stdout.write(f'Creating folder for {academy.name}...')
            folder_id = drive_service.find_or_create_folder(academy.name, parent_id=root_id)
            academy.drive_folder_id = folder_id
            academy.save()

        self.stdout.write(self.style.SUCCESS(
            f'Done. Created LifeOS/ with {Academy.objects.count()} Academy folders.'
        ))
