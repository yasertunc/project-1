import { Router } from "express";
import { matchController } from "../controllers/matchController";
import { matchingEngine } from "../services/matchingEngine";
import { enqueueRateLimiter } from "../middleware/rateLimiter";
import {
  validateRequest,
  matchRequestSchema,
  cancelRequestSchema,
} from "../middleware/validator";

const router = Router();

router.post(
  "/enqueue",
  enqueueRateLimiter,
  validateRequest(matchRequestSchema),
  matchController.enqueue.bind(matchController)
);
router.post(
  "/cancel",
  validateRequest(cancelRequestSchema),
  matchController.cancel.bind(matchController)
);
router.get("/:matchId/status", matchController.getStatus.bind(matchController));
router.post("/offer", matchController.sendOffer.bind(matchController));
router.post(
  "/offer/:offerId/accept",
  matchController.acceptOffer.bind(matchController)
);
router.post(
  "/offer/:offerId/decline",
  matchController.declineOffer.bind(matchController)
);

// Matching tick endpoint (for scheduler/cron)
router.post("/tick", async (req, res, next) => {
  try {
    const result = await matchingEngine.processTick();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
