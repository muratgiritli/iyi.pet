import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import {
  GetSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function ensureSettings() {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.id, 1));
  if (row) return row;
  const [created] = await db.insert(settingsTable).values({ id: 1 }).returning();
  return created;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const row = await ensureSettings();
  res.json(GetSettingsResponse.parse({ requireApproval: row.requireApproval }));
});

router.patch("/settings", async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existing = await ensureSettings();
  if (parsed.data.requireApproval === undefined) {
    res.json(UpdateSettingsResponse.parse({ requireApproval: existing.requireApproval }));
    return;
  }
  const [row] = await db
    .update(settingsTable)
    .set({ requireApproval: parsed.data.requireApproval })
    .where(eq(settingsTable.id, 1))
    .returning();
  res.json(UpdateSettingsResponse.parse({ requireApproval: row.requireApproval }));
});

export default router;
