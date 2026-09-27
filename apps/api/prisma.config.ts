import { existsSync } from 'node:fs';

import { defineConfig } from 'prisma/config';

/**
 * Load apps/api/.env.local before anything reads the environment.
 *
 * The Prisma CLI auto-loads `.env` but not `.env.local`, and our convention is
 * `.env.local` — without this, `prisma migrate` would silently fall back to the
 * unroutable placeholder below and report "can't reach database server at 127.0.0.1:1",
 * which looks like a database problem rather than a configuration one.
 *
 * Node's own loader is used rather than adding `dotenv` as a dependency, matching the
 * `--env-file-if-exists=.env.local` flag the application's scripts already pass.
 */
if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

/**
 * Prisma 7 CLI configuration.
 *
 * Prisma 7 removed connection URL settings from `schema.prisma` and requires this
 * file beside the package that declares the `prisma` dependency.
 *
 * ── The pooled / direct split ────────────────────────────────────────────────
 * Two different URLs are used for two different jobs, and mixing them up breaks
 * something:
 *
 *   DIRECT_URL   (this file)  → the Prisma CLI: `migrate`, `db pull`, `studio`.
 *                               Migrations take session-level advisory locks and
 *                               run DDL, which transaction-mode PgBouncer pooling
 *                               cannot provide. Over the pooler a migration hangs
 *                               or fails. Locally this is the schema owner.
 *
 *   DATABASE_URL (runtime)    → the application. POOLED in production (host contains
 *                               "-pooler"); consumed by PrismaService through the pg
 *                               driver adapter. It must be a NON-superuser,
 *                               NOBYPASSRLS role, otherwise row-level security is
 *                               silently ignored — see prisma/sql/app-role.sql.
 *
 * ── Why a placeholder fallback exists ────────────────────────────────────────
 * `prisma generate` and `prisma validate` never open a connection, and they run in
 * pre-build hooks so that a fresh clone works. Without a URL they would fail on a
 * missing environment variable for no reason.
 *
 * The placeholder points at port 1 — unroutable — so that any command which does
 * need a database fails immediately and visibly instead of silently operating on
 * the wrong database.
 */
const UNROUTABLE_PLACEHOLDER = 'postgresql://prisma-config:placeholder@127.0.0.1:1/chapfoody';

const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? UNROUTABLE_PLACEHOLDER;

export default defineConfig({
  // A FOLDER: the schema is split by domain (see prisma/models/*.prisma).
  // Prisma requires `schema.prisma` — the file holding the generator block — to sit
  // in this directory, with `migrations/` beside it. Domain files live in `models/`.
  schema: 'prisma',

  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },

  datasource: {
    url: directUrl,
  },
});
