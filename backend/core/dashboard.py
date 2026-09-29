"""
Dashboard aggregation (Milestone 13).

Deliberately computes everything on request rather than maintaining a
stats table — see docs/Architecture.md for why. At this data scale
(one person's personal learning records) this is fast enough, and it
means the dashboard can never show stale numbers.
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone

from academies.models import Academy
from goals.models import Goal
from habits.models import Habit
from journal.models import JournalEntry
from notes.models import Note
from resources.models import Resource


def _habit_payload(habit, today):
    return {
        'id': habit.id,
        'name': habit.name,
        'completed_today': habit.logs.filter(date=today, completed=True).exists(),
    }


def _academy_snapshot(academy):
    if not academy:
        return None
    current = Resource.objects.filter(
        academy=academy, status=Resource.CURRENTLY_LEARNING
    ).first()
    period = academy.periods.filter(is_current=True).first()
    return {
        'id': academy.id,
        'name': academy.name,
        'current_resource': current.title if current else None,
        'current_resource_progress': (
            getattr(getattr(current, 'book_detail', None), 'progress_percent', None)
            if current else None
        ),
        'period_objective': period.objective if period else None,
        'period_start': period.start_date if period else None,
        'period_end': period.end_date if period else None,
    }


@api_view(['GET'])
def dashboard_summary(request):
    today = timezone.localdate()

    software_engineering = Academy.objects.filter(
        academy_type=Academy.ANCHOR, name__icontains='Software Engineering'
    ).first()
    rotating_academy = Academy.objects.filter(
        academy_type=Academy.ROTATING, is_active=True
    ).first()

    anchor_habits = Habit.objects.filter(is_anchor=True, is_active=True)

    journal_today = JournalEntry.objects.filter(
        entry_type=JournalEntry.DAILY, period_start=today
    ).first()

    return Response({
        'software_engineering': _academy_snapshot(software_engineering),
        'rotating_academy': _academy_snapshot(rotating_academy),
        'anchor_habits': [_habit_payload(h, today) for h in anchor_habits],
        'journal_today_exists': journal_today is not None,
        'counts': {
            'books_completed': Resource.objects.filter(
                resource_type=Resource.BOOK, status__in=[Resource.COMPLETED, Resource.APPLIED, Resource.MASTERED]
            ).count(),
            'podcasts_completed': Resource.objects.filter(
                resource_type=Resource.PODCAST, status__in=[Resource.COMPLETED, Resource.APPLIED, Resource.MASTERED]
            ).count(),
            'videos_completed': Resource.objects.filter(
                resource_type=Resource.VIDEO, status__in=[Resource.COMPLETED, Resource.APPLIED, Resource.MASTERED]
            ).count(),
            'notes_created': Note.objects.count(),
            'goals_completed': Goal.objects.filter(status=Goal.COMPLETED).count(),
            'goals_in_progress': Goal.objects.filter(status=Goal.IN_PROGRESS).count(),
        },
    })
