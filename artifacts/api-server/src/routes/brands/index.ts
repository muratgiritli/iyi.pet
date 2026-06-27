import { Router, type IRouter } from "express";
import { eq, desc, asc } from "drizzle-orm";
import { db, brandsTable } from "@workspace/db";
import {
  CreateBrandBody,
  CreateBrandResponse,
  UpdateBrandBody,
  UpdateBrandParams,
  UpdateBrandResponse,
  DeleteBrandParams,
  ListBrandsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/brands", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(brandsTable)
    .orderBy(desc(brandsTable.pinned), asc(brandsTable.pinnedRank), desc(brandsTable.rating));
  res.json(ListBrandsResponse.parse(rows));
});

router.post("/brands", async (req, res): Promise<void> => {
  const parsed = CreateBrandBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [brand] = await db.insert(brandsTable).values(parsed.data).returning();
  res.status(201).json(CreateBrandResponse.parse(brand));
});

router.patch("/brands/:id", async (req, res): Promise<void> => {
  const params = UpdateBrandParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBrandBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [brand] = await db
    .update(brandsTable)
    .set(parsed.data)
    .where(eq(brandsTable.id, params.data.id))
    .returning();
  if (!brand) {
    res.status(404).json({ error: "Brand not found" });
    return;
  }
  res.json(UpdateBrandResponse.parse(brand));
});

router.delete("/brands/:id", async (req, res): Promise<void> => {
  const params = DeleteBrandParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [brand] = await db
    .delete(brandsTable)
    .where(eq(brandsTable.id, params.data.id))
    .returning();
  if (!brand) {
    res.status(404).json({ error: "Brand not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
