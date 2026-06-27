import { Router, type IRouter } from "express";
import { db, brandsTable, reviewsTable } from "@workspace/db";
import { GetStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const brands = await db.select({ id: brandsTable.id }).from(brandsTable);
  const reviews = await db
    .select({
      rating: reviewsTable.rating,
      status: reviewsTable.status,
      createdAt: reviewsTable.createdAt,
    })
    .from(reviewsTable);

  const totalBrands = brands.length;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
  const avgRating =
    totalReviews > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10
      : 0;

  const distMap = new Map<number, number>([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ]);
  for (const r of reviews) {
    distMap.set(r.rating, (distMap.get(r.rating) ?? 0) + 1);
  }
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: distMap.get(rating) ?? 0,
  }));

  const dayMap = new Map<string, number>();
  const days = 30;
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of reviews) {
    const key = r.createdAt.toISOString().slice(0, 10);
    if (dayMap.has(key)) {
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    }
  }
  const reviewsByDay = Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }));

  res.json(
    GetStatsResponse.parse({
      totalBrands,
      totalReviews,
      avgRating,
      pendingReviews,
      ratingDistribution,
      reviewsByDay,
    }),
  );
});

export default router;
