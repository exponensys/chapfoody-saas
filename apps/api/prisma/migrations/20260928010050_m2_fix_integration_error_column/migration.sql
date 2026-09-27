-- ═════════════════════════════════════════════════════════════════════════════
-- Recovery for the marketing/integrations migration: a missing @map, and the constraints that never ran.
--
-- ── What went wrong ──────────────────────────────────────────────────────────
-- `Integration.lastError` was declared without `@map("last_error")`, so Prisma created a camelCase
-- column. Every other column in this schema is snake_case because the mapping is written explicitly,
-- and one omission is enough to break every hand-written statement — which is exactly what happened:
-- the constraint below references `last_error` and the database refused to create it.
--
-- This is the same class of bug the project has hit before, and the lesson is unchanged: the database
-- naming a column it cannot find is a much better failure than a production query silently returning
-- nulls.
--
-- ── Why the constraint was not simply removed ────────────────────────────────
-- The column rename is trivial; the SECOND half of this file is not. The failed migration had already
-- committed the CREATE TABLE statements and five of its constraints before it stopped, and the rest of
-- its constraints never ran. Prisma does not roll DDL back, so the database was left in a state that
-- neither "applied" nor "not applied" describes. The honest repair is to finish the job: mark the
-- original as applied, and add here exactly the constraints that did not get added.
--
-- Each one is written DROP IF EXISTS first, so this file is safe to run against a database that got
-- further than this one did.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── The column, renamed to match the schema ──────────────────────────────────
ALTER TABLE "integration" RENAME COLUMN "lastError" TO "last_error";

-- ── The constraints that never ran ───────────────────────────────────────────
ALTER TABLE "integration" DROP CONSTRAINT IF EXISTS "integration_status_implies_details";
ALTER TABLE "integration" ADD CONSTRAINT "integration_status_implies_details"
  CHECK (
    ("status" <> 'CONNECTED' OR "connected_at" IS NOT NULL)
    AND ("status" <> 'ERROR' OR "last_error" IS NOT NULL)
  );

-- HTTPS only. A webhook carries order and customer data, and an http:// endpoint sends it in clear
-- text across whatever network is in between.
ALTER TABLE "webhook_endpoint" DROP CONSTRAINT IF EXISTS "webhook_endpoint_is_https";
ALTER TABLE "webhook_endpoint" ADD CONSTRAINT "webhook_endpoint_is_https"
  CHECK ("url" LIKE 'https://%');

ALTER TABLE "webhook_endpoint" DROP CONSTRAINT IF EXISTS "webhook_endpoint_failures_sane";
ALTER TABLE "webhook_endpoint" ADD CONSTRAINT "webhook_endpoint_failures_sane"
  CHECK ("failure_count" >= 0);

-- Disabling is a consequence, so it has to say what happened.
ALTER TABLE "webhook_endpoint" DROP CONSTRAINT IF EXISTS "webhook_endpoint_disabled_has_a_reason";
ALTER TABLE "webhook_endpoint" ADD CONSTRAINT "webhook_endpoint_disabled_has_a_reason"
  CHECK ("disabled_at" IS NULL OR "disabled_reason" IS NOT NULL);

ALTER TABLE "webhook_delivery" DROP CONSTRAINT IF EXISTS "webhook_delivery_attempts_sane";
ALTER TABLE "webhook_delivery" ADD CONSTRAINT "webhook_delivery_attempts_sane"
  CHECK ("attempts" >= 0 AND ("duration_ms" IS NULL OR "duration_ms" >= 0));

-- A successful delivery has a time, and a failed one has something to explain it. Two distinct columns
-- because they are distinct failures: a non-2xx response means they refused it, and an `error` with no
-- response means we never reached them at all.
ALTER TABLE "webhook_delivery" DROP CONSTRAINT IF EXISTS "webhook_delivery_status_implies_details";
ALTER TABLE "webhook_delivery" ADD CONSTRAINT "webhook_delivery_status_implies_details"
  CHECK (
    ("status" <> 'SUCCESS' OR "delivered_at" IS NOT NULL)
    AND ("status" <> 'FAILED' OR "error" IS NOT NULL OR "response_status" IS NOT NULL)
  );

ALTER TABLE "job_run" DROP CONSTRAINT IF EXISTS "job_run_attempts_sane";
ALTER TABLE "job_run" ADD CONSTRAINT "job_run_attempts_sane"
  CHECK ("attempts" >= 1 AND ("duration_ms" IS NULL OR "duration_ms" >= 0));

-- Anything that has stopped has stopped, and a failure says why.
ALTER TABLE "job_run" DROP CONSTRAINT IF EXISTS "job_run_status_implies_details";
ALTER TABLE "job_run" ADD CONSTRAINT "job_run_status_implies_details"
  CHECK (
    ("status" NOT IN ('SUCCEEDED', 'FAILED', 'CANCELED') OR "finished_at" IS NOT NULL)
    AND ("status" <> 'FAILED' OR "error" IS NOT NULL)
  );
