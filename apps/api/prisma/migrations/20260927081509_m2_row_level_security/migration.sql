-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security: tenant isolation enforced by PostgreSQL, not by the API.
--
-- WHY AT THE DATABASE
--   Every query the API writes could forget a `where businessId = …`, and one such
--   omission exposes a competitor's orders. Policies here make that omission
--   harmless: the database itself refuses to return another tenant's rows.
--
-- THE THREE CONTEXT VARIABLES
--   The application sets these on its connection with
--     SELECT set_config('app.business_id', $1, true)
--   (`true` = transaction-local, so a pooled connection can never carry one request's
--   tenant into the next). See src/infra/prisma/tenant-context.ts.
--
--     app.business_id      the tenant the request acts in
--     app.user_id          the authenticated user — needed because signing in has to
--                          read membership before a tenant has been chosen
--     app.invitation_token hash of the token in an invitation link, the one row an
--                          invitee may see before becoming a member
--
-- FAIL CLOSED
--   `current_setting(…, true)` returns NULL when unset, and every helper maps an empty
--   string to NULL too. A policy comparing against NULL is not true, so an unscoped
--   connection sees zero rows and can insert nothing. Forgetting to set the context
--   loses data access; it never grants it.
--
-- WHO IS SUBJECT TO THESE POLICIES
--   RLS does not apply to superusers or roles with BYPASSRLS, and not to a table's
--   owner unless FORCE is set. Both are set below, and the application connects as
--   chapfoody_app — NOSUPERUSER NOBYPASSRLS, created by prisma/sql/app-role.sql. A
--   superuser connection (the migration role) intentionally bypasses everything.
--   An integration test asserts that no table with a business_id column is left
--   without RLS.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── Context helpers ──────────────────────────────────────────────────────────
-- One definition of "what does the context currently say", so every policy reasons
-- about the unset case identically. STABLE: evaluated once per statement, not per row.

CREATE OR REPLACE FUNCTION cf_current_business_id() RETURNS text
  LANGUAGE sql STABLE PARALLEL SAFE
  AS $$ SELECT NULLIF(current_setting('app.business_id', true), '') $$;

CREATE OR REPLACE FUNCTION cf_current_user_id() RETURNS text
  LANGUAGE sql STABLE PARALLEL SAFE
  AS $$ SELECT NULLIF(current_setting('app.user_id', true), '') $$;

CREATE OR REPLACE FUNCTION cf_invitation_token() RETURNS text
  LANGUAGE sql STABLE PARALLEL SAFE
  AS $$ SELECT NULLIF(current_setting('app.invitation_token', true), '') $$;

-- ── business: the tenant root ────────────────────────────────────────────────

ALTER TABLE "business" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "business" FORCE ROW LEVEL SECURITY;

-- Readable when it is the active tenant, when the reader owns it, or when the reader is
-- a member of it. The membership clause is what lets an employee's sign-in list their
-- employer before a tenant has been selected: business_member's own policy allows the
-- subquery to see the reader's memberships, and that policy does not reference business,
-- so there is no recursion.
DROP POLICY IF EXISTS business_tenant_read ON "business";
CREATE POLICY business_tenant_read ON "business"
  FOR SELECT
  USING (
    id = cf_current_business_id()
    OR owner_id = cf_current_user_id()
    OR EXISTS (
      SELECT 1 FROM "business_member" m
      WHERE m.business_id = "business".id
        AND m.user_id = cf_current_user_id()
    )
  );

-- A user may register a business in their own name — and only their own.
DROP POLICY IF EXISTS business_owner_insert ON "business";
CREATE POLICY business_owner_insert ON "business"
  FOR INSERT
  WITH CHECK (owner_id = cf_current_user_id());

-- Settings may be changed by the tenant acting in context, or by its owner while
-- completing onboarding (when the business row is not yet the active tenant).
DROP POLICY IF EXISTS business_tenant_update ON "business";
CREATE POLICY business_tenant_update ON "business"
  FOR UPDATE
  USING (id = cf_current_business_id() OR owner_id = cf_current_user_id())
  WITH CHECK (id = cf_current_business_id() OR owner_id = cf_current_user_id());

-- No DELETE policy: a business is closed, never erased (deletedAt). Its financial
-- records reference it ON DELETE RESTRICT, so a hard delete would fail anyway.

-- ── business_member: who may act inside a tenant ─────────────────────────────

ALTER TABLE "business_member" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "business_member" FORCE ROW LEVEL SECURITY;

-- Readable by the tenant in context, and by the user whose membership it is.
-- The second clause is required by the sign-in flow; it deliberately grants no writes.
DROP POLICY IF EXISTS business_member_read ON "business_member";
CREATE POLICY business_member_read ON "business_member"
  FOR SELECT
  USING (
    business_id = cf_current_business_id()
    OR user_id = cf_current_user_id()
  );

-- Only the active tenant may add, change or remove its own members. Notably this stops
-- a user from granting themselves a role: their own memberships are readable, but the
-- write policies require the tenant context, which sign-in does not have.
DROP POLICY IF EXISTS business_member_write ON "business_member";
CREATE POLICY business_member_write ON "business_member"
  FOR ALL
  USING (business_id = cf_current_business_id())
  WITH CHECK (business_id = cf_current_business_id());

-- ── invitation: the one row an invitee may see before joining ────────────────

ALTER TABLE "invitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invitation" FORCE ROW LEVEL SECURITY;

-- The tenant may read its own invitations; an invitee may read the single invitation
-- matching the token in their link, and nothing else. Accepting an invitation is by
-- nature pre-authentication, so a user-id clause cannot help here — the token is the
-- capability, it is stored hashed, and it is the only thing that unlocks the row.
DROP POLICY IF EXISTS invitation_read ON "invitation";
CREATE POLICY invitation_read ON "invitation"
  FOR SELECT
  USING (
    business_id = cf_current_business_id()
    OR token_hash = cf_invitation_token()
  );

DROP POLICY IF EXISTS invitation_write ON "invitation";
CREATE POLICY invitation_write ON "invitation"
  FOR ALL
  USING (business_id = cf_current_business_id())
  WITH CHECK (business_id = cf_current_business_id());

-- ── audit_log: append-only ───────────────────────────────────────────────────

ALTER TABLE "audit_log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_log" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_log_read ON "audit_log";
CREATE POLICY audit_log_read ON "audit_log"
  FOR SELECT
  USING (business_id = cf_current_business_id());

-- Insertable in the matching context: a tenant writes tenant events, the platform (no
-- tenant in context) writes platform events. Nothing can write across that line.
DROP POLICY IF EXISTS audit_log_insert ON "audit_log";
CREATE POLICY audit_log_insert ON "audit_log"
  FOR INSERT
  WITH CHECK (
    business_id = cf_current_business_id()
    OR (business_id IS NULL AND cf_current_business_id() IS NULL)
  );

-- Deliberately no UPDATE and no DELETE policy: an audit trail that can be edited proves
-- nothing. With no policy for those commands, they are denied outright — even for the
-- application role, and even for a tenant's own rows.

-- ── Tenant-owned tables ──────────────────────────────────────────────────────
-- One rule, applied the same way everywhere: the active tenant, and only the active
-- tenant. Built in a loop rather than by hand so that a table cannot be scoped with a
-- subtly different predicate, and so the business_id precondition is checked, not assumed.

DO $$
DECLARE
  target text;

  -- Tables the tenant manages fully (its own subscription, its add-ons, its quotas,
  -- its stored payment instrument).
  fully_managed text[] := ARRAY[
    'subscription',
    'subscription_item',
    'entitlement',
    'usage_counter',
    'payment_method'
  ];

  -- Financial ledgers: readable and appendable by the tenant, never erasable. Omitting a
  -- DELETE policy denies the command outright — defence in depth behind the API, and
  -- referential actions (ON DELETE CASCADE/SET NULL) still work, because PostgreSQL does
  -- not apply row security to integrity checks.
  append_only text[] := ARRAY[
    'payment',
    'platform_invoice'
  ];
BEGIN
  FOREACH target IN ARRAY fully_managed || append_only LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = target AND column_name = 'business_id'
    ) THEN
      -- A future migration that adds a tenant table without a business_id column would
      -- otherwise leave it readable by every tenant, silently. Fail loudly instead.
      RAISE EXCEPTION 'Cannot scope %: it has no business_id column', target;
    END IF;

    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', target);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', target);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', target || '_tenant_isolation', target);
  END LOOP;

  FOREACH target IN ARRAY fully_managed LOOP
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL '
      'USING (business_id = cf_current_business_id()) '
      'WITH CHECK (business_id = cf_current_business_id())',
      target || '_tenant_isolation', target
    );
  END LOOP;

  FOREACH target IN ARRAY append_only LOOP
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR SELECT USING (business_id = cf_current_business_id())',
      target || '_tenant_read', target
    );
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR INSERT WITH CHECK (business_id = cf_current_business_id())',
      target || '_tenant_insert', target
    );
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR UPDATE '
      'USING (business_id = cf_current_business_id()) '
      'WITH CHECK (business_id = cf_current_business_id())',
      target || '_tenant_update', target
    );
  END LOOP;
END
$$;

