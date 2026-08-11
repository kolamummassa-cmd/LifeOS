from django.contrib import admin

from .models import Academy, AcademyPeriod


@admin.register(Academy)
class AcademyAdmin(admin.ModelAdmin):
    list_display = ('name', 'academy_type', 'is_active')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(AcademyPeriod)
class AcademyPeriodAdmin(admin.ModelAdmin):
    list_display = ('academy', 'start_date', 'end_date', 'is_current')
