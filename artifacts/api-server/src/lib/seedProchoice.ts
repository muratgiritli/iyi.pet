import { eq, and, sql } from "drizzle-orm";
import { db, brandsTable, reviewsTable } from "@workspace/db";
import { logger } from "./logger";
import prochoiceReviews from "../seed/prochoice-reviews.json";

interface SeedReview {
  id: number;
  firstName: string;
  lastNameInitial: string;
  displayName: string;
  rating: number;
  petType: string;
  product: string;
  comment: string;
  createdAt: string;
}

const PROCHOICE_BRAND = {
  name: "ProChoice",
  slug: "prochoice",
  category: "standard",
  origin: "local",
  logoText: "PC",
  websiteUrl: "https://www.prochoice.com.tr/",
  description:
    "Veteriner hekimler ve beslenme uzmanları tarafından geliştirilen ProChoice; kedi ve köpekler için kuru mama, yaş mama, ödül maması ve vitamin takviyeleri sunar.",
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function ensureProchoiceBrand(): Promise<number> {
  const [existingNew] = await db.select().from(brandsTable).where(eq(brandsTable.slug, "prochoice"));
  if (existingNew) {
    await db.update(brandsTable).set(PROCHOICE_BRAND).where(eq(brandsTable.id, existingNew.id));
    return existingNew.id;
  }
  const [existingOld] = await db.select().from(brandsTable).where(eq(brandsTable.slug, "pro-choice"));
  if (existingOld) {
    await db.update(brandsTable).set(PROCHOICE_BRAND).where(eq(brandsTable.id, existingOld.id));
    return existingOld.id;
  }
  const [created] = await db.insert(brandsTable).values(PROCHOICE_BRAND).returning({ id: brandsTable.id });
  return created.id;
}

export async function recomputeBrandAggregates(brandId: number): Promise<void> {
  await db.execute(sql`
    UPDATE brands b
    SET review_count = COALESCE(agg.cnt, 0),
        rating = COALESCE(agg.avg_rating, 0)
    FROM (
      SELECT count(*)::int AS cnt, round(avg(rating)::numeric, 1)::float AS avg_rating
      FROM reviews
      WHERE brand_id = ${brandId} AND status = 'approved'
    ) agg
    WHERE b.id = ${brandId}
  `);
}

export async function seedProchoice(): Promise<void> {
  const reviews = prochoiceReviews as SeedReview[];
  const brandId = await ensureProchoiceBrand();

  let inserted = 0;
  let skipped = 0;

  for (const r of reviews) {
    const [existing] = await db
      .select({ id: reviewsTable.id })
      .from(reviewsTable)
      .where(
        and(
          eq(reviewsTable.brandId, brandId),
          eq(reviewsTable.author, r.displayName),
          eq(reviewsTable.text, r.comment),
        ),
      );
    if (existing) {
      skipped++;
      continue;
    }
    await db.insert(reviewsTable).values({
      brandId,
      firstName: r.firstName,
      lastName: r.lastNameInitial,
      phone: "",
      author: r.displayName,
      avatar: r.firstName.trim().charAt(0).toLocaleUpperCase("tr") || "?",
      rating: r.rating,
      title: r.product,
      text: r.comment,
      petType: r.petType,
      status: "approved",
      helpfulCount: randomInt(4, 15),
      unhelpfulCount: randomInt(0, 2),
      translationStatus: "pending",
      createdAt: new Date(`${r.createdAt}T12:00:00+03:00`),
    });
    inserted++;
  }

  await recomputeBrandAggregates(brandId);

  const stats = {
    total: reviews.length,
    inserted,
    skipped,
    good: reviews.filter((r) => r.rating >= 4).length,
    mid: reviews.filter((r) => r.rating === 3).length,
    bad: reviews.filter((r) => r.rating <= 2).length,
    kedi: reviews.filter((r) => r.petType === "Kedi").length,
    kopek: reviews.filter((r) => r.petType === "Köpek").length,
    avg: Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 100) / 100,
  };
  logger.info(stats, "ProChoice seed done");
}
