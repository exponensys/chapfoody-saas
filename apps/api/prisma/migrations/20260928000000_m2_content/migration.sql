-- CreateTable
CREATE TABLE "blog_category" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_tag" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_tag" (
    "post_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "blog_post_tag_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "blog_post" (
    "id" TEXT NOT NULL,
    "category_id" TEXT,
    "author_id" TEXT,
    "slug" VARCHAR(200) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "excerpt" VARCHAR(500),
    "body" TEXT NOT NULL,
    "cover_image_url" VARCHAR(500),
    "status" "content_status" NOT NULL DEFAULT 'DRAFT',
    "scheduled_for" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "reading_minutes" INTEGER NOT NULL DEFAULT 1,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "locale" VARCHAR(10),
    "seo_title" VARCHAR(200),
    "seo_description" VARCHAR(320),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_comment" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "author_name" VARCHAR(160) NOT NULL,
    "author_email" VARCHAR(320),
    "body" TEXT NOT NULL,
    "status" "comment_status" NOT NULL DEFAULT 'PENDING',
    "ip_address" INET,
    "user_agent" TEXT,
    "moderated_by_id" TEXT,
    "moderated_at" TIMESTAMP(3),
    "moderation_note" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_collection" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "cover_image_url" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video" (
    "id" TEXT NOT NULL,
    "collection_id" TEXT,
    "title" VARCHAR(250) NOT NULL,
    "slug" VARCHAR(200),
    "description" TEXT,
    "provider" "video_provider" NOT NULL,
    "external_id" VARCHAR(120),
    "url" VARCHAR(500),
    "thumbnail_url" VARCHAR(500),
    "duration_seconds" INTEGER,
    "transcript_url" VARCHAR(500),
    "status" "content_status" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "scheduled_for" TIMESTAMP(3),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_study" (
    "id" TEXT NOT NULL,
    "business_type_id" TEXT,
    "slug" VARCHAR(200) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "business_name" VARCHAR(200) NOT NULL,
    "industry" VARCHAR(160),
    "summary" VARCHAR(500),
    "body" TEXT NOT NULL,
    "cover_image_url" VARCHAR(500),
    "logo_url" VARCHAR(500),
    "results" JSONB,
    "status" "content_status" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "scheduled_for" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" VARCHAR(200),
    "seo_description" VARCHAR(320),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "use_case" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "summary" VARCHAR(500),
    "body" TEXT,
    "icon" VARCHAR(120),
    "audience" VARCHAR(160),
    "status" "content_status" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "use_case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "kind" "media_kind" NOT NULL,
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

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "body" TEXT NOT NULL,
    "status" "content_status" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "template_key" VARCHAR(80),
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" VARCHAR(200),
    "seo_description" VARCHAR(320),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_meta" (
    "id" TEXT NOT NULL,
    "path" VARCHAR(300) NOT NULL,
    "title" VARCHAR(200),
    "description" VARCHAR(320),
    "keywords" VARCHAR(500),
    "canonical_url" VARCHAR(500),
    "og_image_url" VARCHAR(500),
    "og_type" VARCHAR(60),
    "no_index" BOOLEAN NOT NULL DEFAULT false,
    "no_follow" BOOLEAN NOT NULL DEFAULT false,
    "structured_data" JSONB,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_category_slug_key" ON "blog_category"("slug");

-- CreateIndex
CREATE INDEX "blog_category_is_active_sort_order_idx" ON "blog_category"("is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tag_slug_key" ON "blog_tag"("slug");

-- CreateIndex
CREATE INDEX "blog_post_tag_tag_id_idx" ON "blog_post_tag"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_slug_key" ON "blog_post"("slug");

-- CreateIndex
CREATE INDEX "blog_post_status_published_at_idx" ON "blog_post"("status", "published_at");

-- CreateIndex
CREATE INDEX "blog_post_category_id_status_idx" ON "blog_post"("category_id", "status");

-- CreateIndex
CREATE INDEX "blog_post_is_featured_published_at_idx" ON "blog_post"("is_featured", "published_at");

-- CreateIndex
CREATE INDEX "blog_comment_post_id_status_created_at_idx" ON "blog_comment"("post_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "blog_comment_parent_id_idx" ON "blog_comment"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_collection_slug_key" ON "video_collection"("slug");

-- CreateIndex
CREATE INDEX "video_collection_is_active_sort_order_idx" ON "video_collection"("is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "video_slug_key" ON "video"("slug");

-- CreateIndex
CREATE INDEX "video_status_published_at_sort_order_idx" ON "video"("status", "published_at", "sort_order");

-- CreateIndex
CREATE INDEX "video_collection_id_sort_order_idx" ON "video"("collection_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "case_study_slug_key" ON "case_study"("slug");

-- CreateIndex
CREATE INDEX "case_study_status_published_at_idx" ON "case_study"("status", "published_at");

-- CreateIndex
CREATE INDEX "case_study_is_featured_sort_order_idx" ON "case_study"("is_featured", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "use_case_slug_key" ON "use_case"("slug");

-- CreateIndex
CREATE INDEX "use_case_status_sort_order_idx" ON "use_case"("status", "sort_order");

-- CreateIndex
CREATE INDEX "media_kind_created_at_idx" ON "media"("kind", "created_at");

-- CreateIndex
CREATE INDEX "media_folder_idx" ON "media"("folder");

-- CreateIndex
CREATE UNIQUE INDEX "page_slug_key" ON "page"("slug");

-- CreateIndex
CREATE INDEX "page_status_slug_idx" ON "page"("status", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "seo_meta_path_key" ON "seo_meta"("path");

-- CreateIndex
CREATE INDEX "seo_meta_no_index_idx" ON "seo_meta"("no_index");

-- AddForeignKey
ALTER TABLE "blog_post_tag" ADD CONSTRAINT "blog_post_tag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_tag" ADD CONSTRAINT "blog_post_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "blog_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "blog_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "blog_comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_moderated_by_id_fkey" FOREIGN KEY ("moderated_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "video_collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_study" ADD CONSTRAINT "case_study_business_type_id_fkey" FOREIGN KEY ("business_type_id") REFERENCES "business_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_meta" ADD CONSTRAINT "seo_meta_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ═════════════════════════════════════════════════════════════════════════════
-- Constraints Prisma cannot express, for content.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── A publication state must carry its evidence ──────────────────────────────
-- PUBLISHED without a date, or SCHEDULED without a time, is a state that cannot be acted on: every
-- archive sorts on the date, and a scheduler with nothing to compare against never fires. One rule,
-- applied to each table that has the columns.
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_status_implies_dates"
  CHECK (
    ("status" <> 'PUBLISHED' OR "published_at" IS NOT NULL)
    AND ("status" <> 'SCHEDULED' OR "scheduled_for" IS NOT NULL)
  );

ALTER TABLE "video" ADD CONSTRAINT "video_status_implies_dates"
  CHECK (
    ("status" <> 'PUBLISHED' OR "published_at" IS NOT NULL)
    AND ("status" <> 'SCHEDULED' OR "scheduled_for" IS NOT NULL)
  );

ALTER TABLE "case_study" ADD CONSTRAINT "case_study_status_implies_dates"
  CHECK (
    ("status" <> 'PUBLISHED' OR "published_at" IS NOT NULL)
    AND ("status" <> 'SCHEDULED' OR "scheduled_for" IS NOT NULL)
  );

ALTER TABLE "page" ADD CONSTRAINT "page_status_implies_date"
  CHECK ("status" <> 'PUBLISHED' OR "published_at" IS NOT NULL);

ALTER TABLE "use_case" ADD CONSTRAINT "use_case_status_implies_date"
  CHECK ("status" <> 'PUBLISHED' OR "published_at" IS NOT NULL);

-- ── Slugs are path segments, exactly as on the storefront ────────────────────
-- These end up in a URL and in a sitemap, so the same rules apply: no leading or trailing slash, no
-- empty segments, and no `..`, which is a traversal attempt rather than a title.
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_slug_is_a_path_segment"
  CHECK (
    "slug" <> '' AND "slug" NOT LIKE '/%' AND "slug" NOT LIKE '%/'
    AND "slug" NOT LIKE '%//%' AND "slug" NOT LIKE '%..%'
  );

ALTER TABLE "page" ADD CONSTRAINT "page_slug_is_a_path_segment"
  CHECK (
    "slug" <> '' AND "slug" NOT LIKE '/%' AND "slug" NOT LIKE '%/'
    AND "slug" NOT LIKE '%//%' AND "slug" NOT LIKE '%..%'
  );

-- ── A provider must be able to identify the video ────────────────────────────
-- YOUTUBE and VIMEO need an id to build an embed from; SELF_HOSTED needs a URL. A row with neither
-- renders as an empty player, and a row with both is ambiguous about which one wins.
ALTER TABLE "video" ADD CONSTRAINT "video_provider_has_its_identifier"
  CHECK (
    ("provider" = 'SELF_HOSTED' AND "url" IS NOT NULL AND "external_id" IS NULL)
    OR ("provider" <> 'SELF_HOSTED' AND "external_id" IS NOT NULL AND "url" IS NULL)
  );

-- ── Counters and durations do not go negative ────────────────────────────────
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_counters_sane"
  CHECK ("view_count" >= 0 AND "reading_minutes" > 0);

ALTER TABLE "video" ADD CONSTRAINT "video_counters_sane"
  CHECK ("view_count" >= 0 AND ("duration_seconds" IS NULL OR "duration_seconds" > 0));

ALTER TABLE "media" ADD CONSTRAINT "media_has_a_size"
  CHECK ("size_bytes" > 0);

ALTER TABLE "media" ADD CONSTRAINT "media_dimensions_complete_and_positive"
  CHECK (
    (("width" IS NULL) = ("height" IS NULL))
    AND ("width" IS NULL OR "width" > 0)
    AND ("height" IS NULL OR "height" > 0)
    AND ("duration_seconds" IS NULL OR "duration_seconds" > 0)
  );

-- ── A moderated comment must say who decided and when ────────────────────────
-- PENDING is the only state with no moderator, because it is the only state nothing has happened to.
-- Without this, "who approved this?" has no answer — which is the question asked the first time
-- something offensive gets through.
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_moderation_is_all_or_nothing"
  CHECK (
    ("status" = 'PENDING' AND "moderated_by_id" IS NULL AND "moderated_at" IS NULL)
    OR ("status" <> 'PENDING' AND "moderated_at" IS NOT NULL)
  );

ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_body_not_empty"
  CHECK (length(btrim("body")) > 0);

-- ── SEO overrides key on a path, so the path must be one ─────────────────────
-- Relative to the site root and starting with a slash: "/blog/mon-article", never a full URL. A full
-- URL here would create a second way to say the same thing, and the canonical tag already exists.
ALTER TABLE "seo_meta" ADD CONSTRAINT "seo_meta_path_is_a_site_path"
  CHECK (
    "path" LIKE '/%'
    AND "path" NOT LIKE '%//%'
    AND "path" NOT LIKE '%..%'
    AND "path" NOT LIKE '%://%'
  );

-- schema.org JSON-LD as an object. A bare string or an array would parse and then produce a script
-- tag no search engine accepts.
ALTER TABLE "seo_meta" ADD CONSTRAINT "seo_meta_structured_data_is_an_object"
  CHECK ("structured_data" IS NULL OR jsonb_typeof("structured_data") = 'object');

