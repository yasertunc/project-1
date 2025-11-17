import { Router } from "express";
import { channelController } from "../controllers/channelController";
import { messageRateLimiter } from "../middleware/rateLimiter";
import { validateRequest, messageRequestSchema } from "../middleware/validator";

const router = Router();

router.post("/:channelId/open", channelController.open.bind(channelController));
router.post("/:channelId/messages", messageRateLimiter, validateRequest(messageRequestSchema), channelController.sendMessage.bind(channelController));
router.get("/:channelId/messages", channelController.getMessages.bind(channelController));
router.post("/:channelId/close", channelController.close.bind(channelController));

export default router;

