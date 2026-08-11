from django.urls import path

from .views import drive_auth_callback, drive_auth_start, drive_status

urlpatterns = [
    path('drive/status/', drive_status, name='drive-status'),
    path('drive/auth/', drive_auth_start, name='drive-auth-start'),
    path('drive/callback/', drive_auth_callback, name='drive-auth-callback'),
]
