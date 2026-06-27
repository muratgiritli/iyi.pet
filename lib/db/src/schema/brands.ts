import { pgTable, text, serial, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const brandsTable = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  category: text("category").notNull().default("standard"),
  origin: text("origin").notNull().default("global"),
  logoText: text("logo_text").notNull(),
  logoColor: text("logo_color").notNull().default("#1a1a1a"),
  logoBg: text("logo_bg").notNull().default("#ffffff"),
  verified: boolean("verified").notNull().default(false),
  websiteUrl: text("website_url").notNull().default(""),
  productsUrl: text("products_url").notNull().default(""),
  description: text("description").notNull().default(""),
  pinned: boolean("pinned").notNull().default(false),
  pinnedRank: integer("pinned_rank").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBrandSchema = createInsertSchema(brandsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brandsTable.$inferSelect;
