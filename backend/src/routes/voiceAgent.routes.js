import { Router } from "express";
import { respondToVoiceAgent } from "../controllers/voiceAgent.controller.js";

const router = Router();

router.post("/respond", respondToVoiceAgent);

export default router;
