import { randomUUID } from "node:crypto";
import { generateInterviewFeedback, generateInterviewQuestions } from "./groq.service.js";
import { parseResumeFile } from "./resumeParser.service.js";
import {
  getInterview,
  listInterviews as listAllInterviews,
  saveInterview,
  updateInterview,
} from "../repositories/interview.repository.js";

const DURATION_OPTIONS = [15, 30, 45, 60];

export function deriveQuestionCount(durationMinutes) {
  return Math.max(3, Math.min(10, Math.round(durationMinutes / 5)));
}

export function validateCreatePayload(payload = {}) {
  const jobDescription = String(payload.jobDescription || "").trim();
  const role = String(payload.role || "").trim();
  const durationMinutes = Number(payload.durationMinutes);

  if (!payload.resumeFile) {
    return { valid: false, message: "Resume file is required. Upload a PDF, DOCX, or TXT file." };
  }

  if (!jobDescription) {
    return { valid: false, message: "Job description is required before starting the interview." };
  }

  if (!role) {
    return { valid: false, message: "Target role is required." };
  }

  if (!DURATION_OPTIONS.includes(durationMinutes)) {
    return {
      valid: false,
      message: `Duration must be one of: ${DURATION_OPTIONS.join(", ")} minutes.`,
    };
  }

  return {
    valid: true,
    data: {
      resumeFile: payload.resumeFile,
      jobDescription,
      role,
      company: String(payload.company || "").trim(),
      experienceLevel: String(payload.experienceLevel || "Mid-level").trim(),
      difficulty: String(payload.difficulty || "Medium").trim(),
      interviewType: String(payload.interviewType || "Mixed").trim(),
      durationMinutes,
      numQuestions: deriveQuestionCount(durationMinutes),
    },
  };
}

export async function createInterviewSession(payload) {
  const validation = validateCreatePayload(payload);
  if (!validation.valid) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  const config = validation.data;
  const { resumeText, resumeFileName } = await parseResumeFile(config.resumeFile);

  const questions = await generateInterviewQuestions({
    ...config,
    resumeText,
  });

  const now = new Date().toISOString();

  const interview = {
    id: randomUUID(),
    role: config.role,
    company: config.company,
    experienceLevel: config.experienceLevel,
    difficulty: config.difficulty,
    interviewType: config.interviewType,
    durationMinutes: config.durationMinutes,
    numQuestions: config.numQuestions,
    resumeText,
    resumeFileName,
    jobDescription: config.jobDescription,
    questions,
    answers: [],
    currentQuestionIndex: 0,
    status: "ready",
    score: null,
    feedback: null,
    createdAt: now,
    updatedAt: now,
    startedAt: null,
    completedAt: null,
  };

  return saveInterview(interview);
}

export async function getInterviewSession(interviewId) {
  const interview = await getInterview(interviewId);
  if (!interview) {
    const error = new Error("Interview session not found.");
    error.statusCode = 404;
    throw error;
  }
  return interview;
}

export async function startInterviewSession(interviewId) {
  const interview = await getInterviewSession(interviewId);

  if (interview.status === "completed") {
    const error = new Error("This interview is already completed.");
    error.statusCode = 409;
    throw error;
  }

  if (interview.status === "in_progress") {
    return {
      interview,
      currentQuestion: interview.questions[interview.currentQuestionIndex] ?? null,
    };
  }

  const started = await updateInterview(interviewId, {
    status: "in_progress",
    startedAt: interview.startedAt || new Date().toISOString(),
  });

  return {
    interview: started,
    currentQuestion: started.questions[started.currentQuestionIndex] ?? null,
  };
}

export async function saveInterviewAnswer(interviewId, answerPayload = {}) {
  const interview = await getInterviewSession(interviewId);

  if (interview.status === "completed") {
    const error = new Error("This interview is already completed.");
    error.statusCode = 409;
    throw error;
  }

  const answerText = String(answerPayload.answer || "").trim();
  if (!answerText) {
    const error = new Error("Answer text is required.");
    error.statusCode = 400;
    throw error;
  }

  const currentQuestion = interview.questions[interview.currentQuestionIndex];
  if (!currentQuestion) {
    const error = new Error("No active question found for this interview.");
    error.statusCode = 409;
    throw error;
  }

  const nextAnswers = [
    ...interview.answers,
    {
      questionId: currentQuestion.id,
      question: currentQuestion.prompt,
      category: currentQuestion.category,
      answer: answerText,
      createdAt: new Date().toISOString(),
    },
  ];

  const nextIndex = interview.currentQuestionIndex + 1;
  const isComplete = nextIndex >= interview.questions.length;

  const updated = await updateInterview(interviewId, {
    answers: nextAnswers,
    currentQuestionIndex: isComplete ? interview.currentQuestionIndex : nextIndex,
    status: isComplete ? "completed" : "in_progress",
    completedAt: isComplete ? new Date().toISOString() : null,
  });

  return {
    interview: updated,
    isComplete,
    nextQuestion: isComplete ? null : updated.questions[nextIndex],
  };
}

export async function listInterviewSessions() {
  return listAllInterviews();
}

export async function completeInterviewSession(interviewId) {
  const interview = await getInterviewSession(interviewId);

  if (interview.status !== "completed") {
    const error = new Error("Interview must be completed before generating feedback.");
    error.statusCode = 409;
    throw error;
  }

  if (interview.feedback) {
    return { interview, feedback: interview.feedback };
  }

  const feedback = await generateInterviewFeedback(interview);

  const updated = await updateInterview(interviewId, {
    feedback,
    score: feedback.overallScore ?? null,
  });

  return { interview: updated, feedback };
}
