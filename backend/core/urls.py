from django.urls import path
from rest_framework.routers import DefaultRouter

from .dashboard import dashboard_summary
from .views import TagViewSet, health_check, search

router = DefaultRouter()
router.register('tags', TagViewSet, basename='tag')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('search/', search, name='search'),
    path('dashboard/', dashboard_summary, name='dashboard-summary'),
] + router.urls
