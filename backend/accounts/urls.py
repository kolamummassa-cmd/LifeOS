from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import me

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('me/', me, name='me'),
]
