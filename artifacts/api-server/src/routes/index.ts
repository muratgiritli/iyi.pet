import { Router, type IRouter } from "express";
import healthRouter from "./health";
import brandsRouter from "./brands";
import reviewsRouter from "./reviews";
import settingsRouter from "./settings";
import adminRouter from "./admin";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(brandsRouter);
router.use(reviewsRouter);
router.use(settingsRouter);
router.use(adminRouter);
router.use(statsRouter);

export default router;
