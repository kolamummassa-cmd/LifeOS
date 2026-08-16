#!/usr/bin/env bash
# Runs the whole LifeOS stack (backend + frontend) from one terminal.
# Assumes PostgreSQL is already installed natively and running as a system service.
# Usage: ./scripts/dev.sh
# Stop everything with Ctrl+C.

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cleanup() {
  echo ""
  echo "Stopping backend (frontend already stopped)..."
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "==> Checking PostgreSQL is running..."
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  echo "PostgreSQL doesn't seem to be running on localhost:5432."
  echo "Start it with: sudo systemctl start postgresql"
  exit 1
fi

echo "==> Starting Django backend on http://localhost:8000 ..."
cd "$ROOT_DIR/backend"
if [ ! -d venv ]; then
  echo "No venv found in backend/. Run the one-time setup from README.md first."
  exit 1
fi
source venv/bin/activate
python manage.py runserver > "$ROOT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "    backend PID $BACKEND_PID (logs: backend.log)"

# Give Django a moment to boot before the frontend starts hitting it.
sleep 2

echo "==> Starting frontend on http://localhost:5173 ..."
cd "$ROOT_DIR/frontend"
npm run dev
