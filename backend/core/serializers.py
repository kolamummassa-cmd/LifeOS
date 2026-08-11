from rest_framework import serializers

from .models import Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class TagRelatedField(serializers.SlugRelatedField):
    """
    Like SlugRelatedField, but creates the Tag if it doesn't exist yet
    instead of raising a validation error. This is what lets Kolamu type
    a brand-new tag on a Note or Resource without a separate "create tag
    first" step — tags are meant to be created in the flow of writing.
    """

    def __init__(self, **kwargs):
        kwargs.setdefault('slug_field', 'name')
        kwargs.setdefault('queryset', Tag.objects.all())
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        tag, _ = Tag.objects.get_or_create(**{self.slug_field: data})
        return tag
