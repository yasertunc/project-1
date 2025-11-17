import { Router } from "express";
import { pushController } from "../controllers/pushController";
import { validateRequest, pushRegisterSchema, pushUnregisterSchema } from "../middleware/validator";

const router = Router();

router.post("/register", validateRequest(pushRegisterSchema), pushController.register.bind(pushController));
router.post("/unregister", validateRequest(pushUnregisterSchema), pushController.unregister.bind(pushController));

export default router;

