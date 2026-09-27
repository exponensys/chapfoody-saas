/**
 * Provisions the least-privilege application role (prisma/sql/app-role.sql).
 *
 * A local convention for developers without `psql`; in a real environment the SQL file is
 * applied by a database administrator. Kept as a script so provisioning is reproducible and
 * reviewable instead of a one-off command nobody can repeat.
 *
 *   ADMIN_DATABASE_URL="postgresql://owner:…@host/db" \
 *   APP_ROLE_PASSWORD="…" \
 *     node prisma/sql/provision-app-role.mjs
 *
 * ADMIN_DATABASE_URL must be the schema owner (it needs CREATEROLE and DDL rights). Note
 * that on Neon the owner also carries BYPASSRLS — which is precisely why this role has to
 * exist: an application connected as the owner would bypass every row-level security
 * policy, silently.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import pg from 'pg';

const adminUrl = process.env.ADMIN_DATABASE_URL;
const appRolePassword = process.env.APP_ROLE_PASSWORD;

if (adminUrl === undefined || adminUrl === '') {
  process.stderr.write('ADMIN_DATABASE_URL is not set (the schema owner connection string).\n');
  process.exit(1);
}

if (appRolePassword === undefined || appRolePassword === '') {
  process.stderr.write('APP_ROLE_PASSWORD is not set.\n');
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));

const sql = readFileSync(join(here, 'app-role.sql'), 'utf8')
  // psql variables do not exist over the wire protocol, so the token is substituted.
  // `replaceAll`, not `replace`: the token also appears in the file's comments, and a
  // single-match replace silently rewrote the comment instead of the statement.
  .replaceAll(':app_role_password', `'${appRolePassword}'`);

const client = new pg.Client({ connectionString: adminUrl, connectionTimeoutMillis: 20_000 });

try {
  await client.connect();

  // Report the owner's attributes first: on a managed platform this is where a
  // BYPASSRLS surprise shows up, before it becomes a silently unprotected database.
  const { rows: owner } = await client.query(
    'SELECT current_user AS who, rolsuper, rolbypassrls FROM pg_roles WHERE rolname = current_user',
  );
  process.stdout.write(`owner : ${JSON.stringify(owner[0])}\n`);

  await client.query(sql);

  const { rows: app } = await client.query(
    "SELECT rolname, rolsuper, rolbypassrls, rolcanlogin FROM pg_roles WHERE rolname = 'chapfoody_app'",
  );
  process.stdout.write(`app   : ${JSON.stringify(app[0])}\n`);
} catch (error) {
  process.stderr.write(`Provisioning failed: ${String(error)}\n`);
  process.exitCode = 1;
} finally {
  await client.end();
}
