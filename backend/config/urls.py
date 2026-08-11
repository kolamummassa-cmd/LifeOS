"""
LifeOS API — root URL configuration.

Every domain app owns its own urls.py; this file just mounts them all
under /api/. See docs/Architecture.md for the app-per-domain layout.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('accounts.urls')),
    path('api/', include('academies.urls')),
    path('api/', include('resources.urls')),
    path('api/', include('notes.urls')),
    path('api/', include('goals.urls')),
    path('api/', include('journal.urls')),
    path('api/', include('habits.urls')),
    path('api/', include('people.urls')),
    path('api/', include('core.urls')),
    path('api/integrations/', include('integrations.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
