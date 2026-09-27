-- CreateEnum
CREATE TYPE "website_page_type" AS ENUM ('HOME', 'MENU', 'ABOUT', 'CONTACT', 'GALLERY', 'FAQ', 'LEGAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "navigation_location" AS ENUM ('HEADER', 'FOOTER', 'MOBILE', 'SIDEBAR');

-- CreateEnum
CREATE TYPE "domain_status" AS ENUM ('PENDING', 'VERIFYING', 'ACTIVE', 'FAILED');

-- CreateEnum
CREATE TYPE "asset_kind" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'FONT', 'DOCUMENT', 'ICON', 'OTHER');

-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "video_provider" AS ENUM ('YOUTUBE', 'VIMEO', 'SELF_HOSTED');

-- CreateEnum
CREATE TYPE "comment_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SPAM');

-- CreateEnum
CREATE TYPE "media_kind" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateTable
CREATE TABLE "website_config" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "site_name" VARCHAR(200) NOT NULL,
    "tagline" VARCHAR(300),
    "description" TEXT,
    "logo_url" VARCHAR(500),
    "favicon_url" VARCHAR(500),
    "hero_image_url" VARCHAR(500),
    "contact_email" VARCHAR(320),
    "contact_phone" VARCHAR(32),
    "whatsapp" VARCHAR(32),
    "address_line" VARCHAR(300),
    "socials" JSONB,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "ordering_enabled" BOOLEAN NOT NULL DEFAULT true,
    "custom_css" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "preview_image_url" VARCHAR(500),
    "tokens" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_theme" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "theme_id" TEXT,
    "tokens" JSONB NOT NULL,
    "dark_tokens" JSONB,
    "overrides" JSONB,
    "custom_css" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_page" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "type" "website_page_type" NOT NULL DEFAULT 'CUSTOM',
    "sections" JSONB,
    "body" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "show_in_nav" BOOLEAN NOT NULL DEFAULT true,
    "requires_auth" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" VARCHAR(200),
    "seo_description" VARCHAR(320),
    "og_image_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_navigation" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "location" "navigation_location" NOT NULL DEFAULT 'HEADER',
    "parent_id" TEXT,
    "page_id" TEXT,
    "label" VARCHAR(120) NOT NULL,
    "url" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "opens_in_new_tab" BOOLEAN NOT NULL DEFAULT false,
    "badge" VARCHAR(40),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_navigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_domain" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "hostname" VARCHAR(255) NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "status" "domain_status" NOT NULL DEFAULT 'PENDING',
    "verification_token" VARCHAR(64),
    "dns_records" JSONB,
    "verified_at" TIMESTAMP(3),
    "ssl_issued_at" TIMESTAMP(3),
    "last_checked_at" TIMESTAMP(3),
    "failure_reason" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_asset" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "kind" "asset_kind" NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(120) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration_seconds" INTEGER,
    "alt_text" VARCHAR(300),
    "title" VARCHAR(200),
    "folder" VARCHAR(200),
    "checksum" VARCHAR(64),
    "uploaded_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_setting" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "allow_guest_checkout" BOOLEAN NOT NULL DEFAULT true,
    "require_phone" BOOLEAN NOT NULL DEFAULT true,
    "require_email" BOOLEAN NOT NULL DEFAULT false,
    "require_address" BOOLEAN NOT NULL DEFAULT false,
    "pickup_enabled" BOOLEAN NOT NULL DEFAULT true,
    "delivery_enabled" BOOLEAN NOT NULL DEFAULT false,
    "dine_in_enabled" BOOLEAN NOT NULL DEFAULT false,
    "minimum_order_amount" DECIMAL(14,2),
    "maximum_order_amount" DECIMAL(14,2),
    "lead_time_minutes" INTEGER NOT NULL DEFAULT 20,
    "order_cutoff_time" VARCHAR(5),
    "accepting_orders" BOOLEAN NOT NULL DEFAULT true,
    "tax_inclusive_pricing" BOOLEAN NOT NULL DEFAULT true,
    "tips_enabled" BOOLEAN NOT NULL DEFAULT false,
    "tip_presets" JSONB,
    "accepted_payment_methods" JSONB,
    "terms_url" VARCHAR(500),
    "privacy_url" VARCHAR(500),
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "website_config_business_id_key" ON "website_config"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "theme_key_key" ON "theme"("key");

-- CreateIndex
CREATE INDEX "theme_is_active_sort_order_idx" ON "theme"("is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "website_theme_business_id_key" ON "website_theme"("business_id");

-- CreateIndex
CREATE INDEX "website_theme_theme_id_idx" ON "website_theme"("theme_id");

-- CreateIndex
CREATE INDEX "website_page_business_id_is_published_sort_order_idx" ON "website_page"("business_id", "is_published", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "website_page_business_id_slug_key" ON "website_page"("business_id", "slug");

-- CreateIndex
CREATE INDEX "website_navigation_business_id_location_sort_order_idx" ON "website_navigation"("business_id", "location", "sort_order");

-- CreateIndex
CREATE INDEX "website_navigation_parent_id_idx" ON "website_navigation"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "website_domain_hostname_key" ON "website_domain"("hostname");

-- CreateIndex
CREATE INDEX "website_domain_business_id_is_primary_idx" ON "website_domain"("business_id", "is_primary");

-- CreateIndex
CREATE INDEX "website_asset_business_id_kind_created_at_idx" ON "website_asset"("business_id", "kind", "created_at");

-- CreateIndex
CREATE INDEX "website_asset_business_id_folder_idx" ON "website_asset"("business_id", "folder");

-- CreateIndex
CREATE UNIQUE INDEX "checkout_setting_business_id_key" ON "checkout_setting"("business_id");

-- AddForeignKey
ALTER TABLE "website_config" ADD CONSTRAINT "website_config_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_theme" ADD CONSTRAINT "website_theme_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_theme" ADD CONSTRAINT "website_theme_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_theme" ADD CONSTRAINT "website_theme_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_page" ADD CONSTRAINT "website_page_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_navigation" ADD CONSTRAINT "website_navigation_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_navigation" ADD CONSTRAINT "website_navigation_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "website_navigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_navigation" ADD CONSTRAINT "website_navigation_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "website_page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_domain" ADD CONSTRAINT "website_domain_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_asset" ADD CONSTRAINT "website_asset_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_asset" ADD CONSTRAINT "website_asset_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_setting" ADD CONSTRAINT "checkout_setting_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_setting" ADD CONSTRAINT "checkout_setting_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for the storefront.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── Hostnames are compared case-insensitively, so they are STORED that way ───
-- A unique index on a mixed-case string is defeated by typing `Boulangerie.com` instead of
-- `boulangerie.com`, and the second tenant silently wins a hostname the first one owns. The
-- comparison happens here rather than in the application because "the application always lowercases"
-- is a promise, and this is a constraint.
ALTER TABLE "website_domain" ADD CONSTRAINT "website_domain_hostname_is_lowercase"
  CHECK ("hostname" = lower("hostname"));

-- A hostname with a scheme in it is a URL, and it will never resolve.
ALTER TABLE "website_domain" ADD CONSTRAINT "website_domain_hostname_is_a_host"
  CHECK ("hostname" NOT LIKE '%/%' AND "hostname" NOT LIKE '%:%');

-- ── One primary domain, and only when it works ───────────────────────────────
-- A partial unique index, like the customer's default address: many domains, at most one primary.
CREATE UNIQUE INDEX "website_domain_one_primary_per_business"
  ON "website_domain" ("business_id") WHERE "is_primary";

-- A domain cannot be PRIMARY before it is ACTIVE: pointing the canonical URL at something that does
-- not resolve is how a working site ends up offline.
ALTER TABLE "website_domain" ADD CONSTRAINT "website_domain_primary_implies_active"
  CHECK (NOT "is_primary" OR "status" = 'ACTIVE');

-- The same rule at the row level: becoming ACTIVE means we verified it, so it needs a timestamp. And
-- a failure that cannot say why is a support ticket nobody can answer.
ALTER TABLE "website_domain" ADD CONSTRAINT "website_domain_status_implies_details"
  CHECK (
    ("status" <> 'ACTIVE' OR "verified_at" IS NOT NULL)
    AND ("status" <> 'FAILED' OR "failure_reason" IS NOT NULL)
  );

-- ── One HOME page per site, and slugs that can be a URL ──────────────────────
-- Two pages both claiming to be the home page means which one loads depends on the query plan.
CREATE UNIQUE INDEX "website_page_one_home_per_business"
  ON "website_page" ("business_id") WHERE "type" = 'HOME';

-- Slugs are stored without a leading or trailing slash and are never empty; the router adds the
-- slashes. A slug with a `..` in it is a path-traversal attempt, not a page name.
ALTER TABLE "website_page" ADD CONSTRAINT "website_page_slug_is_a_path_segment"
  CHECK (
    "slug" <> ''
    AND "slug" NOT LIKE '/%'
    AND "slug" NOT LIKE '%/'
    AND "slug" NOT LIKE '%//%'
    AND "slug" NOT LIKE '%..%'
    AND "slug" NOT LIKE '%?%'
    AND "slug" NOT LIKE '%#%'
  );

-- A published page must say when. Feeds, sitemaps and "what's new" all sort by this.
ALTER TABLE "website_page" ADD CONSTRAINT "website_page_published_has_a_date"
  CHECK (NOT "is_published" OR "published_at" IS NOT NULL);

ALTER TABLE "website_config" ADD CONSTRAINT "website_config_published_has_a_date"
  CHECK (NOT "is_published" OR "published_at" IS NOT NULL);

-- ── A navigation entry must go somewhere ─────────────────────────────────────
-- A page reference or a URL — one of the two. An entry with neither renders as a link to nowhere,
-- and an entry with both is ambiguous about which wins.
ALTER TABLE "website_navigation" ADD CONSTRAINT "website_navigation_targets_exactly_one_thing"
  CHECK (num_nonnulls("page_id", "url") = 1);

-- ── Uploaded files ───────────────────────────────────────────────────────────
ALTER TABLE "website_asset" ADD CONSTRAINT "website_asset_has_a_size"
  CHECK ("size_bytes" > 0);

-- Dimensions come in pairs, as coordinates do: half a size is not a size, and a gallery that trusts a
-- width without a height gets a broken layout rather than an error.
ALTER TABLE "website_asset" ADD CONSTRAINT "website_asset_dimensions_complete_and_positive"
  CHECK (
    (("width" IS NULL) = ("height" IS NULL))
    AND ("width" IS NULL OR "width" > 0)
    AND ("height" IS NULL OR "height" > 0)
    AND ("duration_seconds" IS NULL OR "duration_seconds" >= 0)
  );

-- ── Checkout rules that must not contradict themselves ───────────────────────
ALTER TABLE "checkout_setting" ADD CONSTRAINT "checkout_setting_bounds_ordered"
  CHECK (
    "minimum_order_amount" IS NULL
    OR "maximum_order_amount" IS NULL
    OR "maximum_order_amount" >= "minimum_order_amount"
  );

ALTER TABLE "checkout_setting" ADD CONSTRAINT "checkout_setting_bounds_not_negative"
  CHECK (
    ("minimum_order_amount" IS NULL OR "minimum_order_amount" >= 0)
    AND ("maximum_order_amount" IS NULL OR "maximum_order_amount" >= 0)
  );

ALTER TABLE "checkout_setting" ADD CONSTRAINT "checkout_setting_lead_time_sane"
  CHECK ("lead_time_minutes" >= 0);

-- "HH:MM", and a wall-clock rule rather than an instant. A malformed value here would be compared as
-- a string and silently never match, so the checkout would stop accepting orders at no time at all.
ALTER TABLE "checkout_setting" ADD CONSTRAINT "checkout_setting_cutoff_is_a_time"
  CHECK ("order_cutoff_time" IS NULL OR "order_cutoff_time" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');

-- ── Theme tokens must be an object ───────────────────────────────────────────
-- `[]` and `"red"` are valid JSON and meaningless as tokens. Checking the type here means a theme
-- resolver can index into them without defending against the wrong shape.
ALTER TABLE "theme" ADD CONSTRAINT "theme_tokens_are_an_object"
  CHECK (jsonb_typeof("tokens") = 'object');

ALTER TABLE "website_theme" ADD CONSTRAINT "website_theme_tokens_are_an_object"
  CHECK (
    jsonb_typeof("tokens") = 'object'
    AND ("dark_tokens" IS NULL OR jsonb_typeof("dark_tokens") = 'object')
    AND ("overrides" IS NULL OR jsonb_typeof("overrides") = 'object')
  );

