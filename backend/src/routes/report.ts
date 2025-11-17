import { Router } from "express";
import { reportController } from "../controllers/reportController";
import { reportRateLimiter } from "../middleware/rateLimiter";
import { validateRequest, reportRequestSchema } from "../middleware/validator";

const router = Router();

router.post("/", reportRateLimiter, validateRequest(reportRequestSchema), reportController.createReport.bind(reportController));

export default router;

