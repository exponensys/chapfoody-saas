-- CreateEnum
CREATE TYPE "segment_type" AS ENUM ('STATIC', 'DYNAMIC');

-- CreateEnum
CREATE TYPE "campaign_channel" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'MULTI');

-- CreateEnum
CREATE TYPE "campaign_status" AS ENUM ('DRAFT', 'SCHEDULED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "loyalty_transaction_type" AS ENUM ('EARN', 'REDEEM', 'EXPIRE', 'ADJUSTMENT', 'REFERRAL_BONUS');

-- CreateEnum
CREATE TYPE "reward_type" AS ENUM ('DISCOUNT', 'FREE_ITEM', 'FREE_DELIVERY', 'UPGRADE');

-- CreateEnum
CREATE TYPE "automation_event" AS ENUM ('CUSTOMER_CREATED', 'ORDER_COMPLETED', 'BIRTHDAY', 'INACTIVE_DAYS', 'LOYALTY_TIER_REACHED', 'SEGMENT_ENTERED');

-- CreateEnum
CREATE TYPE "automation_action" AS ENUM ('SEND_EMAIL', 'SEND_SMS', 'ADD_TAG', 'ADD_POINTS', 'NOTIFY_STAFF');

-- CreateEnum
CREATE TYPE "integration_provider" AS ENUM ('ZOHO', 'ZAPIER', 'MAKE', 'GOOGLE_CALENDAR', 'STRIPE', 'CINETPAY', 'PAYSTACK', 'FLUTTERWAVE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "integration_status" AS ENUM ('DISCONNECTED', 'CONNECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "integration_entity" AS ENUM ('ORDER', 'CUSTOMER', 'PRODUCT', 'INVOICE', 'PAYMENT', 'STOCK_MOVEMENT');

-- CreateEnum
CREATE TYPE "sync_direction" AS ENUM ('PUSH', 'PULL', 'BIDIRECTIONAL');

-- CreateEnum
CREATE TYPE "webhook_delivery_status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'DISCARDED');

-- CreateEnum
CREATE TYPE "job_status" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELED');

-- CreateTable
CREATE TABLE "integration" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "provider" "integration_provider" NOT NULL,
    "status" "integration_status" NOT NULL DEFAULT 'DISCONNECTED',
    "name" VARCHAR(160),
    "credentials" JSONB,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "external_account_id" VARCHAR(200),
    "external_account_name" VARCHAR(200),
    "settings" JSONB,
    "connected_by_id" TEXT,
    "connected_at" TIMESTAMP(3),
    "last_sync_at" TIMESTAMP(3),
    "lastError" TEXT,
    "last_error_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_mapping" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "integration_id" TEXT NOT NULL,
    "entity" "integration_entity" NOT NULL,
    "direction" "sync_direction" NOT NULL,
    "external_object" VARCHAR(160),
    "mapping" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_sync_at" TIMESTAMP(3),
    "lastError" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoint" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "description" VARCHAR(300),
    "secret" VARCHAR(128) NOT NULL,
    "events" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_triggered_at" TIMESTAMP(3),
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "disabled_at" TIMESTAMP(3),
    "disabled_reason" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_delivery" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "endpoint_id" TEXT NOT NULL,
    "event" VARCHAR(120) NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "webhook_delivery_status" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "response_status" INTEGER,
    "response_body" TEXT,
    "error" TEXT,
    "duration_ms" INTEGER,
    "scheduled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_run" (
    "id" TEXT NOT NULL,
    "business_id" TEXT,
    "jobName" VARCHAR(200) NOT NULL,
    "queue" VARCHAR(80),
    "status" "job_status" NOT NULL DEFAULT 'QUEUED',
    "payload" JSONB,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "worker_id" VARCHAR(120),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "duration_ms" INTEGER,
    "error" TEXT,
    "result" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_segment" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "code" VARCHAR(48),
    "type" "segment_type" NOT NULL DEFAULT 'DYNAMIC',
    "rules" JSONB,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "last_evaluated_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audience" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "segment_id" TEXT,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "last_resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audience_member" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "audience_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excluded_at" TIMESTAMP(3),
    "exclude_reason" VARCHAR(200),

    CONSTRAINT "audience_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_template" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "channel" "campaign_channel" NOT NULL,
    "subject" VARCHAR(200),
    "body" TEXT NOT NULL,
    "variables" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_template" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "audience_id" TEXT,
    "template_id" TEXT,
    "name" VARCHAR(200) NOT NULL,
    "channel" "campaign_channel" NOT NULL,
    "status" "campaign_status" NOT NULL DEFAULT 'DRAFT',
    "subject" VARCHAR(200),
    "body" TEXT,
    "scheduled_for" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "recipient_count" INTEGER NOT NULL DEFAULT 0,
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "delivered_count" INTEGER NOT NULL DEFAULT 0,
    "opened_count" INTEGER NOT NULL DEFAULT 0,
    "clicked_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "opt_out_count" INTEGER NOT NULL DEFAULT 0,
    "budget_amount" DECIMAL(14,2),
    "spent_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "created_by_id" TEXT,
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_campaign" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "sender_id" VARCHAR(11) NOT NULL,
    "message" TEXT NOT NULL,
    "characters" INTEGER NOT NULL DEFAULT 0,
    "segments" INTEGER NOT NULL DEFAULT 1,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "provider" VARCHAR(60),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sms_campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_program" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "points_per_currency" DECIMAL(8,4) NOT NULL DEFAULT 1,
    "redemption_rate" DECIMAL(8,4) NOT NULL DEFAULT 0.01,
    "minimum_redeem_points" INTEGER NOT NULL DEFAULT 100,
    "expiry_days" INTEGER,
    "tiers_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_tier" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "threshold_points" INTEGER NOT NULL,
    "multiplier" DECIMAL(4,2) NOT NULL DEFAULT 1,
    "benefits" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transaction" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "program_id" TEXT,
    "type" "loyalty_transaction_type" NOT NULL,
    "points" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "order_id" TEXT,
    "reason" VARCHAR(300),
    "expires_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_rule" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "type" "reward_type" NOT NULL,
    "points_cost" INTEGER NOT NULL,
    "value_amount" DECIMAL(14,2),
    "product_id" TEXT,
    "minimum_order_amount" DECIMAL(14,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "valid_from" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "usage_limit" INTEGER NOT NULL DEFAULT 0,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reward_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_trigger" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "event" "automation_event" NOT NULL,
    "delay_minutes" INTEGER NOT NULL DEFAULT 0,
    "conditions" JSONB,
    "action" "automation_action" NOT NULL,
    "template_id" TEXT,
    "action_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "run_count" INTEGER NOT NULL DEFAULT 0,
    "last_run_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_trigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "integration_business_id_status_idx" ON "integration"("business_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "integration_business_id_provider_key" ON "integration"("business_id", "provider");

-- CreateIndex
CREATE INDEX "integration_mapping_business_id_is_active_idx" ON "integration_mapping"("business_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "integration_mapping_integration_id_entity_key" ON "integration_mapping"("integration_id", "entity");

-- CreateIndex
CREATE INDEX "webhook_endpoint_business_id_is_active_idx" ON "webhook_endpoint"("business_id", "is_active");

-- CreateIndex
CREATE INDEX "webhook_delivery_status_scheduled_at_idx" ON "webhook_delivery"("status", "scheduled_at");

-- CreateIndex
CREATE INDEX "webhook_delivery_endpoint_id_created_at_idx" ON "webhook_delivery"("endpoint_id", "created_at");

-- CreateIndex
CREATE INDEX "job_run_jobName_started_at_idx" ON "job_run"("jobName", "started_at");

-- CreateIndex
CREATE INDEX "job_run_status_started_at_idx" ON "job_run"("status", "started_at");

-- CreateIndex
CREATE INDEX "job_run_business_id_started_at_idx" ON "job_run"("business_id", "started_at");

-- CreateIndex
CREATE INDEX "customer_segment_business_id_is_active_idx" ON "customer_segment"("business_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "customer_segment_business_id_name_key" ON "customer_segment"("business_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "audience_business_id_name_key" ON "audience"("business_id", "name");

-- CreateIndex
CREATE INDEX "audience_member_customer_id_idx" ON "audience_member"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "audience_member_audience_id_customer_id_key" ON "audience_member"("audience_id", "customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_template_business_id_name_key" ON "campaign_template"("business_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "email_template_business_id_key_key" ON "email_template"("business_id", "key");

-- CreateIndex
CREATE INDEX "campaign_business_id_status_scheduled_for_idx" ON "campaign"("business_id", "status", "scheduled_for");

-- CreateIndex
CREATE INDEX "campaign_audience_id_idx" ON "campaign"("audience_id");

-- CreateIndex
CREATE UNIQUE INDEX "sms_campaign_campaign_id_key" ON "sms_campaign"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_program_business_id_key" ON "loyalty_program"("business_id");

-- CreateIndex
CREATE INDEX "loyalty_tier_program_id_threshold_points_idx" ON "loyalty_tier"("program_id", "threshold_points");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_tier_program_id_name_key" ON "loyalty_tier"("program_id", "name");

-- CreateIndex
CREATE INDEX "loyalty_transaction_customer_id_occurred_at_idx" ON "loyalty_transaction"("customer_id", "occurred_at");

-- CreateIndex
CREATE INDEX "loyalty_transaction_business_id_type_occurred_at_idx" ON "loyalty_transaction"("business_id", "type", "occurred_at");

-- CreateIndex
CREATE INDEX "loyalty_transaction_expires_at_idx" ON "loyalty_transaction"("expires_at");

-- CreateIndex
CREATE INDEX "reward_rule_business_id_is_active_sort_order_idx" ON "reward_rule"("business_id", "is_active", "sort_order");

-- CreateIndex
CREATE INDEX "automation_trigger_business_id_event_is_active_idx" ON "automation_trigger"("business_id", "event", "is_active");

-- AddForeignKey
ALTER TABLE "integration" ADD CONSTRAINT "integration_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration" ADD CONSTRAINT "integration_connected_by_id_fkey" FOREIGN KEY ("connected_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_mapping" ADD CONSTRAINT "integration_mapping_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_mapping" ADD CONSTRAINT "integration_mapping_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoint" ADD CONSTRAINT "webhook_endpoint_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_delivery" ADD CONSTRAINT "webhook_delivery_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_delivery" ADD CONSTRAINT "webhook_delivery_endpoint_id_fkey" FOREIGN KEY ("endpoint_id") REFERENCES "webhook_endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_run" ADD CONSTRAINT "job_run_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_segment" ADD CONSTRAINT "customer_segment_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_segment" ADD CONSTRAINT "customer_segment_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audience" ADD CONSTRAINT "audience_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audience" ADD CONSTRAINT "audience_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "customer_segment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audience_member" ADD CONSTRAINT "audience_member_audience_id_fkey" FOREIGN KEY ("audience_id") REFERENCES "audience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audience_member" ADD CONSTRAINT "audience_member_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audience_member" ADD CONSTRAINT "audience_member_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_template" ADD CONSTRAINT "campaign_template_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_template" ADD CONSTRAINT "email_template_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_template" ADD CONSTRAINT "email_template_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_audience_id_fkey" FOREIGN KEY ("audience_id") REFERENCES "audience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "campaign_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_campaign" ADD CONSTRAINT "sms_campaign_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_campaign" ADD CONSTRAINT "sms_campaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_program" ADD CONSTRAINT "loyalty_program_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_tier" ADD CONSTRAINT "loyalty_tier_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_tier" ADD CONSTRAINT "loyalty_tier_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "loyalty_program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transaction" ADD CONSTRAINT "loyalty_transaction_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transaction" ADD CONSTRAINT "loyalty_transaction_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transaction" ADD CONSTRAINT "loyalty_transaction_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "loyalty_program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transaction" ADD CONSTRAINT "loyalty_transaction_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_rule" ADD CONSTRAINT "reward_rule_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_trigger" ADD CONSTRAINT "automation_trigger_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_trigger" ADD CONSTRAINT "automation_trigger_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for marketing and integrations.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── A campaign's state must carry its evidence ───────────────────────────────
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_status_implies_details"
  CHECK (
    ("status" <> 'RUNNING' OR "started_at" IS NOT NULL)
    AND ("status" <> 'COMPLETED' OR "completed_at" IS NOT NULL)
    AND ("status" <> 'SCHEDULED' OR "scheduled_for" IS NOT NULL)
  );

-- Counters only go one way, and the arithmetic between them has to hold: you cannot deliver more than
-- you sent, and you cannot send more than you targeted. Getting this wrong is how a report produces a
-- 118 % open rate that nobody can explain.
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_counters_ordered"
  CHECK (
    "recipient_count" >= 0 AND "sent_count" >= 0 AND "delivered_count" >= 0
    AND "opened_count" >= 0 AND "clicked_count" >= 0 AND "failed_count" >= 0
    AND "opt_out_count" >= 0
    AND "sent_count" <= "recipient_count"
    AND "delivered_count" <= "sent_count"
    AND "opened_count" <= "delivered_count"
    AND "clicked_count" <= "opened_count"
  );

ALTER TABLE "campaign" ADD CONSTRAINT "campaign_spend_not_negative"
  CHECK ("spent_amount" >= 0 AND ("budget_amount" IS NULL OR "budget_amount" >= 0));

ALTER TABLE "campaign" ADD CONSTRAINT "campaign_approval_is_all_or_nothing"
  CHECK (num_nonnulls("approved_by_id", "approved_at") IN (0, 2));

-- ── An audience member who was excluded should say why ───────────────────────
-- The reason is what turns "412 targeted, 408 sent" into an answer. An exclusion with no reason is a
-- number nobody can act on.
ALTER TABLE "audience_member" ADD CONSTRAINT "audience_member_exclusion_has_a_reason"
  CHECK ("excluded_at" IS NULL OR "exclude_reason" IS NOT NULL);

ALTER TABLE "audience" ADD CONSTRAINT "audience_count_not_negative"
  CHECK ("member_count" >= 0);

ALTER TABLE "customer_segment" ADD CONSTRAINT "customer_segment_count_not_negative"
  CHECK ("member_count" >= 0);

ALTER TABLE "sms_campaign" ADD CONSTRAINT "sms_campaign_billing_sane"
  CHECK ("characters" >= 0 AND "segments" >= 1 AND "credits_used" >= 0);

-- Sender ids are limited by carriers, and a value longer than the limit is rejected at the gateway
-- AFTER the send has been queued — the worst possible moment to find out.
ALTER TABLE "sms_campaign" ADD CONSTRAINT "sms_campaign_sender_id_length"
  CHECK (length(btrim("sender_id")) BETWEEN 1 AND 11);

ALTER TABLE "automation_trigger" ADD CONSTRAINT "automation_trigger_counters_sane"
  CHECK ("delay_minutes" >= 0 AND "run_count" >= 0);


-- ── Loyalty: a balance that cannot go negative, and a ledger that always moves ─
-- `balance_after` is recorded on every movement, so this is the constraint that makes an over-spend
-- impossible to STORE rather than merely unlikely: the row that would take a customer below zero is
-- refused by the database, whoever computed it.
ALTER TABLE "loyalty_transaction" ADD CONSTRAINT "loyalty_transaction_balance_not_negative"
  CHECK ("balance_after" >= 0);

-- A movement of zero points is not a movement. It is a bug that writes a row, and a row that explains
-- nothing while making every "how many times did this customer transact?" answer wrong.
ALTER TABLE "loyalty_transaction" ADD CONSTRAINT "loyalty_transaction_moves_something"
  CHECK ("points" <> 0);

-- The direction has to match the type. An EARN that subtracts, or a REDEEM that adds, is a sign error
-- that would silently double a balance rather than fail.
ALTER TABLE "loyalty_transaction" ADD CONSTRAINT "loyalty_transaction_sign_matches_type"
  CHECK (
    ("type" IN ('EARN', 'REFERRAL_BONUS') AND "points" > 0)
    OR ("type" IN ('REDEEM', 'EXPIRE') AND "points" < 0)
    OR ("type" = 'ADJUSTMENT')
  );

ALTER TABLE "loyalty_program" ADD CONSTRAINT "loyalty_program_rates_positive"
  CHECK (
    "points_per_currency" > 0
    AND "redemption_rate" > 0
    AND "minimum_redeem_points" >= 0
    AND ("expiry_days" IS NULL OR "expiry_days" > 0)
  );

ALTER TABLE "loyalty_tier" ADD CONSTRAINT "loyalty_tier_threshold_and_multiplier"
  CHECK ("threshold_points" >= 0 AND "multiplier" > 0);

-- ── Rewards ──────────────────────────────────────────────────────────────────
ALTER TABLE "reward_rule" ADD CONSTRAINT "reward_rule_points_cost_positive"
  CHECK ("points_cost" > 0 AND "used_count" >= 0 AND "usage_limit" >= 0);

-- `usage_limit = 0` means unlimited, so only a non-zero limit can be exhausted.
ALTER TABLE "reward_rule" ADD CONSTRAINT "reward_rule_usage_ceiling_respected"
  CHECK ("usage_limit" = 0 OR "used_count" <= "usage_limit");

ALTER TABLE "reward_rule" ADD CONSTRAINT "reward_rule_validity_ordered"
  CHECK ("valid_from" IS NULL OR "valid_until" IS NULL OR "valid_until" >= "valid_from");

-- A reward with a value must not give away a negative amount, which would be a charge.
ALTER TABLE "reward_rule" ADD CONSTRAINT "reward_rule_value_not_negative"
  CHECK (
    ("value_amount" IS NULL OR "value_amount" >= 0)
    AND ("minimum_order_amount" IS NULL OR "minimum_order_amount" >= 0)
  );

-- ── Integrations ─────────────────────────────────────────────────────────────
-- A connection that is CONNECTED has been connected, and one in ERROR has something to show for it.
-- "ERROR" with no message is a support ticket with no information in it.
ALTER TABLE "integration" ADD CONSTRAINT "integration_status_implies_details"
  CHECK (
    ("status" <> 'CONNECTED' OR "connected_at" IS NOT NULL)
    AND ("status" <> 'ERROR' OR "last_error" IS NOT NULL)
  );

-- ── Webhooks ─────────────────────────────────────────────────────────────────
-- HTTPS only. A webhook carries order and customer data, and an http:// endpoint sends it in clear
-- text across whatever network is in between.
ALTER TABLE "webhook_endpoint" ADD CONSTRAINT "webhook_endpoint_is_https"
  CHECK ("url" LIKE 'https://%');

ALTER TABLE "webhook_endpoint" ADD CONSTRAINT "webhook_endpoint_failures_sane"
  CHECK ("failure_count" >= 0);

-- Disabling is a consequence, so it has to say what happened.
ALTER TABLE "webhook_endpoint" ADD CONSTRAINT "webhook_endpoint_disabled_has_a_reason"
  CHECK ("disabled_at" IS NULL OR "disabled_reason" IS NOT NULL);

ALTER TABLE "webhook_delivery" ADD CONSTRAINT "webhook_delivery_attempts_sane"
  CHECK ("attempts" >= 0 AND ("duration_ms" IS NULL OR "duration_ms" >= 0));

-- A successful delivery has a time, and a failed one has something to explain it. Two distinct columns
-- because they are distinct failures: a non-2xx response means they refused it, and an `error` with no
-- response means we never reached them at all.
ALTER TABLE "webhook_delivery" ADD CONSTRAINT "webhook_delivery_status_implies_details"
  CHECK (
    ("status" <> 'SUCCESS' OR "delivered_at" IS NOT NULL)
    AND ("status" <> 'FAILED' OR "error" IS NOT NULL OR "response_status" IS NOT NULL)
  );

-- ── Jobs ─────────────────────────────────────────────────────────────────────
ALTER TABLE "job_run" ADD CONSTRAINT "job_run_attempts_sane"
  CHECK ("attempts" >= 1 AND ("duration_ms" IS NULL OR "duration_ms" >= 0));

-- Anything that has stopped has stopped, and a failure says why. What makes the history useful rather
-- than a list of names and timestamps.
ALTER TABLE "job_run" ADD CONSTRAINT "job_run_status_implies_details"
  CHECK (
    ("status" NOT IN ('SUCCEEDED', 'FAILED', 'CANCELED') OR "finished_at" IS NOT NULL)
    AND ("status" <> 'FAILED' OR "error" IS NOT NULL)
  );

