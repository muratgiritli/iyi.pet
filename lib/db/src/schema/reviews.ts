import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  phone: text("phone").notNull().default(""),
  author: text("author").notNull(),
  avatar: text("avatar").notNull().default("?"),
  rating: integer("rating").notNull(),
  title: text("title").notNull().default(""),
  text: text("text").notNull(),
  petType: text("pet_type").notNull().default(""),
  photoBase64: text("photo_base64"),
  status: text("status").notNull().default("pending"),
  helpfulCount: integer("helpful_count").notNull().default(0),
  unhelpfulCount: integer("unhelpful_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
