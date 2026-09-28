/**
 * db:reset — rebuild the LOCAL database from the migrations, then re-provision the app role.
 *
 * ── Why the consent is encoded rather than bypassed ──────────────────────────
 * The implementation plan accepts, deliberately, that Prisma refuses `migrate reset` as destructive
 * without explicit human consent: the same connection string that points at a laptop also points at
 * the branch that holds production credentials. Throwing `--force` into package.json would delete
 * that safety property for everyone, forever, to save one prompt.
 *
 * So this script refuses to run unless BOTH the owner connection (DIRECT_URL) and the application
 * connection (DATABASE_URL) are local. There is no flag to override it — an override flag is a prompt
 * with extra steps, and the failure mode is a dropped production schema. A remote branch is rebuilt by
 * recreating the branch, deliberately, by someone who means it.
 *
 * ── Why not `prisma migrate reset` ───────────────────────────────────────────
 * Two reasons, both discovered by trying it.
 *
 * 1. Prisma 7 removed `--skip-seed`, so the reset cannot be told not to seed. If it seeds, it seeds
 *    as the APPLICATION role — and the schema it just recreated has no grants for that role yet,
 *    because `USAGE ON SCHEMA public` belongs to the schema that was dropped. The rebuild would fail
 *    partway with a permission error that looks like an RLS bug, and the order could not be fixed
 *    from inside one command.
 * 2. `DROP SCHEMA public CASCADE` followed by `migrate deploy` is the same end state, is completely
 *    deterministic, and proves the stronger property: every migration replays from EMPTY. That is the
 *    property that broke on the second database this schema was deployed to, and it is worth proving
 *    on every rebuild rather than only on a fresh branch.
 *
 * Seeding stays a separate command on purpose: `pnpm db:reset && pnpm db:seed` is the definition of
 * done, and a failed seed must never be confusable with a failed rebuild.
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

import pg from 'pg';

const ENV_FILE = '.env.local';

if (existsSync(ENV_FILE)) {
  process.loadEnvFile(ENV_FILE);
}

/** Hosts considered local. Anything else is a remote database and this script will not touch it. */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

/** The host of a PostgreSQL URL, or null when it cannot be parsed. */
function hostOf(url) {
  if (url === undefined || url === '') {
    return null;
  }

  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const ownerUrl = process.env.DIRECT_URL ?? '';
const appUrl = process.env.DATABASE_URL ?? '';

const ownerHost = hostOf(ownerUrl);
const appHost = hostOf(appUrl);

if (ownerHost === null || appHost === null) {
  process.stderr.write(
    'DIRECT_URL and DATABASE_URL must both be set (see apps/api/.env.local).\n' +
      `  DIRECT_URL host:   ${ownerHost ?? '(unparseable or unset)'}\n` +
      `  DATABASE_URL host: ${appHost ?? '(unparseable or unset)'}\n`,
  );
  process.exit(1);
}

if (!LOCAL_HOSTS.has(ownerHost) || !LOCAL_HOSTS.has(appHost)) {
  process.stderr.write(
    'REFUSING TO RESET: this script only rebuilds a LOCAL database.\n' +
      `  DIRECT_URL host:   ${ownerHost}\n` +
      `  DATABASE_URL host: ${appHost}\n\n` +
      'A remote database is rebuilt by recreating its branch, on purpose, by someone who means it —\n' +
      'not by a convenience script that a tired person runs in the wrong directory. There is no flag\n' +
      'to override this.\n',
  );
  process.exit(1);
}

// The password comes from the application URL rather than a second variable: it is the same secret,
// and asking for it twice invites the two copies to disagree — which presents as an authentication
// failure that looks like a provisioning failure.
const appPassword = decodeURIComponent(new URL(appUrl).password);

if (appPassword === '') {
  process.stderr.write(
    'DATABASE_URL carries no password, so the app role cannot be re-provisioned.\n' +
      'Add one to the URL in .env.local and run this again.\n',
  );
  process.exit(1);
}

process.stdout.write(`Resetting ${ownerHost} (local): dropping the schema, then replaying migrations.\n`);

const owner = new pg.Client({ connectionString: ownerUrl, connectionTimeoutMillis: 20_000 });

try {
  await owner.connect();

  // One transaction, so a failure leaves the old schema rather than nothing at all.
  await owner.query('begin');
  await owner.query('drop schema if exists public cascade');
  await owner.query('create schema public');
  await owner.query('commit');

  process.stdout.write('Schema dropped. Replaying every migration from empty.\n');
} catch (error) {
  await owner.query('rollback').catch(() => undefined);
  process.stderr.write(`Could not drop the schema: ${String(error)}\n`);
  process.exit(1);
} finally {
  await owner.end();
}

// `migrate deploy`, not `migrate dev`: it applies the migrations exactly as written, in order, without
// generating anything, which is what makes this a faithful rebuild rather than a re-derivation.
execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], { stdio: 'inherit' });

process.stdout.write('Re-provisioning the app role (the schema was dropped, its grants went with it).\n');

execFileSync('node', ['prisma/sql/provision-app-role.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, ADMIN_DATABASE_URL: ownerUrl, APP_ROLE_PASSWORD: appPassword },
});

process.stdout.write(
  '\nDone. The database is empty, migrated and correctly permissioned.\n' +
    'Run `pnpm db:seed` to populate it.\n',
);
