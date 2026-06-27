import { Router, type IRouter } from "express";
import { db, brandsTable, reviewsTable } from "@workspace/db";
import { GetStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const brands = await db
    .select({ id: brandsTable.id, name: brandsTable.name })
    .from(brandsTable);
  const reviews = await db
    .select({
      brandId: reviewsTable.brandId,
      rating: reviewsTable.rating,
      status: reviewsTable.status,
      reportCount: reviewsTable.reportCount,
      createdAt: reviewsTable.createdAt,
    })
    .from(reviewsTable);

  const totalBrands = brands.length;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
  const reportedReviews = reviews.filter((r) => r.reportCount > 0).length;
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

  const nameById = new Map(brands.map((b) => [b.id, b.name]));
  const brandCount = new Map<number, number>();
  for (const r of reviews) {
    brandCount.set(r.brandId, (brandCount.get(r.brandId) ?? 0) + 1);
  }
  const topBrands = Array.from(brandCount.entries())
    .map(([id, count]) => ({ name: nameById.get(id) ?? "—", count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const avgRatingTrend: { date: string; avg: number }[] = [];
  for (const dateKey of dayMap.keys()) {
    const cutoff = new Date(`${dateKey}T23:59:59.999Z`);
    const subset = reviews.filter((r) => r.createdAt <= cutoff);
    const avg =
      subset.length > 0
        ? Math.round((subset.reduce((s, r) => s + r.rating, 0) / subset.length) * 100) / 100
        : 0;
    avgRatingTrend.push({ date: dateKey, avg });
  }

  res.json(
    GetStatsResponse.parse({
      totalBrands,
      totalReviews,
      avgRating,
      pendingReviews,
      reportedReviews,
      ratingDistribution,
      reviewsByDay,
      topBrands,
      avgRatingTrend,
    }),
  );
});

export default router;
