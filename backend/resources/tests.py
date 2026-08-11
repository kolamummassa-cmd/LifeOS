from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from academies.models import Academy

from .models import BookDetail, Resource


class BookResourceTests(APITestCase):
    """
    Covers the base + detail table design (see docs/Architecture.md) —
    creating a Book should transparently create both a Resource row and
    a BookDetail row, and expose them as one flat object over the API.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='kolamu', password='testpass123')
        self.client.force_authenticate(user=self.user)
        self.academy = Academy.objects.create(name='Communication', slug='communication')

    def test_create_book_creates_resource_and_detail(self):
        response = self.client.post('/api/books/', {
            'title': 'Talk Like TED',
            'academy': self.academy.id,
            'author': 'Carmine Gallo',
            'pages': 300,
            'current_page': 150,
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Resource.objects.filter(resource_type=Resource.BOOK).count(), 1)
        self.assertEqual(BookDetail.objects.count(), 1)
        self.assertEqual(response.data['progress_percent'], 50)

    def test_update_book_progress(self):
        create = self.client.post('/api/books/', {'title': 'Deep Work', 'pages': 200, 'current_page': 0})
        book_id = create.data['id']

        update = self.client.patch(f'/api/books/{book_id}/', {'current_page': 100})
        self.assertEqual(update.status_code, 200)
        self.assertEqual(update.data['progress_percent'], 50)

    def test_tags_are_created_on_the_fly(self):
        response = self.client.post('/api/books/', {'title': 'Atomic Habits', 'tags': ['habits', 'psychology']})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(set(response.data['tags']), {'habits', 'psychology'})
