import { pgTable, text, serial, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { reviewsTable } from "./reviews";

export const reviewTranslationsTable = pgTable(
  "review_translations",
  {
    id: serial("id").primaryKey(),
    reviewId: integer("review_id")
      .notNull()
      .references(() => reviewsTable.id, { onDelete: "cascade" }),
    lang: text("lang").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("review_translations_review_lang_idx").on(t.reviewId, t.lang)],
);

export const insertReviewTranslationSchema = createInsertSchema(reviewTranslationsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertReviewTranslation = z.infer<typeof insertReviewTranslationSchema>;
export type ReviewTranslation = typeof reviewTranslationsTable.$inferSelect;
