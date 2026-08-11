# LifeOS — Development Journal

Records major decisions, problems, solutions, and lessons as LifeOS is built. Newest entries at the top.

## 2026-08-11 — V1 build (Milestones 0–18)

**What was built:** The full V1 backend (Django + DRF + PostgreSQL) and frontend (React + TypeScript + Vite + Tailwind) covering every V1 feature — Academies, Resources (Books/Podcasts/Videos/generic), Notes, Goals, Academy Rotation, Journal, Habits, Dashboard, Progress, Search, Settings — plus a Google Drive integration skeleton (Milestone 18) and deployment configuration (Milestone 17).

**Key decisions made along the way:**

- **PostgreSQL from day one**, no SQLite phase, per Kolamu's explicit instruction. Verified by running real migrations, the full test suite, and live API calls against a real Postgres instance during development.
- **Google Drive gets real OAuth integration, not just a manual link field**, because Kolamu specifically wants LifeOS to auto-create a `LifeOS/<Academy>` folder structure and upload attachments of any file type (not just images) automatically. It's scheduled as Milestone 18, immediately after deployment, rather than inside the initial build, because OAuth + Drive API is a genuinely separate subsystem best built against a stable, already-working app.
- **Tags auto-create on first use** (`TagRelatedField` in `core/serializers.py`). The first implementation used DRF's stock `SlugRelatedField`, which rejects unknown tag names — caught during manual API testing when creating a Note with a new tag returned a 400. Fixed by writing a small custom field that does `get_or_create` instead of a strict lookup, matching the intent that tags should be created in the flow of writing, not as a separate step.
- **Resource base + detail tables** (Resource / BookDetail / PodcastDetail / VideoDetail) rather than one wide table. The serializers flatten this into a single object over the API (e.g. `BookSerializer`) so the frontend never has to know about the split — verified end-to-end with a real book create + progress update through the API.
- **Academy rotation modeled as `AcademyPeriod` records**, not a field on Academy, so the rotation history and the end-of-rotation review naturally fall out of the same table.

**How this was verified:** Every backend endpoint was exercised with real HTTP requests (login, academy CRUD, book creation with nested detail, notes with tags, habit toggle, journal entry, academy period, search) against a live Postgres-backed Django server before being considered done. The frontend was verified with a clean TypeScript compile and a successful production build. 13 automated backend tests cover the riskiest logic (base+detail resource creation, goal progress calculation, habit toggling, academy rotation, auth enforcement).

**What's not done:** Milestone 17 (deployment) and Milestone 18 (Google Drive) are code-complete but not activated — they need Kolamu's own hosting accounts and Google Cloud OAuth credentials respectively, which only he can create. See docs/Roadmap.md for the exact steps.
