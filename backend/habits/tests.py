from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .models import Habit, HabitLog


class HabitToggleTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='kolamu', password='testpass123')
        self.client.force_authenticate(user=self.user)
        self.habit = Habit.objects.create(name='Prayer', is_anchor=True)

    def test_toggle_today_creates_log(self):
        response = self.client.post(f'/api/habits/{self.habit.id}/toggle_today/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(HabitLog.objects.filter(habit=self.habit, date=timezone.localdate()).exists())

    def test_toggle_today_twice_flips_completed(self):
        self.client.post(f'/api/habits/{self.habit.id}/toggle_today/')
        response = self.client.post(f'/api/habits/{self.habit.id}/toggle_today/')
        log = HabitLog.objects.get(habit=self.habit, date=timezone.localdate())
        self.assertFalse(log.completed)
        self.assertFalse(response.data['completed'])
