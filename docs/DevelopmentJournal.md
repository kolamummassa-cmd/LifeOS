# LifeOS — Development Journal

Records major decisions, problems, solutions, and lessons as LifeOS is built. Newest entries at the top.

## 2026-09-28 — Reliability and production-safety pass

Aligned daily habit and dashboard dates with the configured local timezone (`Africa/Nairobi` by default) instead of the server machine's calendar date. Added OAuth `state` validation to the Google Drive connection flow so a callback must match the browser session that initiated it. Documentation was also corrected to reflect the frontend's actual JWT storage strategy and current automated test count.

## 2026-08-16 — Dropped Docker for local Postgres

Local setup originally ran PostgreSQL via Docker Compose. On Kolamu's machine (Ubuntu, Docker installed from the official `docker-ce` repo), the Postgres container would intermittently fail to authenticate connections coming from the host over the published port, even though the exact same credentials worked perfectly from inside the container. Traced it down methodically: verified the `.env` file was clean, verified the container's actual `POSTGRES_PASSWORD` env var, verified auth worked over a real TCP connection from inside the container — all fine. The failure was isolated specifically to the host→container path through Docker's `docker-proxy`, which is a known source of flakiness on Ubuntu 24.04 due to its nftables-based firewall backend.

Rather than keep fighting Docker's networking layer for a single-developer local setup, switched local Postgres to a native (non-Docker) install. `docker-compose.yml` is gone; `scripts/setup-db.sh` creates the `lifeos` role/database directly via `psql`, and `scripts/dev.sh` just checks `pg_isready` before starting the backend. Production deployment (Milestone 17) isn't affected — it can still use Docker or a managed Postgres service on whatever host is chosen; this only affects local development.

**Lesson:** when a "simple" piece of infrastructure (Docker, in this case) is the thing generating all the friction rather than the actual application code, it's worth cutting it out rather than debugging it indefinitely — especially for a solo local dev loop where the extra abstraction wasn't buying much in the first place.

## 2026-08-11 — V1 build (Milestones 0–18)

**What was built:** The full V1 backend (Django + DRF + PostgreSQL) and frontend (React + TypeScript + Vite + Tailwind) covering every V1 feature — Academies, Resources (Books/Podcasts/Videos/generic), Notes, Goals, Academy Rotation, Journal, Habits, Dashboard, Progress, Search, Settings — plus a Google Drive integration skeleton (Milestone 18) and deployment configuration (Milestone 17).

**Key decisions made along the way:**

- **PostgreSQL from day one**, no SQLite phase, per Kolamu's explicit instruction. Verified by running real migrations, the full test suite, and live API calls against a real Postgres instance during development.
- **Google Drive gets real OAuth integration, not just a manual link field**, because Kolamu specifically wants LifeOS to auto-create a `LifeOS/<Academy>` folder structure and upload attachments of any file type (not just images) automatically. It's scheduled as Milestone 18, immediately after deployment, rather than inside the initial build, because OAuth + Drive API is a genuinely separate subsystem best built against a stable, already-working app.
- **Tags auto-create on first use** (`TagRelatedField` in `core/serializers.py`). The first implementation used DRF's stock `SlugRelatedField`, which rejects unknown tag names — caught during manual API testing when creating a Note with a new tag returned a 400. Fixed by writing a small custom field that does `get_or_create` instead of a strict lookup, matching the intent that tags should be created in the flow of writing, not as a separate step.
- **Resource base + detail tables** (Resource / BookDetail / PodcastDetail / VideoDetail) rather than one wide table. The serializers flatten this into a single object over the API (e.g. `BookSerializer`) so the frontend never has to know about the split — verified end-to-end with a real book create + progress update through the API.
- **Academy rotation modeled as `AcademyPeriod` records**, not a field on Academy, so the rotation history and the end-of-rotation review naturally fall out of the same table.

**How this was verified:** Every backend endpoint was exercised with real HTTP requests (login, academy CRUD, book creation with nested detail, notes with tags, habit toggle, journal entry, academy period, search) against a live Postgres-backed Django server before being considered done. The frontend was verified with a clean TypeScript compile and a successful production build. The backend suite has since grown to 19 tests covering base/detail resource creation, goal progress, habit toggling, Academy behavior, authentication enforcement, Drive folder creation, and OAuth state validation.

**What's not done:** Milestone 17 (deployment) and Milestone 18 (Google Drive) are code-complete but not activated — they need Kolamu's own hosting accounts and Google Cloud OAuth credentials respectively, which only he can create. See docs/Roadmap.md for the exact steps.
