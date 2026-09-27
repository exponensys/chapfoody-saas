/**
 * Provisions the least-privilege application role on the local database.
 *
 * Local convenience only — in a real environment the SQL file is applied by a DBA.
 * Kept as a script so the local setup is reproducible and reviewable instead of a
 * one-off shell command nobody can repeat.
 *
 *   node prisma/sql/provision-local-role.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));

// Local development credentials, matching apps/api/.env.local.
const ADMIN = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Expo123#',
  database: 'chapfoody_db',
};

const APP_ROLE_PASSWORD = 'ChapfoodyApp#2026';

const sql = readFileSync(join(here, 'app-role.sql'), 'utf8')
  // psql variables do not exist over the wire protocol, so the token is substituted.
  // `replaceAll`, not `replace`: the token also appears in the file's comments, and a
  // single-match replace silently rewrote the comment instead of the statement.
  .replaceAll(':app_role_password', `'${APP_ROLE_PASSWORD}'`);

const client = new pg.Client(ADMIN);

try {
  await client.connect();
  await client.query(sql);

  const { rows } = await client.query(
    "select rolname, rolsuper, rolbypassrls, rolcanlogin from pg_roles where rolname = 'chapfoody_app'",
  );

  process.stdout.write(`role: ${JSON.stringify(rows[0])}\n`);
} catch (error) {
  process.stderr.write(`Provisioning failed: ${String(error)}\n`);
  process.exitCode = 1;
} finally {
  await client.end();
}
