import { defineConfig } from 'prisma/config';

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
 *                               or fails.
 *
 *   DATABASE_URL (runtime)    → the application. POOLED (host contains "-pooler"),
 *                               consumed by PrismaService through the pg driver
 *                               adapter, because serverless runtimes open a
 *                               connection per invocation.
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
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
    // The seed script arrives with the domain schema in M2.
  },

  datasource: {
    url: directUrl,
  },
});
