import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  ChangeAdminPasswordBody,
  ChangeAdminPasswordResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

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
  res.json(AdminLoginResponse.parse({ success, error: success ? null : "Kullanıcı adı veya şifre hatalı." }));
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

export default router;
