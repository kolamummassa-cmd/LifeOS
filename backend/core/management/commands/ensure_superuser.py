from decouple import config

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Creates (or updates) a superuser from environment variables, so a login
    account can exist on a fresh database without needing shell access.

    Reads:
      DJANGO_SUPERUSER_USERNAME
      DJANGO_SUPERUSER_EMAIL
      DJANGO_SUPERUSER_PASSWORD

    Safe to run on every deploy: if the user already exists, its password
    and email are refreshed to match the current env vars rather than
    erroring out (unlike `createsuperuser --noinput`, which fails if the
    username is already taken).

    If any of the three env vars are missing, this command does nothing
    and exits quietly — it never blocks a deploy.
    """

    help = 'Creates or updates a superuser from DJANGO_SUPERUSER_* environment variables.'

    def handle(self, *args, **options):
        username = config('DJANGO_SUPERUSER_USERNAME', default='')
        email = config('DJANGO_SUPERUSER_EMAIL', default='')
        password = config('DJANGO_SUPERUSER_PASSWORD', default='')

        if not username or not password:
            self.stdout.write(self.style.WARNING(
                'DJANGO_SUPERUSER_USERNAME/PASSWORD not set — skipping superuser setup.'
            ))
            return

        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'is_staff': True, 'is_superuser': True},
        )
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created superuser "{username}".'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Updated existing superuser "{username}".'))
