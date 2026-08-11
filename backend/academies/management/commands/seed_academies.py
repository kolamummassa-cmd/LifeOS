from django.utils.text import slugify

from django.core.management.base import BaseCommand

from academies.models import Academy
from habits.models import Habit

ACADEMIES = [
    ('Software Engineering', Academy.ANCHOR, '#3B82F6', 'Programming, architecture, and building real software.'),
    ('Business', Academy.ROTATING, '#14B8A6', 'Entrepreneurship, strategy, and how companies actually work.'),
    ('Leadership', Academy.ROTATING, '#F59E0B', 'Decision-making, character, and leading others well.'),
    ('Communication', Academy.ROTATING, '#22C55E', 'Speaking, writing, and persuasion.'),
    ('Financial Intelligence', Academy.ROTATING, '#EF4444', 'Financial literacy — understanding money before growing it.'),
    ('Spiritual Growth', Academy.ANCHOR, '#A855F7', 'Prayer, scripture, and spiritual maturity.'),
    ('Relationships', Academy.ROTATING, '#EC4899', 'Friendship, family, and becoming a good husband and father.'),
    ('Health', Academy.ANCHOR, '#10B981', 'Exercise, nutrition, sleep, and mental wellbeing.'),
    ('Philosophy', Academy.ROTATING, '#6366F1', 'Critical thinking, ethics, and worldviews.'),
    ('Networking', Academy.ROTATING, '#0EA5E9', 'Building meaningful professional relationships.'),
    ('Journal / Reflection', Academy.ANCHOR, '#64748B', 'Daily, weekly, monthly, quarterly, and yearly review.'),
]

ANCHOR_HABITS = ['Prayer', 'Bible Reading', 'Exercise', 'Journal']


class Command(BaseCommand):
    """
    Seeds the eleven LifeOS Academies and the four default anchor habits
    shown on the dashboard mockup (Prayer, Bible Reading, Exercise, Journal).
    Safe to run more than once — uses get_or_create throughout.

    Usage: python manage.py seed_academies
    """

    help = 'Seed the eleven LifeOS Academies and default anchor habits.'

    def handle(self, *args, **options):
        for name, academy_type, color, description in ACADEMIES:
            academy, created = Academy.objects.get_or_create(
                name=name,
                defaults={
                    'slug': slugify(name),
                    'academy_type': academy_type,
                    'color': color,
                    'description': description,
                },
            )
            self.stdout.write(f'{"Created" if created else "Already exists"}: {academy.name}')

        spiritual = Academy.objects.filter(name='Spiritual Growth').first()
        health = Academy.objects.filter(name='Health').first()
        habit_academy = {'Prayer': spiritual, 'Bible Reading': spiritual, 'Exercise': health, 'Journal': None}

        for habit_name in ANCHOR_HABITS:
            habit, created = Habit.objects.get_or_create(
                name=habit_name,
                defaults={'is_anchor': True, 'academy': habit_academy.get(habit_name)},
            )
            self.stdout.write(f'{"Created" if created else "Already exists"} habit: {habit.name}')

        self.stdout.write(self.style.SUCCESS('Seed complete.'))
