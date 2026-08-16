#!/usr/bin/env bash
# One-time setup: creates the lifeos Postgres role + database on a native
# (non-Docker) PostgreSQL install. Safe to run more than once.
# Usage: ./scripts/setup-db.sh

set -e

sudo -u postgres psql -v ON_ERROR_STOP=0 <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'lifeos') THEN
            CREATE ROLE lifeos LOGIN PASSWORD 'lifeos_dev_password';
        END IF;
    END
    \$\$;

    SELECT 'CREATE DATABASE lifeos OWNER lifeos'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lifeos')\gexec
EOSQL

echo "Done. Database 'lifeos' and role 'lifeos' are ready on localhost:5432."
