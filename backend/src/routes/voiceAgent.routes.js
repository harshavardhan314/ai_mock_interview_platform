import { Router } from "express";
import { respondToVoiceAgent } from "../controllers/voiceAgent.controller.js";

import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post("/respond", respondToVoiceAgent);

export default router;
