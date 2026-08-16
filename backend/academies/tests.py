from unittest.mock import patch

from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from integrations.models import GoogleDriveCredential

from .models import Academy, AcademyPeriod


class AcademyModelTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='kolamu', password='testpass123')
        self.client.force_authenticate(user=self.user)

    def test_create_anchor_academy(self):
        academy = Academy.objects.create(
            name='Software Engineering', slug='software-engineering', academy_type=Academy.ANCHOR,
        )
        self.assertEqual(academy.academy_type, Academy.ANCHOR)
        self.assertTrue(academy.is_active)

    def test_academy_api_create_and_list(self):
        response = self.client.post('/api/academies/', {
            'name': 'Communication', 'slug': 'communication', 'academy_type': 'rotating',
        })
        self.assertEqual(response.status_code, 201)

        response = self.client.get('/api/academies/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)

    def test_rotating_current_endpoint_returns_active_rotating_academy(self):
        academy = Academy.objects.create(name='Business', slug='business', academy_type=Academy.ROTATING)
        response = self.client.get('/api/academies/rotating_current/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], academy.id)

    def test_academy_period_marks_rotation(self):
        academy = Academy.objects.create(name='Leadership', slug='leadership', academy_type=Academy.ROTATING)
        period = AcademyPeriod.objects.create(
            academy=academy, start_date='2026-01-01', objective='Improve decision-making',
        )
        self.assertTrue(period.is_current)
        self.assertEqual(academy.periods.count(), 1)

    def test_unauthenticated_request_is_rejected(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/academies/')
        self.assertEqual(response.status_code, 401)

    def test_academy_creation_without_drive_connected_does_not_error(self):
        """No GoogleDriveCredential exists — creation should succeed with an empty drive_folder_id."""
        response = self.client.post('/api/academies/', {
            'name': 'Philosophy', 'slug': 'philosophy', 'academy_type': 'rotating',
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['drive_folder_id'], '')

    @patch('integrations.drive_service.find_or_create_folder')
    def test_academy_creation_auto_creates_drive_folder_when_connected(self, mock_find_or_create):
        mock_find_or_create.return_value = 'fake-folder-id-123'
        GoogleDriveCredential.objects.create(
            access_token='token', refresh_token='refresh', root_folder_id='root-folder-id',
        )

        response = self.client.post('/api/academies/', {
            'name': 'Networking', 'slug': 'networking', 'academy_type': 'rotating',
        })

        self.assertEqual(response.status_code, 201)
        mock_find_or_create.assert_called_once_with('Networking', parent_id='root-folder-id')
        academy = Academy.objects.get(slug='networking')
        self.assertEqual(academy.drive_folder_id, 'fake-folder-id-123')
