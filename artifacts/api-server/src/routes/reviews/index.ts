import { Router, type IRouter } from "express";
import { eq, desc, inArray } from "drizzle-orm";
import { db, reviewsTable, reviewTranslationsTable, settingsTable, type Review } from "@workspace/db";
import { translateReviewInBackground } from "../../lib/translateReview";
import {
  CreateReviewBody,
  CreateReviewResponse,
  ListReviewsResponse,
  ListPublicReviewsResponse,
  UpdateReviewStatusBody,
  UpdateReviewStatusParams,
  UpdateReviewStatusResponse,
  DeleteReviewParams,
  VoteReviewBody,
  VoteReviewParams,
  VoteReviewResponse,
  BulkReviewActionBody,
  BulkReviewActionResponse,
  ReportReviewParams,
  ReportReviewResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toAdmin(r: Review) {
  return { ...r, createdAt: r.createdAt.toISOString() };
}

async function loadTranslations(reviewIds: number[]): Promise<Map<number, Record<string, string>>> {
  const map = new Map<number, Record<string, string>>();
  if (reviewIds.length === 0) return map;
  const rows = await db
    .select()
    .from(reviewTranslationsTable)
    .where(inArray(reviewTranslationsTable.reviewId, reviewIds));
  for (const row of rows) {
    const entry = map.get(row.reviewId) ?? {};
    entry[row.lang] = row.text;
    map.set(row.reviewId, entry);
  }
  return map;
}

function toPublic(r: Review, translations?: Record<string, string>) {
  return {
    id: r.id,
    brandId: r.brandId,
    author: r.author,
    avatar: r.avatar,
    rating: r.rating,
    title: r.title,
    text: r.text,
    petType: r.petType,
    photoBase64: r.photoBase64,
    status: r.status,
    helpfulCount: r.helpfulCount,
    unhelpfulCount: r.unhelpfulCount,
    reportCount: r.reportCount,
    createdAt: r.createdAt.toISOString(),
    ...(translations && Object.keys(translations).length > 0 ? { translations } : {}),
  };
}

router.get("/reviews", async (_req, res): Promise<void> => {
  const rows = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
  res.json(ListReviewsResponse.parse(rows.map(toAdmin)));
});

router.get("/reviews/public", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.status, "approved"))
    .orderBy(desc(reviewsTable.createdAt));
  const translationsByReview = await loadTranslations(rows.map((r) => r.id));
  res.json(ListPublicReviewsResponse.parse(rows.map((r) => toPublic(r, translationsByReview.get(r.id)))));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;

  const { containsProfanity } = await import("../../lib/profanity");
  if (containsProfanity(data.title ?? "", data.text)) {
    res.status(400).json({ error: "Yorumunuz uygunsuz ifadeler içeriyor. Lütfen düzenleyip tekrar deneyin." });
    return;
  }

  const [settings] = await db.select().from(settingsTable).where(eq(settingsTable.id, 1));
  const requireApproval = settings?.requireApproval ?? true;

  const trimmedLast = data.lastName.trim();
  const author = `${data.firstName.trim()} ${trimmedLast ? trimmedLast.charAt(0).toLocaleUpperCase("tr") + "." : ""}`.trim();
  const avatar = data.firstName.trim().charAt(0).toLocaleUpperCase("tr") || "?";

  const [review] = await db
    .insert(reviewsTable)
    .values({
      brandId: data.brandId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      author,
      avatar,
      rating: data.rating,
      title: data.title ?? "",
      text: data.text,
      petType: data.petType ?? "",
      photoBase64: data.photoBase64 ?? null,
      status: requireApproval ? "pending" : "approved",
    })
    .returning();

  translateReviewInBackground(review.id, review.text);

  res.status(201).json(CreateReviewResponse.parse(toPublic(review)));
});

router.post("/reviews/bulk", async (req, res): Promise<void> => {
  const parsed = BulkReviewActionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { ids, action } = parsed.data;
  if (ids.length === 0) {
    res.json(BulkReviewActionResponse.parse({ updated: 0 }));
    return;
  }
  if (!["approve", "reject", "delete"].includes(action)) {
    res.status(400).json({ error: "Invalid action" });
    return;
  }

  let updated = 0;
  if (action === "delete") {
    await db.delete(reviewTranslationsTable).where(inArray(reviewTranslationsTable.reviewId, ids));
    const rows = await db.delete(reviewsTable).where(inArray(reviewsTable.id, ids)).returning({ id: reviewsTable.id });
    updated = rows.length;
  } else {
    const status = action === "approve" ? "approved" : "rejected";
    const rows = await db
      .update(reviewsTable)
      .set({ status })
      .where(inArray(reviewsTable.id, ids))
      .returning({ id: reviewsTable.id });
    updated = rows.length;
  }
  res.json(BulkReviewActionResponse.parse({ updated }));
});

router.patch("/reviews/:id/status", async (req, res): Promise<void> => {
  const params = UpdateReviewStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateReviewStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (!["approved", "pending", "rejected"].includes(parsed.data.status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const [review] = await db
    .update(reviewsTable)
    .set({ status: parsed.data.status })
    .where(eq(reviewsTable.id, params.data.id))
    .returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(UpdateReviewStatusResponse.parse(toAdmin(review)));
});

router.post("/reviews/:id/vote", async (req, res): Promise<void> => {
  const params = VoteReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = VoteReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { previous, next } = parsed.data;

  const [current] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, params.data.id));
  if (!current) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  let helpful = current.helpfulCount;
  let unhelpful = current.unhelpfulCount;
  if (previous === "helpful") helpful -= 1;
  if (previous === "unhelpful") unhelpful -= 1;
  if (next === "helpful") helpful += 1;
  if (next === "unhelpful") unhelpful += 1;
  helpful = Math.max(0, helpful);
  unhelpful = Math.max(0, unhelpful);

  const [review] = await db
    .update(reviewsTable)
    .set({ helpfulCount: helpful, unhelpfulCount: unhelpful })
    .where(eq(reviewsTable.id, params.data.id))
    .returning();

  res.json(VoteReviewResponse.parse(toPublic(review)));
});

router.post("/reviews/:id/report", async (req, res): Promise<void> => {
  const params = ReportReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [current] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, params.data.id));
  if (!current) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  const [review] = await db
    .update(reviewsTable)
    .set({ reportCount: current.reportCount + 1 })
    .where(eq(reviewsTable.id, params.data.id))
    .returning();
  res.json(ReportReviewResponse.parse(toPublic(review)));
});

router.delete("/reviews/:id", async (req, res): Promise<void> => {
  const params = DeleteReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(reviewTranslationsTable).where(eq(reviewTranslationsTable.reviewId, params.data.id));
  const [review] = await db.delete(reviewsTable).where(eq(reviewsTable.id, params.data.id)).returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
