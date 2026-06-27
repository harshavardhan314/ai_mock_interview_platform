import multer from "multer";
import {
  completeInterviewSession,
  createInterviewSession,
  getInterviewSession,
  listInterviewSessions,
  saveInterviewAnswer,
  startInterviewSession,
} from "../services/interview.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadResume = upload.single("resume");

export async function listInterviews(req, res, next) {
  try {
    const interviews = await listInterviewSessions(req.userId);
    res.json({ interviews });
  } catch (error) {
    next(error);
  }
}

export async function createInterview(req, res, next) {
  try {
    const payload = {
      resumeFile: req.file,
      role: req.body.role,
      company: req.body.company,
      experienceLevel: req.body.experienceLevel,
      difficulty: req.body.difficulty,
      interviewType: req.body.interviewType,
      durationMinutes: Number(req.body.durationMinutes),
      jobDescription: req.body.jobDescription,
    };

    const interview = await createInterviewSession(payload, req.userId);
    res.status(201).json({ interview });
  } catch (error) {
    next(error);
  }
}

export async function getInterview(req, res, next) {
  try {
    const interview = await getInterviewSession(req.params.interviewId, req.userId);
    res.json({ interview });
  } catch (error) {
    next(error);
  }
}

export async function startInterview(req, res, next) {
  try {
    const result = await startInterviewSession(req.params.interviewId, req.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function saveAnswer(req, res, next) {
  try {
    const result = await saveInterviewAnswer(req.params.interviewId, req.body, req.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function completeInterview(req, res, next) {
  try {
    const result = await completeInterviewSession(req.params.interviewId, req.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
