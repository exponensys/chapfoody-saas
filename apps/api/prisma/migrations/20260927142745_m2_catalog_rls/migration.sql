-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for the catalogue tables — and a mechanism so that no future domain
-- has to remember.
--
-- The first RLS migration listed its tables by hand in a DO block. That works, and it does
-- not scale: ten more domains mean ten more lists, and one omission leaves a tenant table
-- readable by every tenant, silently.
--
-- So the rule moves into a function. Every later domain migration ends with
--
--     SELECT cf_apply_tenant_rls();
--
-- and any table that has appeared since with a business_id column is protected. It is
-- idempotent: a table that already has a policy is left exactly as it is, which is what
-- lets the hand-written policies on business, business_member, invitation and audit_log
-- survive untouched.
--
-- The integration suite still asserts the outcome independently (no table with a
-- business_id may lack RLS or FORCE), so the mechanism and the check do not share a
-- single point of failure.
-- ═════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION cf_apply_tenant_rls() RETURNS integer
  LANGUAGE plpgsql
  AS $$
DECLARE
  target  text;
  applied integer := 0;
BEGIN
  FOR target IN
    SELECT c.relname
      FROM information_schema.columns col
      JOIN pg_class c ON c.relname = col.table_name
      JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = col.table_schema
     WHERE col.table_schema = 'public'
       AND col.column_name = 'business_id'
       AND c.relkind = 'r'
       -- Platform tables that reference a business without being owned by one. `session`
       -- records which tenant a signed-in device is acting in; it is read while
       -- authenticating, before any tenant context exists, so putting it under RLS would
       -- make signing in impossible.
       AND NOT (c.relname = ANY (ARRAY['session']::text[]))
       -- Already protected (by this function, or by a hand-written policy): leave it.
       AND NOT EXISTS (
         SELECT 1 FROM pg_policies p
          WHERE p.schemaname = 'public' AND p.tablename = c.relname
       )
     ORDER BY c.relname
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', target);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', target);

    -- FORCE matters for the same reason the application role does: the table owner is
    -- exempt from policies unless forced, and the owner is the role that runs migrations.
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL '
      'USING (business_id = cf_current_business_id()) '
      'WITH CHECK (business_id = cf_current_business_id())',
      target || '_tenant_isolation', target
    );

    applied := applied + 1;
    RAISE NOTICE 'tenant isolation applied to %', target;
  END LOOP;

  RETURN applied;
END
$$;

-- Schema-changing and security-changing: not something the application role may call.
-- (It could not succeed anyway — it has no DDL rights — but a least-privilege role should
-- not even be able to try.)
REVOKE ALL ON FUNCTION cf_apply_tenant_rls() FROM PUBLIC;

-- Apply it to everything that exists now. On this database that is the sixteen catalogue
-- tables; on a fresh one it would also cover the identity, tenancy and billing tables,
-- which is why the earlier hand-written migration can stay as it is.
SELECT cf_apply_tenant_rls();
