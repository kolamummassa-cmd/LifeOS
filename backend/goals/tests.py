from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .models import Goal, Milestone


class GoalProgressTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='kolamu', password='testpass123')
        self.client.force_authenticate(user=self.user)

    def test_progress_percent_with_no_milestones_is_zero(self):
        goal = Goal.objects.create(title='Become a backend developer')
        self.assertEqual(goal.progress_percent, 0)

    def test_progress_percent_reflects_completed_milestones(self):
        goal = Goal.objects.create(title='Become a backend developer')
        Milestone.objects.create(goal=goal, title='Learn Python', is_complete=True)
        Milestone.objects.create(goal=goal, title='Learn Django', is_complete=False)
        self.assertEqual(goal.progress_percent, 50)

    def test_milestone_toggle_via_api(self):
        goal = Goal.objects.create(title='Ship a project')
        milestone = Milestone.objects.create(goal=goal, title='Deploy it')

        response = self.client.patch(f'/api/milestones/{milestone.id}/', {'is_complete': True})
        self.assertEqual(response.status_code, 200)
        milestone.refresh_from_db()
        self.assertTrue(milestone.is_complete)
