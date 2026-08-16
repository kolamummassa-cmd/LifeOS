# LifeOS — Architecture

## System overview

Single-tenant application: a React SPA (frontend) talks to a Django REST Framework API (backend) over JSON, backed by a single PostgreSQL database. No microservices, no queues, no real-time layer.

```
[ React + TS + Vite ]  <-- JSON/REST -->  [ Django + DRF ]  <-->  [ PostgreSQL ]
                                                 |
                                                 v
                                        [ Google Drive API ]  (Milestone 18)
```

## Backend

Django project `config/`, apps split by domain:

- `accounts` — single-user auth (JWT via simplejwt)
- `academies` — Academy, AcademyPeriod
- `resources` — Resource (base) + BookDetail, PodcastDetail, VideoDetail; Attachment
- `notes` — Note, Tag
- `goals` — Goal, Milestone
- `journal` — JournalEntry
- `habits` — Habit, HabitLog
- `people` — Person (minimal networking contacts)
- `core` — shared mixins, base viewsets, search endpoint
- `integrations` — Google Drive OAuth + sync (Milestone 18)

Each app owns its own `models.py`, `serializers.py`, `views.py`, `urls.py`. DRF routers expose standard REST endpoints (`/api/academies/`, `/api/resources/`, etc.).

## Database

PostgreSQL, both in development and production. Development runs a native (non-Docker) PostgreSQL install — Docker Compose was tried first but caused persistent host-to-container networking failures (`docker-proxy` mishandling forwarded TCP connections, a known Ubuntu/nftables issue), so local dev now talks to Postgres directly with no container layer in between. Production can still run Postgres however is easiest on the chosen host (managed Postgres, or Docker, if that host's networking behaves). Key design decisions:

- **Resource uses base + detail tables**, not one wide sparse table. `Resource` holds shared fields (title, url, academy, resource_type, status, dates). `BookDetail`/`PodcastDetail`/`VideoDetail` hold type-specific fields via a one-to-one FK to `Resource`. This keeps each table meaningful and avoids dozens of always-null columns.
- **Academy rotation is modeled as `AcademyPeriod`**, not a field on Academy — a history of focus periods per academy, with the current one flagged. Software Engineering simply never needs a period marked ended.
- **Notes link to themselves** (`related_notes` M2M, self-referential) plus to Resources and Goals — this is what enables true cross-academy second-brain connections.
- **No precomputed stats table.** Progress numbers are computed via queries at request time. Simpler, always correct, no cache invalidation problem — acceptable at this data scale.
- **Attachment is generic**, not image-specific: `file`, `file_type`, `academy`, optional FK to a Resource or Note, `drive_file_id` (populated once Milestone 18 runs).

## Frontend

React + TypeScript + Vite + Tailwind CSS. Feature-folder structure:

```
src/
  features/        one folder per domain (academies, resources, notes, goals, journal, habits, dashboard)
  components/ui/    shared design-system components (Button, Card, Input, ProgressBar, Badge, Modal)
  lib/api/          typed API client (fetch wrapper + per-domain functions)
  routes/           route definitions
```

Server state (anything fetched from the API) is managed with TanStack Query — caching, refetching, and loading/error states without hand-rolled `useEffect` chains. Client-only UI state (theme, sidebar) uses React context.

## Authentication

`djangorestframework-simplejwt`. Login returns access + refresh tokens; frontend stores the access token in memory and the refresh token in an httpOnly-style pattern (kept simple for V1: refresh token in memory + silent refresh on load). Single user, no registration flow needed beyond a Django superuser created via `createsuperuser`.

## Google Drive integration (Milestone 18)

A separate `integrations` app handles:
1. OAuth2 consent flow against Kolamu's Google account (credentials supplied by Kolamu via Google Cloud Console, stored as environment variables — never hardcoded).
2. One-time setup: create `LifeOS/` root folder and one subfolder per Academy, store the resulting folder IDs on each `Academy.drive_folder_id`.
3. On Attachment upload: push the file (any type) to the Drive folder matching the Attachment's academy, store the resulting `drive_file_id` back on the Attachment.

This is deliberately isolated from the rest of the app — if Drive is ever unavailable or the integration changes, no other feature depends on it.

## Deployment (Milestone 17)

Backend: Django + Gunicorn, Postgres-backed, deployable to Railway/Render. Frontend: static Vite build, deployable to Vercel/Netlify. Environment variables hold all secrets (`SECRET_KEY`, DB credentials, Google OAuth client ID/secret) — never committed to git.

## Why these choices

Every decision above optimizes for one thing: a solo, still-learning developer being able to understand, maintain, and extend this codebase for years without needing a team. That is why there are no microservices, no premature caching layers, no complex permission system, and no AI in V1 — the architecture leaves room for all of that later without requiring it now.
