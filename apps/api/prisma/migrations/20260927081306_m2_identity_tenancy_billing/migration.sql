-- CreateEnum
CREATE TYPE "locale" AS ENUM ('FR', 'EN');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "auth_provider" AS ENUM ('GOOGLE');

-- CreateEnum
CREATE TYPE "verification_purpose" AS ENUM ('EMAIL_VERIFY', 'PASSWORD_RESET', 'MFA_RESET', 'INVITATION');

-- CreateEnum
CREATE TYPE "role_key" AS ENUM ('SUPER_ADMIN', 'OWNER', 'MANAGER', 'CASHIER', 'VENDOR', 'ACCOUNTANT');

-- CreateEnum
CREATE TYPE "business_status" AS ENUM ('ONBOARDING', 'ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "member_status" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "invitation_status" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "actor_type" AS ENUM ('USER', 'SYSTEM', 'ADMIN');

-- CreateEnum
CREATE TYPE "billing_period" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "feature_kind" AS ENUM ('FLAG', 'QUOTA');

-- CreateEnum
CREATE TYPE "entitlement_source" AS ENUM ('PLAN', 'ADDON', 'OVERRIDE', 'TRIAL');

-- CreateEnum
CREATE TYPE "payment_provider" AS ENUM ('STRIPE', 'CINETPAY', 'PAYSTACK', 'FLUTTERWAVE', 'MANUAL');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "invoice_status" AS ENUM ('DRAFT', 'OPEN', 'PAID', 'VOID');

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "role" "role_key" NOT NULL,
    "status" "invitation_status" NOT NULL DEFAULT 'PENDING',
    "token_hash" VARCHAR(64) NOT NULL,
    "invited_by_id" TEXT NOT NULL,
    "accepted_by_id" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "business_id" TEXT,
    "actorType" "actor_type" NOT NULL,
    "actor_user_id" TEXT,
    "action" VARCHAR(96) NOT NULL,
    "entity_type" VARCHAR(64) NOT NULL,
    "entity_id" TEXT,
    "request_id" VARCHAR(128),
    "ip_address" INET,
    "user_agent" TEXT,
    "diff_hash" VARCHAR(64),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_type" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "label_fr" VARCHAR(120) NOT NULL,
    "label_en" VARCHAR(120) NOT NULL,
    "icon" VARCHAR(64),
    "is_client_category" BOOLEAN NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "legal_name" VARCHAR(200),
    "business_type_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "status" "business_status" NOT NULL DEFAULT 'ONBOARDING',
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "locale" "locale" NOT NULL DEFAULT 'FR',
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Europe/Paris',
    "country" CHAR(2) NOT NULL,
    "city" VARCHAR(120),
    "address_line1" VARCHAR(200),
    "postal_code" VARCHAR(32),
    "phone" VARCHAR(32),
    "email" VARCHAR(320),
    "logo_url" TEXT,
    "default_vat_rate" DECIMAL(5,2),
    "onboarding_completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_member" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "role_key" NOT NULL,
    "status" "member_status" NOT NULL DEFAULT 'ACTIVE',
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "invited_by_id" TEXT,
    "joined_at" TIMESTAMP(3),
    "last_active_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa_secret" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "secret_encrypted" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mfa_secret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recovery_code" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recovery_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "purpose" "verification_purpose" NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_user" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "password_hash" TEXT,
    "must_change_password" BOOLEAN NOT NULL DEFAULT false,
    "first_name" VARCHAR(120) NOT NULL,
    "last_name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(32),
    "avatar_url" TEXT,
    "locale" "locale" NOT NULL DEFAULT 'FR',
    "status" "user_status" NOT NULL DEFAULT 'ACTIVE',
    "platform_role" "role_key",
    "last_login_at" TIMESTAMP(3),
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "auth_provider" NOT NULL,
    "provider_account_id" VARCHAR(255) NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_id" TEXT,
    "ip_address" INET,
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "revoked_reason" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "family_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "revoked_reason" VARCHAR(64),
    "replaced_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_method" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "provider" "payment_provider" NOT NULL,
    "external_id" VARCHAR(160) NOT NULL,
    "brand" VARCHAR(32),
    "last4" CHAR(4),
    "exp_month" INTEGER,
    "exp_year" INTEGER,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "invoice_id" TEXT,
    "provider" "payment_provider" NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "external_id" VARCHAR(160),
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "fee_amount" DECIMAL(14,2),
    "failure_reason" VARCHAR(200),
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_invoice" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "number" VARCHAR(32) NOT NULL,
    "status" "invoice_status" NOT NULL DEFAULT 'DRAFT',
    "amount_due" DECIMAL(14,2) NOT NULL,
    "amount_paid" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL,
    "issued_at" TIMESTAMP(3),
    "due_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "pdf_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(96) NOT NULL,
    "label_fr" VARCHAR(160) NOT NULL,
    "label_en" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(64) NOT NULL,
    "kind" "feature_kind" NOT NULL DEFAULT 'FLAG',
    "quota_unit" VARCHAR(48),
    "applies_to_categories" TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(48) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "billing_period" "billing_period" NOT NULL DEFAULT 'MONTHLY',
    "trial_days" INTEGER NOT NULL DEFAULT 0,
    "available_for_categories" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_feature" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "quota" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "status" "subscription_status" NOT NULL DEFAULT 'TRIALING',
    "started_at" TIMESTAMP(3) NOT NULL,
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "trial_ends_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "cancel_reason" VARCHAR(200),
    "grace_ends_at" TIMESTAMP(3),
    "provider_name" "payment_provider",
    "external_id" VARCHAR(160),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_item" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "feature_id" TEXT,
    "description" VARCHAR(200) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entitlement" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "quota" INTEGER,
    "source" "entitlement_source" NOT NULL DEFAULT 'PLAN',
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_counter" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation_token_hash_key" ON "invitation"("token_hash");

-- CreateIndex
CREATE INDEX "invitation_business_id_status_idx" ON "invitation"("business_id", "status");

-- CreateIndex
CREATE INDEX "invitation_email_idx" ON "invitation"("email");

-- CreateIndex
CREATE INDEX "invitation_expires_at_idx" ON "invitation"("expires_at");

-- CreateIndex
CREATE INDEX "audit_log_business_id_created_at_idx" ON "audit_log"("business_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_idx" ON "audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_log_actor_user_id_created_at_idx" ON "audit_log"("actor_user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_log_action_created_at_idx" ON "audit_log"("action", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "business_type_key_key" ON "business_type"("key");

-- CreateIndex
CREATE INDEX "business_type_is_client_category_sort_order_idx" ON "business_type"("is_client_category", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "business_slug_key" ON "business"("slug");

-- CreateIndex
CREATE INDEX "business_business_type_id_idx" ON "business"("business_type_id");

-- CreateIndex
CREATE INDEX "business_owner_id_idx" ON "business"("owner_id");

-- CreateIndex
CREATE INDEX "business_status_idx" ON "business"("status");

-- CreateIndex
CREATE INDEX "business_deleted_at_idx" ON "business"("deleted_at");

-- CreateIndex
CREATE INDEX "business_member_user_id_idx" ON "business_member"("user_id");

-- CreateIndex
CREATE INDEX "business_member_business_id_status_idx" ON "business_member"("business_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "business_member_business_id_user_id_key" ON "business_member"("business_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mfa_secret_user_id_key" ON "mfa_secret"("user_id");

-- CreateIndex
CREATE INDEX "recovery_code_user_id_used_at_idx" ON "recovery_code"("user_id", "used_at");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_hash_key" ON "verification_token"("token_hash");

-- CreateIndex
CREATE INDEX "verification_token_user_id_purpose_idx" ON "verification_token"("user_id", "purpose");

-- CreateIndex
CREATE INDEX "verification_token_expires_at_idx" ON "verification_token"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE INDEX "app_user_status_idx" ON "app_user"("status");

-- CreateIndex
CREATE INDEX "app_user_platform_role_idx" ON "app_user"("platform_role");

-- CreateIndex
CREATE INDEX "app_user_deleted_at_idx" ON "app_user"("deleted_at");

-- CreateIndex
CREATE INDEX "account_user_id_idx" ON "account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "account"("provider", "provider_account_id");

-- CreateIndex
CREATE INDEX "session_user_id_revoked_at_idx" ON "session"("user_id", "revoked_at");

-- CreateIndex
CREATE INDEX "session_expires_at_idx" ON "session"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_hash_key" ON "refresh_token"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_token_session_id_idx" ON "refresh_token"("session_id");

-- CreateIndex
CREATE INDEX "refresh_token_family_id_idx" ON "refresh_token"("family_id");

-- CreateIndex
CREATE INDEX "refresh_token_expires_at_idx" ON "refresh_token"("expires_at");

-- CreateIndex
CREATE INDEX "payment_method_business_id_idx" ON "payment_method"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_provider_external_id_key" ON "payment_method"("provider", "external_id");

-- CreateIndex
CREATE INDEX "payment_business_id_created_at_idx" ON "payment"("business_id", "created_at");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE INDEX "payment_external_id_idx" ON "payment"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "platform_invoice_number_key" ON "platform_invoice"("number");

-- CreateIndex
CREATE INDEX "platform_invoice_business_id_status_idx" ON "platform_invoice"("business_id", "status");

-- CreateIndex
CREATE INDEX "platform_invoice_due_at_idx" ON "platform_invoice"("due_at");

-- CreateIndex
CREATE UNIQUE INDEX "feature_key_key" ON "feature"("key");

-- CreateIndex
CREATE INDEX "feature_category_sort_order_idx" ON "feature"("category", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "plan_key_key" ON "plan"("key");

-- CreateIndex
CREATE INDEX "plan_is_active_sort_order_idx" ON "plan"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "plan_feature_feature_id_idx" ON "plan_feature"("feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "plan_feature_plan_id_feature_id_key" ON "plan_feature"("plan_id", "feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_business_id_key" ON "subscription"("business_id");

-- CreateIndex
CREATE INDEX "subscription_plan_id_idx" ON "subscription"("plan_id");

-- CreateIndex
CREATE INDEX "subscription_status_current_period_end_idx" ON "subscription"("status", "current_period_end");

-- CreateIndex
CREATE INDEX "subscription_item_subscription_id_idx" ON "subscription_item"("subscription_id");

-- CreateIndex
CREATE INDEX "subscription_item_feature_id_idx" ON "subscription_item"("feature_id");

-- CreateIndex
CREATE INDEX "entitlement_feature_id_idx" ON "entitlement"("feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "entitlement_business_id_feature_id_key" ON "entitlement"("business_id", "feature_id");

-- CreateIndex
CREATE INDEX "usage_counter_business_id_period_end_idx" ON "usage_counter"("business_id", "period_end");

-- CreateIndex
CREATE UNIQUE INDEX "usage_counter_business_id_feature_id_period_start_key" ON "usage_counter"("business_id", "feature_id", "period_start");

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_accepted_by_id_fkey" FOREIGN KEY ("accepted_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_business_type_id_fkey" FOREIGN KEY ("business_type_id") REFERENCES "business_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_member" ADD CONSTRAINT "business_member_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_member" ADD CONSTRAINT "business_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_member" ADD CONSTRAINT "business_member_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa_secret" ADD CONSTRAINT "mfa_secret_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_code" ADD CONSTRAINT "recovery_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_token" ADD CONSTRAINT "verification_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_replaced_by_id_fkey" FOREIGN KEY ("replaced_by_id") REFERENCES "refresh_token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_method" ADD CONSTRAINT "payment_method_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "platform_invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_invoice" ADD CONSTRAINT "platform_invoice_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_feature" ADD CONSTRAINT "plan_feature_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_feature" ADD CONSTRAINT "plan_feature_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_item" ADD CONSTRAINT "subscription_item_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_item" ADD CONSTRAINT "subscription_item_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlement" ADD CONSTRAINT "entitlement_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlement" ADD CONSTRAINT "entitlement_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_counter" ADD CONSTRAINT "usage_counter_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_counter" ADD CONSTRAINT "usage_counter_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
