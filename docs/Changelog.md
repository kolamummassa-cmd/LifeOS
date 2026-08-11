# LifeOS — Changelog

## [0.1.0] — 2026-08-11

### Added
- Full V1 backend: Django + DRF + PostgreSQL, JWT authentication, apps for accounts, academies, resources, notes, goals, journal, habits, people, and integrations.
- Academy system with anchor vs. rotating types and Academy Rotation (start/end periods with end-of-rotation review).
- Learning Resources: Books, Podcasts, Videos (each with type-specific detail fields) plus a generic Resource type for Courses/Articles/Documentation/PDFs/Websites.
- Notes (second brain) with tags and cross-linking to resources, goals, and other notes.
- Goals with milestones and computed progress.
- Journal with daily/weekly/monthly/quarterly/yearly entries and guided prompts.
- Habits with daily toggle tracking, surfaced as "Anchor Habits" on the dashboard.
- Dashboard aggregating today's Software Engineering block, current rotating Academy, anchor habits, and learning counts.
- Basic search across Resources, Notes, and Goals.
- Minimal Networking "People" list.
- Google Drive integration skeleton (OAuth flow, folder auto-creation per Academy, file upload for any attachment type) — inactive until Google Cloud credentials are added.
- Full V1 frontend: React + TypeScript + Vite + Tailwind, dark-mode-first design system, JWT auth flow with silent refresh, pages for every V1 feature.
- Seed command (`seed_academies`) creating all eleven Academies and the four default anchor habits.
- 13 backend automated tests covering resource creation, goal progress, habit toggling, and academy rotation.
- Deployment configuration (Procfile-equivalent via gunicorn + whitenoise, environment variable templates) for Railway/Render + Vercel/Netlify.

### Notes
- Milestone 17 (live deployment) and Milestone 18 (live Google Drive connection) require Kolamu's own hosting and Google Cloud credentials to activate — see docs/Roadmap.md.
