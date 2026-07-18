import { eq, and, inArray } from "drizzle-orm";
import { db, reviewsTable, reviewTranslationsTable } from "@workspace/db";
import { batchProcess } from "@workspace/integrations-openai-ai-server/batch";
import { logger } from "./logger";

export const TRANSLATION_LANGS = ["en", "ar", "fr", "es"] as const;
export type TranslationLang = (typeof TRANSLATION_LANGS)[number];

const LANG_NAMES: Record<TranslationLang, string> = {
  en: "English",
  ar: "Arabic",
  fr: "French",
  es: "Spanish",
};

async function requestTranslations(text: string): Promise<Record<TranslationLang, string>> {
  // Lazy import: the client module throws at import time if AI env vars are
  // missing — that must fail the translation, never server startup.
  const { openai } = await import("@workspace/integrations-openai-ai-server");
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You translate Turkish pet-food customer reviews. Translate the given Turkish text into English, Arabic, French and Spanish. " +
          "IMPORTANT: Do NOT translate brand names or product names (e.g. ProChoice, Pro Choice, Pro 33, Proderma, Royal Canin, Acana, Hill's, N&D, Gimcat and similar) — keep them exactly as written. " +
          "Preserve the tone and meaning of the review. " +
          'Respond ONLY with a JSON object of the form {"en": "...", "ar": "...", "fr": "...", "es": "..."}.',
      },
      { role: "user", content: text },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const out = {} as Record<TranslationLang, string>;
  for (const lang of TRANSLATION_LANGS) {
    const value = parsed[lang];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`Missing ${LANG_NAMES[lang]} translation in model response`);
    }
    out[lang] = value.trim();
  }
  return out;
}

export async function translateReview(reviewId: number, text: string): Promise<boolean> {
  try {
    const source = text.trim();
    if (!source) {
      await db
        .update(reviewsTable)
        .set({ translationStatus: "done" })
        .where(eq(reviewsTable.id, reviewId));
      return true;
    }
    const translations = await requestTranslations(source);
    await db.delete(reviewTranslationsTable).where(eq(reviewTranslationsTable.reviewId, reviewId));
    await db
      .insert(reviewTranslationsTable)
      .values(TRANSLATION_LANGS.map((lang) => ({ reviewId, lang, text: translations[lang] })));
    await db
      .update(reviewsTable)
      .set({ translationStatus: "done" })
      .where(eq(reviewsTable.id, reviewId));
    return true;
  } catch (err) {
    logger.error({ err, reviewId }, "review translation failed");
    await db
      .update(reviewsTable)
      .set({ translationStatus: "failed" })
      .where(eq(reviewsTable.id, reviewId))
      .catch(() => undefined);
    return false;
  }
}

export function translateReviewInBackground(reviewId: number, text: string): void {
  void translateReview(reviewId, text);
}

let queueRunning = false;

export async function processTranslationQueue(): Promise<{ processed: number; failed: number }> {
  if (queueRunning) return { processed: 0, failed: 0 };
  queueRunning = true;
  try {
    const pending = await db
      .select({ id: reviewsTable.id, text: reviewsTable.text })
      .from(reviewsTable)
      .where(inArray(reviewsTable.translationStatus, ["pending", "failed"]));
    if (pending.length === 0) return { processed: 0, failed: 0 };

    logger.info({ count: pending.length }, "processing translation queue");
    const outcomes = await batchProcess(
      pending,
      (r) => translateReview(r.id, r.text),
      { concurrency: 3, retries: 2 },
    );
    const processed = outcomes.filter(Boolean).length;
    const failed = outcomes.length - processed;
    logger.info({ processed, failed }, "translation queue done");
    return { processed, failed };
  } finally {
    queueRunning = false;
  }
}

export function startTranslationQueue(): void {
  void processTranslationQueue();
  setInterval(() => void processTranslationQueue(), 5 * 60 * 1000);
}
