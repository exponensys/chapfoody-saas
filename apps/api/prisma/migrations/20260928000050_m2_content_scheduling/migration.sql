-- ═════════════════════════════════════════════════════════════════════════════
-- Scheduling, for the two content types that were missing it.
--
-- ── Why this is a separate migration ─────────────────────────────────────────
-- The RLS policy for published content is ONE rule applied to five tables (blog_post, video,
-- case_study, page, use_case), and it reads `scheduled_for`. Two of those tables did not have the
-- column, so the policy failed the moment it reached `page` — the database refusing to create a
-- policy that references something that does not exist, which is the correct outcome and exactly what
-- a policy should do.
--
-- Two ways to fix it: special-case the policy for the two tables, or give them the column. The column
-- is the better answer — "publish this on the 1st" is not a special requirement of blog posts, and a
-- policy with a different shape per table would be one more thing to get wrong later.
--
-- This migration lands BEFORE the RLS one by filename order, because the policies depend on it.
-- The CHECKs added by the content migration are recreated here to include the scheduling rule, so all
-- five tables now enforce the same invariant.
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE "page" ADD COLUMN "scheduled_for" TIMESTAMP(3);
ALTER TABLE "use_case" ADD COLUMN "scheduled_for" TIMESTAMP(3);

-- Same rule as the other three: a state must carry its evidence.
ALTER TABLE "page" DROP CONSTRAINT IF EXISTS "page_status_implies_date";
ALTER TABLE "page" ADD CONSTRAINT "page_status_implies_dates"
  CHECK (
    ("status" <> 'PUBLISHED' OR "published_at" IS NOT NULL)
    AND ("status" <> 'SCHEDULED' OR "scheduled_for" IS NOT NULL)
  );

ALTER TABLE "use_case" DROP CONSTRAINT IF EXISTS "use_case_status_implies_date";
ALTER TABLE "use_case" ADD CONSTRAINT "use_case_status_implies_dates"
  CHECK (
    ("status" <> 'PUBLISHED' OR "published_at" IS NOT NULL)
    AND ("status" <> 'SCHEDULED' OR "scheduled_for" IS NOT NULL)
  );
