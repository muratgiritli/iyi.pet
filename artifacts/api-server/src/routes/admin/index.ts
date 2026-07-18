import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  ChangeAdminPasswordBody,
  ChangeAdminPasswordResponse,
  GenerateReviewsBody,
  GenerateReviewsResponse,
} from "@workspace/api-zod";
import { generateReviews, saveGeneratedReviews } from "../../lib/reviewGenerator";

const router: IRouter = Router();

const adminTokens = new Set<string>();

function isAuthorized(header: string | undefined): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  return adminTokens.has(header.slice("Bearer ".length));
}

async function getPassword(): Promise<string> {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.id, 1));
  return row?.adminPassword ?? "admin123";
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const password = await getPassword();
  const success = parsed.data.username === "admin" && parsed.data.password === password;
  let token: string | null = null;
  if (success) {
    token = crypto.randomUUID();
    adminTokens.add(token);
  }
  res.json(AdminLoginResponse.parse({ success, token, error: success ? null : "Kullanıcı adı veya şifre hatalı." }));
});

router.post("/admin/password", async (req, res): Promise<void> => {
  const parsed = ChangeAdminPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const current = await getPassword();
  if (parsed.data.currentPassword !== current) {
    res.json(ChangeAdminPasswordResponse.parse({ success: false, error: "Mevcut şifre hatalı." }));
    return;
  }
  await db.update(settingsTable).set({ adminPassword: parsed.data.newPassword }).where(eq(settingsTable.id, 1));
  res.json(ChangeAdminPasswordResponse.parse({ success: true, error: null }));
});

router.post("/admin/review-generator", async (req, res): Promise<void> => {
  if (!isAuthorized(req.headers.authorization)) {
    res.status(401).json({ error: "Yetkisiz erişim. Lütfen tekrar giriş yapın." });
    return;
  }
  const parsed = GenerateReviewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  if (data.goodPercent + data.midPercent + data.badPercent !== 100) {
    res.status(400).json({ error: "Yıldız dağılımı toplamı %100 olmalı." });
    return;
  }
  try {
    const { brand, reviews } = await generateReviews({
      brandId: data.brandId,
      petType: data.petType,
      count: data.count,
      goodPercent: data.goodPercent,
      midPercent: data.midPercent,
      badPercent: data.badPercent,
      length: data.length,
    });
    const saved = data.save ? await saveGeneratedReviews(brand, reviews) : 0;
    res.json(GenerateReviewsResponse.parse({ reviews, saved }));
  } catch (err) {
    req.log.error({ err }, "review generation failed");
    res.status(400).json({ error: "Yorum üretimi başarısız oldu. Lütfen tekrar deneyin." });
  }
});

export default router;
