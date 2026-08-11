# LifeOS — Roadmap

## V1 Milestones

| # | Milestone | Status |
|---|-----------|--------|
| 0 | Documentation | Done |
| 1 | Project setup (Django + Vite/React, Postgres via Docker Compose) | Done |
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
| 17 | Deployment prep (configs only — live deploy needs Kolamu's hosting accounts) | Prepared, not deployed |
| 18 | Google Drive integration (skeleton — needs Kolamu's Google Cloud OAuth credentials) | Scaffolded, not activated |

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

**Milestone 17 (Deployment):** create accounts on a hosting provider (e.g. Railway or Render for backend+Postgres, Vercel or Netlify for frontend). The backend already has a `Procfile` (gunicorn + auto-migrate on release) and `whitenoise` for static files; the frontend already has `vercel.json` for SPA routing. Set the environment variables documented in `backend/.env.example` and `frontend/.env.example` on your hosting provider, point it at this repo, and deploy.

**Milestone 18 (Google Drive):** create a Google Cloud project, enable the Drive API, create OAuth client credentials, and add them to `backend/.env` as `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`. Then run the one-time setup command described in the `integrations` app README to create the `LifeOS/` folder structure.
