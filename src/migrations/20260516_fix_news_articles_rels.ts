import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_articles_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_articles_fk" FOREIGN KEY ("news_articles_id") REFERENCES "public"."news_articles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_news_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("news_articles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "payload_locked_documents_rels_news_articles_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_articles_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_articles_id";`)
}
