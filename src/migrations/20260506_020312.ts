import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "legacy_post" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_legacy_post" boolean DEFAULT false;
  ALTER TABLE "knowledge_hub_pages" ADD COLUMN "json_ld" varchar;
  ALTER TABLE "_knowledge_hub_pages_v" ADD COLUMN "version_json_ld" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "legacy_post";
  ALTER TABLE "_posts_v" DROP COLUMN "version_legacy_post";
  ALTER TABLE "knowledge_hub_pages" DROP COLUMN "json_ld";
  ALTER TABLE "_knowledge_hub_pages_v" DROP COLUMN "version_json_ld";`)
}
