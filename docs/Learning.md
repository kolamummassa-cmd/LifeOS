# LifeOS — Learning Log

This file is meant for Kolamu's own reflections while building and living with LifeOS. Because V1 was built in one continuous pass rather than milestone-by-milestone with explanation at each step, this first entry lists the concepts embedded in the codebase that are worth understanding — treat it as a study list, not a lecture.

## Concepts worth understanding from this codebase

**Base + detail table design** (`resources/models.py`): `Resource` holds fields shared by every learning resource; `BookDetail`/`PodcastDetail`/`VideoDetail` hold the fields specific to each type, linked with a one-to-one foreign key. This is a standard way to avoid a single table with dozens of always-empty columns. Worth reading `resources/serializers.py` alongside it to see how the split is hidden from the API consumer.

**JWT authentication** (`accounts/`, `config/settings.py` `SIMPLE_JWT`): how access/refresh tokens work, why the frontend keeps a short-lived access token and a longer-lived refresh token, and how `frontend/src/lib/api/client.ts` automatically retries a failed request after silently refreshing the token.

**Django apps organized by domain**, not by layer — each of `academies`, `resources`, `notes`, `goals`, `journal`, `habits` is a self-contained Django app with its own models/serializers/views/urls, rather than one giant app or separate "models app" / "views app". Worth understanding why this scales better as a codebase grows.

**Computed vs. stored aggregates** (`core/dashboard.py`): the dashboard and progress numbers are calculated on every request instead of being stored and updated. Worth understanding the trade-off — simpler and always correct at this scale, but would need to change if the data volume ever got much larger.

**React Query for server state** (`frontend/src/features/**`): notice how pages don't manually track loading/error state — `useQuery` and `useMutation` do it, including cache invalidation after a mutation (`queryClient.invalidateQueries`).

## Prompts to fill in as you use LifeOS

- What surprised you about how the Academy rotation actually works day to day?
- Where did the data model get in the way of how you actually think about your learning?
- What's the first thing you changed about LifeOS after using it for a week?
- What backend or frontend concept from this build do you want to go deeper on next in the Software Engineering Academy?
