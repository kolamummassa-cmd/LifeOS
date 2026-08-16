# LifeOS

A personal Life Operating System — the system through which Kolamu intentionally becomes the person he's working to become. See `docs/Vision.md` for why this exists, and `docs/Roadmap.md` for what's built and what's next.

## Stack

React + TypeScript + Vite + Tailwind (frontend) · Django + Django REST Framework + PostgreSQL (backend).

## Running it locally

### 1. Database

PostgreSQL runs natively (no Docker) — simpler for local dev, and it's what avoided a run of Docker networking issues during setup.

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
./scripts/setup-db.sh   # creates the lifeos role + database, safe to re-run
```

This gives you PostgreSQL on `localhost:5432` with the database, user, and password already matching `backend/.env`.

### 2. Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # already has matching defaults for the native Postgres setup above
python manage.py migrate
python manage.py seed_academies      # creates the 11 Academies + 4 default anchor habits
python manage.py createsuperuser     # your login
python manage.py runserver
```

API runs at `http://localhost:8000/api/`. Admin at `http://localhost:8000/admin/`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`.

## Running the tests

```bash
cd backend
python manage.py test
```

## Project structure

```
LifeOS/
  frontend/     React + TypeScript + Vite + Tailwind
  backend/      Django + DRF, one app per domain
  docs/         Vision, architecture, roadmap, brand guide, journal, changelog
  assets/       Static design assets
  scripts/      One-off utility scripts
```

## What's next

Milestone 17 (deployment) and Milestone 18 (Google Drive) are built but not activated — they need your own hosting accounts and Google Cloud OAuth credentials. See `docs/Roadmap.md` for the exact steps.
