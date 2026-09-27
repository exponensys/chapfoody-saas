-- ─────────────────────────────────────────────────────────────────────────────
-- Role for the APPLICATION (runtime), not for migrations.
--
-- WHY THIS EXISTS
--   PostgreSQL exempts superusers and roles with BYPASSRLS from row-level security.
--   Connecting the API as the database owner therefore disables every tenant
--   isolation policy — silently, with no warning, and while all the isolation tests
--   still "pass" because they run as the same privileged role.
--
--   The implementation plan is explicit: "the application role is not a superuser,
--   and RLS stays enabled on every business-scoped table". This script creates that
--   role and the minimum privileges it needs.
--
-- WHO RUNS IT
--   A database administrator, once per environment, as a superuser. It is NOT part of
--   a Prisma migration: role names and passwords differ per environment and
--   credentials must never live in a migration file.
--
-- HOW TO RUN IT
--   With psql (substitutes :app_role_password safely, no credential in shell history
--   if you use a prompt):
--     psql "$ADMIN_URL" -v app_role_password="'the-password'" -f prisma/sql/app-role.sql
--
--   Or replace the :app_role_password token with a literal quoted password before
--   running. Replace chapfoody_db below with the real database name if it differs.
--
-- AFTERWARDS
--   Migrations still run as the owner (DIRECT_URL); the application runs as this role
--   (DATABASE_URL). ALTER DEFAULT PRIVILEGES below means every table created by a
--   future migration is usable by the app without an extra grant.
-- ─────────────────────────────────────────────────────────────────────────────

-- Idempotent: safe to run repeatedly.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'chapfoody_app') THEN
    CREATE ROLE chapfoody_app
      LOGIN
      NOSUPERUSER      -- must not bypass RLS
      NOBYPASSRLS      -- explicit: this is the whole point of the role
      NOCREATEDB
      NOCREATEROLE
      CONNECTION LIMIT 50;
  END IF;
END
$$;

-- Password is supplied by the caller, never committed in a migration.
ALTER ROLE chapfoody_app WITH PASSWORD :app_role_password;

-- Connect to the database and use the schema.
-- The database name is resolved dynamically: this script has to run against a local
-- database called chapfoody_db, a CI container called chapfoody and a Neon branch whose
-- name is a random identifier, and a hardcoded name would silently skip the grant in two
-- of those three — leaving the application unable to connect for reasons nobody would
-- connect back to this file.
DO $$
BEGIN
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO chapfoody_app', current_database());
END
$$;

GRANT USAGE ON SCHEMA public TO chapfoody_app;

-- Data privileges: the application reads and writes rows; it never changes the schema.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO chapfoody_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO chapfoody_app;

-- Future objects created by the migrating role are granted automatically, so a new
-- migration cannot forget a grant and leave the app broken at runtime.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO chapfoody_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO chapfoody_app;

-- Harden the schema: PUBLIC gets nothing, only explicit roles do.
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO chapfoody_app;
