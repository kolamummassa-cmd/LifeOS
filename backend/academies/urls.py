from rest_framework.routers import DefaultRouter

from .views import AcademyPeriodViewSet, AcademyViewSet

router = DefaultRouter()
router.register('academies', AcademyViewSet, basename='academy')
router.register('academy-periods', AcademyPeriodViewSet, basename='academy-period')

urlpatterns = router.urls
