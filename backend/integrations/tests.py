from unittest.mock import Mock, patch

from django.contrib.auth.models import User
from django.test import override_settings
from rest_framework.test import APITestCase


@override_settings(GOOGLE_CLIENT_ID='client-id', GOOGLE_CLIENT_SECRET='client-secret')
class GoogleDriveOAuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='kolamu', password='test-password')

    @patch('integrations.views.drive_service.build_flow')
    def test_auth_start_stores_oauth_state_in_session(self, mock_build_flow):
        self.client.force_authenticate(self.user)
        flow = Mock()
        flow.authorization_url.return_value = ('https://accounts.google.com/authorize', 'random-state')
        mock_build_flow.return_value = flow

        response = self.client.get('/api/integrations/drive/auth/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['authorization_url'], 'https://accounts.google.com/authorize')
        self.assertEqual(self.client.session['google_oauth_state'], 'random-state')

    def test_auth_start_requires_login(self):
        response = self.client.get('/api/integrations/drive/auth/')

        self.assertEqual(response.status_code, 401)

    def test_callback_rejects_missing_or_mismatched_state(self):
        session = self.client.session
        session['google_oauth_state'] = 'expected-state'
        session.save()

        response = self.client.get(
            '/api/integrations/drive/callback/',
            {'code': 'authorization-code', 'state': 'wrong-state'},
        )

        self.assertEqual(response.status_code, 400)

    @patch('integrations.views.drive_service.save_credential_from_flow')
    @patch('integrations.views.drive_service.build_flow')
    def test_callback_accepts_matching_state(self, mock_build_flow, mock_save):
        session = self.client.session
        session['google_oauth_state'] = 'expected-state'
        session.save()
        flow = Mock()
        mock_build_flow.return_value = flow

        response = self.client.get(
            '/api/integrations/drive/callback/',
            {'code': 'authorization-code', 'state': 'expected-state'},
        )

        self.assertEqual(response.status_code, 200)
        mock_build_flow.assert_called_once_with(state='expected-state')
        flow.fetch_token.assert_called_once_with(code='authorization-code')
        mock_save.assert_called_once_with(flow)
