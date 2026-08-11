from django.contrib import admin

from .models import Goal, Milestone


class MilestoneInline(admin.TabularInline):
    model = Milestone


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ('title', 'academy', 'timeframe', 'status', 'deadline')
    inlines = [MilestoneInline]
