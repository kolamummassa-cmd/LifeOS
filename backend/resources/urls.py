from rest_framework.routers import DefaultRouter

from .views import AttachmentViewSet, BookViewSet, PodcastViewSet, ResourceViewSet, VideoViewSet

router = DefaultRouter()
router.register('resources', ResourceViewSet, basename='resource')
router.register('books', BookViewSet, basename='book')
router.register('podcasts', PodcastViewSet, basename='podcast')
router.register('videos', VideoViewSet, basename='video')
router.register('attachments', AttachmentViewSet, basename='attachment')

urlpatterns = router.urls
