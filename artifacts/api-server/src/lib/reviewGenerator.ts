import { eq } from "drizzle-orm";
import { db, brandsTable, reviewsTable, type Brand } from "@workspace/db";
import { batchProcess } from "@workspace/integrations-openai-ai-server/batch";
import { recomputeBrandAggregates } from "./seedProchoice";
import { processTranslationQueue } from "./translateReview";
import { logger } from "./logger";

const FIRST_NAMES = [
  "Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Hasan", "İbrahim", "Osman", "Yusuf", "Murat",
  "Ömer", "Emre", "Burak", "Serkan", "Tolga", "Volkan", "Onur", "Kaan", "Cem", "Barış",
  "Erhan", "Fatih", "Levent", "Orhan", "Sinan", "Tuncay", "Uğur", "Yasin", "Cihan", "Ferhat",
  "Halil", "Kerem", "Metin", "Okan", "Recep", "Tarık", "Umut", "Alper", "Arda", "Berk",
  "Can", "Deniz", "Engin", "Eren", "Hakan", "Koray", "Mert", "Oğuz", "Rıza", "Cemal",
  "Ayşe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif", "Meryem", "Merve", "Esra", "Selin",
  "Buse", "Ceren", "Derya", "Ece", "Gizem", "Melis", "Pınar", "Seda", "Tuğba", "Yasemin",
  "Aslı", "Betül", "Burcu", "Cansu", "Damla", "Dilek", "Fulya", "Gamze", "Gonca", "Gül",
  "Hande", "Işıl", "İrem", "Jale", "Kübra", "Lale", "Naz", "Nihan", "Nur", "Pelin",
  "Sevgi", "Simge", "Şule", "Vildan", "Zehra", "Hilal", "Nazlı", "Özge", "Sibel", "Tülay",
];

const SURNAME_INITIALS = ["A", "B", "C", "Ç", "D", "E", "F", "G", "H", "I", "İ", "K", "L", "M", "N", "O", "Ö", "P", "R", "S", "Ş", "T", "U", "Ü", "V", "Y", "Z"];

export type GenLength = "short" | "medium" | "long" | "mixed";

export interface GenerateParams {
  brandId: number;
  petType: "Kedi" | "Köpek";
  count: number;
  goodPercent: number;
  midPercent: number;
  badPercent: number;
  length: GenLength;
}

export interface GeneratedReview {
  brandSlug: string;
  firstName: string;
  lastNameInitial: string;
  displayName: string;
  rating: number;
  petType: string;
  product: string;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  notHelpfulCount: number;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildLengths(length: GenLength, count: number): ("short" | "medium" | "long")[] {
  if (length !== "mixed") return Array.from({ length: count }, () => length);
  const long = Math.floor(count * 0.25);
  const short = Math.floor(count * 0.25);
  const medium = count - long - short;
  return shuffle([
    ...Array.from({ length: long }, (): "long" => "long"),
    ...Array.from({ length: medium }, (): "medium" => "medium"),
    ...Array.from({ length: short }, (): "short" => "short"),
  ]);
}

const LENGTH_SPECS: Record<"short" | "medium" | "long", string> = {
  short: "1-2 cümle (yaklaşık 50-120 karakter)",
  medium: "3-4 cümle (yaklaşık 120-250 karakter)",
  long: "5-7 cümle (yaklaşık 250-500 karakter)",
};

type Group = "good" | "mid" | "bad";

function groupTone(group: Group): string {
  if (group === "good") return "olumlu ama abartısız, gerçekçi memnuniyet";
  if (group === "mid") return "kararsız, 'ne iyi ne kötü' tonunda, orta puan";
  return "somut bir şikayet içeren olumsuz deneyim";
}

export function splitCounts(count: number, goodPercent: number, midPercent: number): { good: number; mid: number; bad: number } {
  const good = Math.floor((count * goodPercent) / 100);
  const mid = Math.floor((count * midPercent) / 100);
  const bad = count - good - mid;
  return { good, mid, bad };
}

interface CommentSpec {
  group: Group;
  length: "short" | "medium" | "long";
}

async function generateCommentBatch(
  brand: Brand,
  petType: string,
  specs: CommentSpec[],
): Promise<{ product: string; comment: string }[]> {
  const { openai } = await import("@workspace/integrations-openai-ai-server");
  const lines = specs
    .map((s, i) => `${i + 1}. Ton: ${groupTone(s.group)}. Uzunluk: ${LENGTH_SPECS[s.length]}.`)
    .join("\n");
  const animal = petType === "Kedi" ? "kedi" : "köpek";
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 16000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          `Türkiye'deki bir evcil hayvan maması yorum sitesi için gerçekçi Türkçe kullanıcı yorumları yazıyorsun. ` +
          `Marka: "${brand.name}" (${animal} maması). ` +
          `Her yorum için markaya uygun gerçekçi bir ürün adı da üret (ör. tavuklu yetişkin, somonlu kısırlaştırılmış, yavru formülü, kg bilgisi olabilir; ürün adında marka adı geçebilir). ` +
          `Temaları çeşitlendir: lezzet/yememe, sindirim (ishal, kusma), tüy dökülmesi, kilo, koku, fiyat/performans, ambalaj/kargo, veteriner tavsiyesi, alerji/kaşıntı, yavru/kısır/yaşlı formül. ` +
          `Yorumlar günlük konuşma dilinde, doğal ve birbirinden belirgin şekilde farklı olsun; kalıp cümleleri tekrarlama. Marka ve ürün adlarını olduğu gibi yaz. ` +
          `SADECE şu JSON formatında yanıt ver: {"reviews": [{"product": "...", "comment": "..."}, ...]} — tam olarak ${specs.length} adet.`,
      },
      { role: "user", content: `Aşağıdaki ${specs.length} yorum için metin üret:\n${lines}` },
    ],
  });
  const raw = response.choices[0]?.message?.content ?? "";
  const parsed = JSON.parse(raw) as { reviews?: { product?: unknown; comment?: unknown }[] };
  const items = Array.isArray(parsed.reviews) ? parsed.reviews : [];
  const cleaned = items
    .filter((x) => typeof x.product === "string" && typeof x.comment === "string" && (x.comment as string).trim() !== "")
    .map((x) => ({ product: (x.product as string).trim(), comment: (x.comment as string).trim() }));
  if (cleaned.length < specs.length) {
    throw new Error(`Model returned ${cleaned.length}/${specs.length} comments`);
  }
  return cleaned.slice(0, specs.length);
}

const BATCH_SIZE = 20;

export async function generateReviews(params: GenerateParams): Promise<{ brand: Brand; reviews: GeneratedReview[] }> {
  const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.id, params.brandId));
  if (!brand) throw new Error("Brand not found");

  const counts = splitCounts(params.count, params.goodPercent, params.midPercent);
  const groups: Group[] = [
    ...Array.from({ length: counts.good }, (): Group => "good"),
    ...Array.from({ length: counts.mid }, (): Group => "mid"),
    ...Array.from({ length: counts.bad }, (): Group => "bad"),
  ];
  const lengths = buildLengths(params.length, groups.length);
  let specs: CommentSpec[] = groups.map((group, i) => ({ group, length: lengths[i] }));

  const flatSpecs: CommentSpec[] = [];
  const flatComments: { product: string; comment: string }[] = [];
  const seen = new Set<string>();
  const normalize = (s: string) => s.toLocaleLowerCase("tr").replace(/\s+/g, " ").trim();

  for (let attempt = 0; attempt < 3 && specs.length > 0; attempt++) {
    const batches: CommentSpec[][] = [];
    for (let i = 0; i < specs.length; i += BATCH_SIZE) {
      batches.push(specs.slice(i, i + BATCH_SIZE));
    }
    const batchResults = await batchProcess(
      batches,
      (batch) => generateCommentBatch(brand, params.petType, batch),
      { concurrency: 3, retries: 3, minTimeout: 1500, maxTimeout: 20000 },
    );
    const attemptSpecs = batches.flat();
    const attemptComments = batchResults.flat();
    const leftover: CommentSpec[] = [];
    attemptComments.forEach((c, i) => {
      const key = normalize(c.comment);
      if (seen.has(key)) {
        leftover.push(attemptSpecs[i]);
      } else {
        seen.add(key);
        flatSpecs.push(attemptSpecs[i]);
        flatComments.push(c);
      }
    });
    specs = leftover;
  }
  if (specs.length > 0) {
    throw new Error(`Could not generate ${specs.length} unique comments after retries`);
  }

  const names = shuffle(FIRST_NAMES);
  const now = Date.now();
  const reviews: GeneratedReview[] = flatComments.map((c, i) => {
    const spec = flatSpecs[i];
    const firstName = names[i % names.length];
    const lastNameInitial = pick(SURNAME_INITIALS);
    const rating =
      spec.group === "good" ? (Math.random() < 0.65 ? 4 : 5) : spec.group === "mid" ? 3 : randomInt(1, 2);
    const createdAt = new Date(now - randomInt(0, 90 * 24 * 60 * 60 * 1000));
    createdAt.setSeconds(0, 0);
    return {
      brandSlug: brand.slug,
      firstName,
      lastNameInitial,
      displayName: `${firstName} ${lastNameInitial}.`,
      rating,
      petType: params.petType,
      product: c.product,
      comment: c.comment,
      createdAt: createdAt.toISOString(),
      helpfulCount: randomInt(3, 28),
      notHelpfulCount: randomInt(0, 4),
    };
  });

  return { brand, reviews: shuffle(reviews) };
}

export async function saveGeneratedReviews(brand: Brand, reviews: GeneratedReview[]): Promise<number> {
  if (reviews.length === 0) return 0;
  await db.insert(reviewsTable).values(
    reviews.map((r) => ({
      brandId: brand.id,
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
      helpfulCount: r.helpfulCount,
      unhelpfulCount: r.notHelpfulCount,
      translationStatus: "pending",
      createdAt: new Date(r.createdAt),
    })),
  );
  await recomputeBrandAggregates(brand.id);
  void processTranslationQueue().catch((err) => logger.error({ err }, "post-generate translation queue failed"));
  return reviews.length;
}
