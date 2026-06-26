import { Router } from "express";
import {
  completeInterview,
  createInterview,
  getInterview,
  listInterviews,
  saveAnswer,
  startInterview,
  uploadResume,
} from "../controllers/interview.controller.js";

const router = Router();

router.get("/", listInterviews);
router.post("/", uploadResume, createInterview);
router.get("/:interviewId", getInterview);
router.post("/:interviewId/start", startInterview);
router.post("/:interviewId/answer", saveAnswer);
router.post("/:interviewId/complete", completeInterview);

export default router;
