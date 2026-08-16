# LifeOS — Roadmap

## V1 Milestones

| # | Milestone | Status |
|---|-----------|--------|
| 0 | Documentation | Done |
| 1 | Project setup (Django + Vite/React, native PostgreSQL) | Done |
| 2 | Design system (Tailwind theme, base UI components) | Done |
| 3 | Backend foundation (DRF, CORS, app skeleton) | Done |
| 4 | Database models (Academy, Resource+details, Note, Goal, Journal, Habit, Person, Attachment) | Done |
| 5 | Authentication (JWT) | Done |
| 6 | Academy system | Done |
| 7 | Resources system (Books/Podcasts/Videos) | Done |
| 8 | Notes / second brain | Done |
| 9 | Goals & milestones | Done |
| 10 | Academy rotation | Done |
| 11 | Journal | Done |
| 12 | Habits | Done |
| 13 | Dashboard & progress | Done |
| 14 | Basic search | Done |
| 15 | UI polish & responsive design | Done |
| 16 | Testing (backend model/API tests) | Done |
| 17 | Deployment (backend on Render: lifeos-backend-9kqx.onrender.com) | Deployed, being configured |
| 18 | Google Drive integration (connected + auto-creates Academy folders locally) | Live locally; not yet connected on Render |

## Future (explicitly not V1)

- AI mentor / summaries / recommendations
- Advanced analytics, knowledge graph view
- Mobile application
- Calendar integration
- Full personal finance tracking
- Personal CRM
- Multi-user / SaaS / cloud sync
- Advanced habit analytics

## What "done" means for 0–16

Code exists, migrations run cleanly against Postgres, backend endpoints are reachable and tested at a basic level, frontend pages render and talk to the API. It does not mean visually perfect or feature-complete forever — it means real and usable, ready to be lived with and iterated on.

## What Kolamu needs to do to finish 17–18

**Milestone 17 (Deployment):** live on Render — backend at `https://lifeos-backend-9kqx.onrender.com`, frontend at `https://lifeos-frontend-5eil.onrender.com`. Backend env vars: `ALLOWED_HOSTS=lifeos-backend-9kqx.onrender.com` and `FRONTEND_URL=https://lifeos-frontend-5eil.onrender.com` (no trailing slash on either). Frontend env var: `VITE_API_URL=https://lifeos-backend-9kqx.onrender.com/api`. See `backend/.env.example` for the full list, each with a Render-specific example in a comment above it.

**Milestone 18 (Google Drive) on Render:** the local connection (Milestone 18 above) does not carry over to production — Render's Postgres is a separate database from your local one, so the `GoogleDriveCredential` row has to be created there too. Once `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`/`GOOGLE_OAUTH_REDIRECT_URI` are set on the Render service (using `https://lifeos-backend-9kqx.onrender.com/api/integrations/drive/callback/` as the redirect), add that same URL to Google Cloud Console's Authorized redirect URIs, then visit `https://lifeos-backend-9kqx.onrender.com/api/integrations/drive/auth/` to connect, and run `python manage.py setup_drive_folders` against the Render environment (via Render's shell) to create the folder structure there too.
