from rest_framework import serializers

from .models import Academy, AcademyPeriod


class AcademyPeriodSerializer(serializers.ModelSerializer):
    academy_name = serializers.CharField(source='academy.name', read_only=True)

    class Meta:
        model = AcademyPeriod
        fields = [
            'id', 'academy', 'academy_name', 'start_date', 'end_date',
            'objective', 'expected_outcome', 'is_current',
            'reflection_what_learned', 'reflection_what_improved',
            'reflection_what_needs_work', 'reflection_continue_practicing',
            'created_at', 'updated_at',
        ]


class AcademySerializer(serializers.ModelSerializer):
    current_period = serializers.SerializerMethodField()
    resource_count = serializers.IntegerField(source='resources.count', read_only=True)
    goal_count = serializers.IntegerField(source='goals.count', read_only=True)

    class Meta:
        model = Academy
        fields = [
            'id', 'name', 'slug', 'description', 'academy_type', 'color', 'icon',
            'is_active', 'drive_folder_id', 'current_period',
            'resource_count', 'goal_count', 'created_at', 'updated_at',
        ]

    def get_current_period(self, obj):
        period = obj.periods.filter(is_current=True).first()
        return AcademyPeriodSerializer(period).data if period else None
