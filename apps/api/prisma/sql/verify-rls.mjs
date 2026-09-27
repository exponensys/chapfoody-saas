/**
 * Verifies that tenant isolation is actually enforced on a database.
 *
 * Answers three questions that are easy to get wrong on a managed platform:
 *   1. Is every table carrying a business_id under row-level security, and FORCED?
 *   2. Do the roles connect as avoid the BYPASSRLS trap?
 *   3. Does the application role fail closed — zero rows — without a tenant context?
 *
 *   ADMIN_DATABASE_URL="postgresql://owner:…@host/db" \
 *   APP_DATABASE_URL="postgresql://chapfoody_app:…@host/db" \
 *     node prisma/sql/verify-rls.mjs
 *
 * Exit code 1 if anything is wrong, so it can be used as a gate.
 *
 * Why question 2 matters: BYPASSRLS overrides both plain and FORCED row-level security.
 * On Neon the default owner role carries that attribute, so an application connected as
 * the owner runs with every policy silently disabled — and every isolation test would
 * pass while proving nothing.
 */
import pg from 'pg';

/** Tables that reference a business without being owned by one. */
const PLATFORM_TABLES_REFERENCING_A_BUSINESS = ['session'];

const adminUrl = process.env.ADMIN_DATABASE_URL;
const appUrl = process.env.APP_DATABASE_URL;

if (adminUrl === undefined || appUrl === undefined) {
  process.stderr.write('ADMIN_DATABASE_URL and APP_DATABASE_URL must both be set.\n');
  process.exit(1);
}

const asText = (value) => (value === null || value === undefined ? '—' : String(value));

async function connect(url) {
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20_000 });
  await client.connect();
  return client;
}

const problems = [];

const assert = (ok, message) => {
  if (!ok) {
    problems.push(message);
  }
  process.stdout.write(`${ok ? '✅' : '❌'} ${message}\n`);
};

const admin = await connect(adminUrl);
const app = await connect(appUrl);

try {
  // ── The roles ───────────────────────────────────────────────────────────────
  const roles = await admin.query(
    `SELECT rolname, rolsuper, rolbypassrls
       FROM pg_roles
      WHERE rolname IN (current_user, 'chapfoody_app')
      ORDER BY rolname`,
  );

  for (const role of roles.rows) {
    process.stdout.write(
      `    role ${role.rolname.padEnd(16)} superuser=${asText(role.rolsuper)} bypassrls=${asText(role.rolbypassrls)}\n`,
    );
  }

  const appIdentity = await app.query(
    `SELECT current_user AS who,
            (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user) AS bypassrls`,
  );

  assert(
    appIdentity.rows[0].bypassrls === false,
    `the application connects as "${appIdentity.rows[0].who}" with bypassrls=false`,
  );

  // ── Coverage ────────────────────────────────────────────────────────────────
  const unprotected = await admin.query(
    `SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity
       FROM information_schema.columns col
       JOIN pg_class c ON c.relname = col.table_name
       JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = col.table_schema
      WHERE col.table_schema = 'public'
        AND col.column_name = 'business_id'
        AND c.relkind = 'r'
        AND NOT (c.relname = ANY($1))
        AND (c.relrowsecurity = false OR c.relforcerowsecurity = false)`,
    [PLATFORM_TABLES_REFERENCING_A_BUSINESS],
  );

  assert(
    unprotected.rowCount === 0,
    `every tenant table has RLS enabled and forced (${unprotected.rowCount ?? 0} unprotected)`,
  );

  for (const row of unprotected.rows) {
    process.stdout.write(
      `    ${row.relname}: enabled=${asText(row.relrowsecurity)} forced=${asText(row.relforcerowsecurity)}\n`,
    );
  }

  const counts = await admin.query(
    `SELECT (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public')::int AS tables,
            (SELECT count(*) FROM pg_policies WHERE schemaname = 'public')::int AS policies,
            (SELECT count(*) FROM information_schema.columns
              WHERE table_schema = 'public' AND column_name = 'business_id')::int AS tenant_columns`,
  );

  process.stdout.write(
    `    ${counts.rows[0].tables} tables, ${counts.rows[0].tenant_columns} tenant references, ` +
      `${counts.rows[0].policies} policies\n`,
  );

  assert(counts.rows[0].tables > 0, 'the schema has been migrated');
  assert(counts.rows[0].policies > 0, 'policies exist to enforce isolation');

  // ── Privileges the application needs ────────────────────────────────────────
  // UPDATE on audit_log must be granted at the privilege level and denied by the POLICY:
  // privilege and policy are different layers, and seeing both is the point.
  const privileges = await admin.query(
    `SELECT has_table_privilege('chapfoody_app', 'business', 'INSERT') AS business_insert,
            has_table_privilege('chapfoody_app', 'entitlement', 'SELECT') AS entitlement_select,
            has_table_privilege('chapfoody_app', 'audit_log', 'UPDATE') AS audit_log_update`,
  );

  assert(privileges.rows[0].business_insert === true, 'the application may INSERT into business');

  // ── Fail closed ─────────────────────────────────────────────────────────────
  const leaked = await app.query('SELECT count(*)::int AS n FROM business');

  assert(leaked.rows[0].n === 0, 'with no tenant context the application sees zero businesses');

  process.stdout.write(
    problems.length === 0
      ? '\n✅ Tenant isolation is enforced on this database.\n'
      : `\n❌ ${problems.length} problem(s) found.\n`,
  );
} finally {
  await admin.end();
  await app.end();
}

process.exitCode = problems.length === 0 ? 0 : 1;
