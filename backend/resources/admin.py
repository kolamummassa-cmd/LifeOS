from django.contrib import admin

from .models import Attachment, BookDetail, PodcastDetail, Resource, VideoDetail


class BookDetailInline(admin.StackedInline):
    model = BookDetail


class PodcastDetailInline(admin.StackedInline):
    model = PodcastDetail


class VideoDetailInline(admin.StackedInline):
    model = VideoDetail


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'resource_type', 'academy', 'status')
    list_filter = ('resource_type', 'status', 'academy')
    inlines = [BookDetailInline, PodcastDetailInline, VideoDetailInline]


admin.site.register(Attachment)
