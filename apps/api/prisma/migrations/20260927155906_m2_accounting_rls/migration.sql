-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for accounting — and one policy that is about more than tenancy.
--
-- The journal is the one place in this schema where the rule is not "your tenant" but "only while
-- it is still a draft". A posted entry is the accounting record of what happened; editing it after
-- the fact is not a correction, it is a false statement. Corrections are made by posting a
-- reversing entry, which stays visible — so the original and the correction can both be read.
--
-- That rule is expressed here rather than in the application because the application is the thing
-- that might get it wrong:
--
--   journal_entry  UPDATE only while status = 'DRAFT'   (a draft may be posted; a posted entry
--                                                        may not be touched again)
--   journal_entry  no DELETE at all                     (accounting history is not erased)
--   journal_line   INSERT/UPDATE/DELETE only while the parent entry is a draft, checked with a
--                  subquery — otherwise a posted entry's figures could be rewritten through the
--                  lines while the entry itself stayed untouched.
--
-- The WITH CHECK on the entry's UPDATE deliberately allows the NEW status: USING sees the row as it
-- was (DRAFT), WITH CHECK sees it as it becomes (POSTED). Requiring DRAFT in both would make
-- posting impossible.
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE "journal_entry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "journal_entry" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS journal_entry_read ON "journal_entry";
CREATE POLICY journal_entry_read ON "journal_entry"
  FOR SELECT
  USING (business_id = cf_current_business_id());

DROP POLICY IF EXISTS journal_entry_insert ON "journal_entry";
CREATE POLICY journal_entry_insert ON "journal_entry"
  FOR INSERT
  WITH CHECK (business_id = cf_current_business_id());

DROP POLICY IF EXISTS journal_entry_update_draft_only ON "journal_entry";
CREATE POLICY journal_entry_update_draft_only ON "journal_entry"
  FOR UPDATE
  USING (business_id = cf_current_business_id() AND "status" = 'DRAFT')
  WITH CHECK (business_id = cf_current_business_id());

-- No DELETE policy: an entry is reversed, never removed.

ALTER TABLE "journal_line" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "journal_line" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS journal_line_read ON "journal_line";
CREATE POLICY journal_line_read ON "journal_line"
  FOR SELECT
  USING (business_id = cf_current_business_id());

-- Writes are tied to the parent entry being a draft. The subquery reads journal_entry, whose own
-- SELECT policy scopes it to the same tenant, so the two compose rather than widen.
DROP POLICY IF EXISTS journal_line_insert_draft_only ON "journal_line";
CREATE POLICY journal_line_insert_draft_only ON "journal_line"
  FOR INSERT
  WITH CHECK (
    business_id = cf_current_business_id()
    AND EXISTS (
      SELECT 1 FROM "journal_entry" e
       WHERE e.id = "journal_line"."journal_entry_id" AND e."status" = 'DRAFT'
    )
  );

DROP POLICY IF EXISTS journal_line_update_draft_only ON "journal_line";
CREATE POLICY journal_line_update_draft_only ON "journal_line"
  FOR UPDATE
  USING (
    business_id = cf_current_business_id()
    AND EXISTS (
      SELECT 1 FROM "journal_entry" e
       WHERE e.id = "journal_line"."journal_entry_id" AND e."status" = 'DRAFT'
    )
  );

DROP POLICY IF EXISTS journal_line_delete_draft_only ON "journal_line";
CREATE POLICY journal_line_delete_draft_only ON "journal_line"
  FOR DELETE
  USING (
    business_id = cf_current_business_id()
    AND EXISTS (
      SELECT 1 FROM "journal_entry" e
       WHERE e.id = "journal_line"."journal_entry_id" AND e."status" = 'DRAFT'
    )
  );

-- The rest of the domain — chart of accounts, posting markers, documents, snapshots, exports — has
-- no rule beyond tenancy.
SELECT cf_apply_tenant_rls();
