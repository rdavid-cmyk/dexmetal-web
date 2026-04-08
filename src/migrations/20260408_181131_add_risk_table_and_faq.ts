import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_risk_table_level" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum_posts_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum__posts_v_version_risk_table_level" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum__posts_v_version_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_knowledge_hub_pages_section" AS ENUM('Knowledge Hub', 'Notification Doc', 'Movement Doc', 'PIC Workflows', 'Country', 'Supporting Docs', 'E-Waste', 'Additional Ref', 'Tools', 'API', 'Shell');
  CREATE TYPE "public"."enum_knowledge_hub_pages_page_type" AS ENUM('guide', 'reference', 'index', 'tool', 'landing', 'static');
  CREATE TYPE "public"."enum_knowledge_hub_pages_priority" AS ENUM('P1', 'P2');
  CREATE TYPE "public"."enum_knowledge_hub_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__knowledge_hub_pages_v_version_section" AS ENUM('Knowledge Hub', 'Notification Doc', 'Movement Doc', 'PIC Workflows', 'Country', 'Supporting Docs', 'E-Waste', 'Additional Ref', 'Tools', 'API', 'Shell');
  CREATE TYPE "public"."enum__knowledge_hub_pages_v_version_page_type" AS ENUM('guide', 'reference', 'index', 'tool', 'landing', 'static');
  CREATE TYPE "public"."enum__knowledge_hub_pages_v_version_priority" AS ENUM('P1', 'P2');
  CREATE TYPE "public"."enum__knowledge_hub_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tools_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tools_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "posts_risk_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"level" "enum_posts_risk_table_level",
  	"description" varchar,
  	"country" varchar
  );
  
  CREATE TABLE "posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_posts_v_version_risk_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"level" "enum__posts_v_version_risk_table_level",
  	"description" varchar,
  	"country" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "knowledge_hub_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"section" "enum_knowledge_hub_pages_section",
  	"page_type" "enum_knowledge_hub_pages_page_type",
  	"priority" "enum_knowledge_hub_pages_priority" DEFAULT 'P1',
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"wp_post_id" numeric,
  	"wp_url" varchar,
  	"redirect_from" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_knowledge_hub_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_knowledge_hub_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_section" "enum__knowledge_hub_pages_v_version_section",
  	"version_page_type" "enum__knowledge_hub_pages_v_version_page_type",
  	"version_priority" "enum__knowledge_hub_pages_v_version_priority" DEFAULT 'P1',
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_wp_post_id" numeric,
  	"version_wp_url" varchar,
  	"version_redirect_from" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__knowledge_hub_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "tools" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tools_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_tools_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tools_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"cover_image_id" integer,
  	"category" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_blog_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_cover_image_id" integer,
  	"version_category" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "posts" ADD COLUMN "at_a_glance" varchar;
  ALTER TABLE "posts" ADD COLUMN "toc_enabled" boolean DEFAULT true;
  ALTER TABLE "posts" ADD COLUMN "difficulty" "enum_posts_difficulty";
  ALTER TABLE "posts" ADD COLUMN "read_time" numeric;
  ALTER TABLE "posts" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "posts" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_at_a_glance" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_toc_enabled" boolean DEFAULT true;
  ALTER TABLE "_posts_v" ADD COLUMN "version_difficulty" "enum__posts_v_version_difficulty";
  ALTER TABLE "_posts_v" ADD COLUMN "version_read_time" numeric;
  ALTER TABLE "_posts_v" ADD COLUMN "version_cta_label" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_cta_url" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "knowledge_hub_pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tools_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_posts_id" integer;
  ALTER TABLE "posts_risk_table" ADD CONSTRAINT "posts_risk_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_faq" ADD CONSTRAINT "posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_risk_table" ADD CONSTRAINT "_posts_v_version_risk_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_faq" ADD CONSTRAINT "_posts_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_knowledge_hub_pages_v" ADD CONSTRAINT "_knowledge_hub_pages_v_parent_id_knowledge_hub_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."knowledge_hub_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tools_v" ADD CONSTRAINT "_tools_v_parent_id_tools_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_parent_id_blog_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_risk_table_order_idx" ON "posts_risk_table" USING btree ("_order");
  CREATE INDEX "posts_risk_table_parent_id_idx" ON "posts_risk_table" USING btree ("_parent_id");
  CREATE INDEX "posts_faq_order_idx" ON "posts_faq" USING btree ("_order");
  CREATE INDEX "posts_faq_parent_id_idx" ON "posts_faq" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_risk_table_order_idx" ON "_posts_v_version_risk_table" USING btree ("_order");
  CREATE INDEX "_posts_v_version_risk_table_parent_id_idx" ON "_posts_v_version_risk_table" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_faq_order_idx" ON "_posts_v_version_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_version_faq_parent_id_idx" ON "_posts_v_version_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "knowledge_hub_pages_slug_idx" ON "knowledge_hub_pages" USING btree ("slug");
  CREATE INDEX "knowledge_hub_pages_updated_at_idx" ON "knowledge_hub_pages" USING btree ("updated_at");
  CREATE INDEX "knowledge_hub_pages_created_at_idx" ON "knowledge_hub_pages" USING btree ("created_at");
  CREATE INDEX "knowledge_hub_pages__status_idx" ON "knowledge_hub_pages" USING btree ("_status");
  CREATE INDEX "_knowledge_hub_pages_v_parent_idx" ON "_knowledge_hub_pages_v" USING btree ("parent_id");
  CREATE INDEX "_knowledge_hub_pages_v_version_version_slug_idx" ON "_knowledge_hub_pages_v" USING btree ("version_slug");
  CREATE INDEX "_knowledge_hub_pages_v_version_version_updated_at_idx" ON "_knowledge_hub_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_knowledge_hub_pages_v_version_version_created_at_idx" ON "_knowledge_hub_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_knowledge_hub_pages_v_version_version__status_idx" ON "_knowledge_hub_pages_v" USING btree ("version__status");
  CREATE INDEX "_knowledge_hub_pages_v_created_at_idx" ON "_knowledge_hub_pages_v" USING btree ("created_at");
  CREATE INDEX "_knowledge_hub_pages_v_updated_at_idx" ON "_knowledge_hub_pages_v" USING btree ("updated_at");
  CREATE INDEX "_knowledge_hub_pages_v_latest_idx" ON "_knowledge_hub_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "tools_slug_idx" ON "tools" USING btree ("slug");
  CREATE INDEX "tools_updated_at_idx" ON "tools" USING btree ("updated_at");
  CREATE INDEX "tools_created_at_idx" ON "tools" USING btree ("created_at");
  CREATE INDEX "tools__status_idx" ON "tools" USING btree ("_status");
  CREATE INDEX "_tools_v_parent_idx" ON "_tools_v" USING btree ("parent_id");
  CREATE INDEX "_tools_v_version_version_slug_idx" ON "_tools_v" USING btree ("version_slug");
  CREATE INDEX "_tools_v_version_version_updated_at_idx" ON "_tools_v" USING btree ("version_updated_at");
  CREATE INDEX "_tools_v_version_version_created_at_idx" ON "_tools_v" USING btree ("version_created_at");
  CREATE INDEX "_tools_v_version_version__status_idx" ON "_tools_v" USING btree ("version__status");
  CREATE INDEX "_tools_v_created_at_idx" ON "_tools_v" USING btree ("created_at");
  CREATE INDEX "_tools_v_updated_at_idx" ON "_tools_v" USING btree ("updated_at");
  CREATE INDEX "_tools_v_latest_idx" ON "_tools_v" USING btree ("latest");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_cover_image_idx" ON "blog_posts" USING btree ("cover_image_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts__status_idx" ON "blog_posts" USING btree ("_status");
  CREATE INDEX "_blog_posts_v_parent_idx" ON "_blog_posts_v" USING btree ("parent_id");
  CREATE INDEX "_blog_posts_v_version_version_slug_idx" ON "_blog_posts_v" USING btree ("version_slug");
  CREATE INDEX "_blog_posts_v_version_version_cover_image_idx" ON "_blog_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_blog_posts_v_version_version_updated_at_idx" ON "_blog_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_posts_v_version_version_created_at_idx" ON "_blog_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_posts_v_version_version__status_idx" ON "_blog_posts_v" USING btree ("version__status");
  CREATE INDEX "_blog_posts_v_created_at_idx" ON "_blog_posts_v" USING btree ("created_at");
  CREATE INDEX "_blog_posts_v_updated_at_idx" ON "_blog_posts_v" USING btree ("updated_at");
  CREATE INDEX "_blog_posts_v_latest_idx" ON "_blog_posts_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_hub_pages_fk" FOREIGN KEY ("knowledge_hub_pages_id") REFERENCES "public"."knowledge_hub_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tools_fk" FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_knowledge_hub_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_hub_pages_id");
  CREATE INDEX "payload_locked_documents_rels_tools_id_idx" ON "payload_locked_documents_rels" USING btree ("tools_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_risk_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_risk_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "knowledge_hub_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_knowledge_hub_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tools_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_risk_table" CASCADE;
  DROP TABLE "posts_faq" CASCADE;
  DROP TABLE "_posts_v_version_risk_table" CASCADE;
  DROP TABLE "_posts_v_version_faq" CASCADE;
  DROP TABLE "knowledge_hub_pages" CASCADE;
  DROP TABLE "_knowledge_hub_pages_v" CASCADE;
  DROP TABLE "tools" CASCADE;
  DROP TABLE "_tools_v" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "_blog_posts_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_knowledge_hub_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tools_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_posts_fk";
  
  DROP INDEX "payload_locked_documents_rels_knowledge_hub_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_tools_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_posts_id_idx";
  ALTER TABLE "posts" DROP COLUMN "at_a_glance";
  ALTER TABLE "posts" DROP COLUMN "toc_enabled";
  ALTER TABLE "posts" DROP COLUMN "difficulty";
  ALTER TABLE "posts" DROP COLUMN "read_time";
  ALTER TABLE "posts" DROP COLUMN "cta_label";
  ALTER TABLE "posts" DROP COLUMN "cta_url";
  ALTER TABLE "_posts_v" DROP COLUMN "version_at_a_glance";
  ALTER TABLE "_posts_v" DROP COLUMN "version_toc_enabled";
  ALTER TABLE "_posts_v" DROP COLUMN "version_difficulty";
  ALTER TABLE "_posts_v" DROP COLUMN "version_read_time";
  ALTER TABLE "_posts_v" DROP COLUMN "version_cta_label";
  ALTER TABLE "_posts_v" DROP COLUMN "version_cta_url";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "knowledge_hub_pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tools_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_posts_id";
  DROP TYPE "public"."enum_posts_risk_table_level";
  DROP TYPE "public"."enum_posts_difficulty";
  DROP TYPE "public"."enum__posts_v_version_risk_table_level";
  DROP TYPE "public"."enum__posts_v_version_difficulty";
  DROP TYPE "public"."enum_knowledge_hub_pages_section";
  DROP TYPE "public"."enum_knowledge_hub_pages_page_type";
  DROP TYPE "public"."enum_knowledge_hub_pages_priority";
  DROP TYPE "public"."enum_knowledge_hub_pages_status";
  DROP TYPE "public"."enum__knowledge_hub_pages_v_version_section";
  DROP TYPE "public"."enum__knowledge_hub_pages_v_version_page_type";
  DROP TYPE "public"."enum__knowledge_hub_pages_v_version_priority";
  DROP TYPE "public"."enum__knowledge_hub_pages_v_version_status";
  DROP TYPE "public"."enum_tools_status";
  DROP TYPE "public"."enum__tools_v_version_status";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum__blog_posts_v_version_status";`)
}
