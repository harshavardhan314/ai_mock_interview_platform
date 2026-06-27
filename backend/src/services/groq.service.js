import { env } from "../config/env.js";

const interviewSystemPrompt = `You are InterviewAI, a realistic mock interviewer.
Your job is to continue a voice interview based on the current question, role, resume, and job description context.
Keep responses brief because they will be spoken aloud.
Rules:
- Acknowledge the candidate's answer in one sentence.
- If a next question is provided, ask that exact next question after your acknowledgment.
- If no next question is provided, ask one relevant follow-up based on resume and job description.
- Do not give final feedback during the live interview.
- Keep the response under 55 words.
- Sound professional, calm, and human.`;

export async function generateInterviewQuestions(config) {
  ensureGroqKey();

  const prompt = `Create exactly ${config.numQuestions} mock interview questions for this candidate.

Role: ${config.role}
Company: ${config.company || "Not specified"}
Experience level: ${config.experienceLevel}
Difficulty: ${config.difficulty}
Interview duration: ${config.durationMinutes} minutes
Interview type: ${config.interviewType}

Resume:
${trimContext(config.resumeText, 2000)}

Job description:
${trimContext(config.jobDescription, 2000)}

Return ONLY valid JSON in this shape:
{
  "questions": [
    {
      "category": "Technical|Behavioral|Role Fit",
      "prompt": "question text",
      "expectedTopics": ["topic1", "topic2"]
    }
  ]
}

Rules:
- Questions must reference the candidate resume and job description where relevant.
- Mix behavioral, technical, and role-fit questions appropriately for the role.
- Increase difficulty slightly across the sequence.
- Do not repeat the same question angle twice.`;

  const response = await fetch(`${env.groqBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.chatModel,
      messages: [
        {
          role: "system",
          content: "You generate structured interview questions. Respond with JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
      max_completion_tokens: 1200,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw await createGroqError(response, "Groq question generation failed.");
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || "{}";
  const parsed = JSON.parse(raw);
  const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

  if (!questions.length) {
    const error = new Error("Could not generate interview questions. Please try again.");
    error.statusCode = 502;
    throw error;
  }

  return questions.slice(0, config.numQuestions).map((question, index) => ({
    id: String(index + 1),
    category: question.category || "General",
    prompt: question.prompt,
    expectedTopics: Array.isArray(question.expectedTopics) ? question.expectedTopics : [],
  }));
}

export async function transcribeAudio({ audioBase64, mimeType }) {
  ensureGroqKey();

  const audioBuffer = Buffer.from(audioBase64, "base64");
  const extension = getAudioExtension(mimeType);
  const file = new File([audioBuffer], `candidate-answer.${extension}`, {
    type: mimeType || "audio/webm",
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", env.whisperModel);
  formData.append("response_format", "json");
  formData.append("temperature", "0");
  formData.append("language", "en");
  formData.append(
    "prompt",
    "This is a mock job interview answer. Preserve technical terms, company names, programming languages, and project names."
  );

  const response = await fetch(`${env.groqBaseUrl}/audio/transcriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.groqApiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw await createGroqError(response, "Groq transcription failed.");
  }

  const data = await response.json();
  return data.text?.trim() || "";
}

export async function generateInterviewReply({ transcript, interviewContext }) {
  ensureGroqKey();

  const messages = [
    {
      role: "system",
      content: interviewSystemPrompt,
    },
    {
      role: "user",
      content: buildInterviewPrompt(transcript, interviewContext),
    },
  ];

  const response = await fetch(`${env.groqBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.chatModel,
      messages,
      temperature: 0.45,
      max_completion_tokens: 120,
    }),
  });

  if (!response.ok) {
    throw await createGroqError(response, "Groq chat completion failed.");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Thank you. Please continue with a little more detail.";
}

export async function generateInterviewFeedback(interview) {
  ensureGroqKey();

  const qa = (interview.answers || [])
    .map((entry, index) => {
      return `Question ${index + 1} (${entry.category}):
${entry.question}

Answer:
${entry.answer}`;
    })
    .join("\n\n");

  const prompt = `You are an experienced Senior Software Engineering interviewer.

Evaluate the candidate based on:

Role: ${interview.role}
Company: ${interview.company || "Not specified"}
Experience Level: ${interview.experienceLevel}
Difficulty: ${interview.difficulty}
Interview Type: ${interview.interviewType}

Resume:
${trimContext(interview.resumeText, 2000)}

Job Description:
${trimContext(interview.jobDescription, 2000)}

Interview Transcript:
${qa || "No answers recorded."}

Scoring criteria: Technical Knowledge, Communication Skills, Problem Solving, Confidence, Relevance to Job Description, Overall Performance.

All scores (overallScore, technicalScore, communicationScore, problemSolvingScore, confidenceScore, relevanceScore, and questionFeedback[].rating) MUST be on a scale of 0 to 10 (inclusive) with up to one decimal place (e.g., 8.5, 9.0, 7.2).

Return ONLY valid JSON:
{
  "overallScore": 8.5,
  "technicalScore": 9.0,
  "communicationScore": 8.0,
  "problemSolvingScore": 7.5,
  "confidenceScore": 8.0,
  "relevanceScore": 9.0,
  "strengths": [""],
  "improvements": [""],
  "questionFeedback": [
    { "question": "", "rating": 8.5, "feedback": "" }
  ],
  "summary": ""
}`;

  const response = await fetch(`${env.groqBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_completion_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw await createGroqError(response, "Groq feedback generation failed.");
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || "{}";
  const feedback = JSON.parse(raw);

  const normalizeScore = (val) => {
    if (val == null) return null;
    let num = Number(val);
    if (isNaN(num)) return null;
    if (num > 10) {
      return Number((num / 10).toFixed(1));
    }
    return Number(num.toFixed(1));
  };

  if (feedback) {
    if (feedback.overallScore != null) feedback.overallScore = normalizeScore(feedback.overallScore);
    if (feedback.technicalScore != null) feedback.technicalScore = normalizeScore(feedback.technicalScore);
    if (feedback.communicationScore != null) feedback.communicationScore = normalizeScore(feedback.communicationScore);
    if (feedback.problemSolvingScore != null) feedback.problemSolvingScore = normalizeScore(feedback.problemSolvingScore);
    if (feedback.confidenceScore != null) feedback.confidenceScore = normalizeScore(feedback.confidenceScore);
    if (feedback.relevanceScore != null) feedback.relevanceScore = normalizeScore(feedback.relevanceScore);

    if (Array.isArray(feedback.questionFeedback)) {
      feedback.questionFeedback.forEach((q) => {
        if (q.rating != null) {
          q.rating = normalizeScore(q.rating);
        }
      });
    }
  }

  return feedback;
}

function buildInterviewPrompt(transcript, context = {}) {
  const previousAnswers = Array.isArray(context.previousAnswers)
    ? context.previousAnswers
        .slice(-3)
        .map((answer, index) => `Previous answer ${index + 1}: ${answer.answer}`)
        .join("\n")
    : "None";

  return `Role: ${context.role || "Not specified"}
Company: ${context.company || "Not specified"}
Difficulty: ${context.difficulty || "Medium"}
Experience level: ${context.experienceLevel || "Mid-level"}
Current question: ${context.currentQuestion || "Ask a relevant interview question."}
Next question to ask if appropriate: ${context.nextQuestion || "None"}
Expected topics: ${(context.expectedTopics || []).join(", ") || "Not specified"}
Resume context: ${trimContext(context.resumeText)}
Job description context: ${trimContext(context.jobDescription)}
Question progress: ${context.questionNumber || "?"} of ${context.totalQuestions || "?"}
Recent previous answers:
${previousAnswers}

Candidate answer transcript:
${transcript}

Respond as the interviewer.`;
}

function trimContext(value = "", maxLength = 1200) {
  const normalized = String(value).replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized || "Not provided";
}

function getAudioExtension(mimeType = "") {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("mpeg")) return "mp3";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
}

function ensureGroqKey() {
  if (!env.groqApiKey) {
    const error = new Error(
      "Missing GROQ_API_KEY. Add it to backend/.env before using the voice agent."
    );
    error.statusCode = 500;
    throw error;
  }
}

async function createGroqError(response, fallbackMessage) {
  const body = await response.text();
  const error = new Error(`${fallbackMessage} ${body}`);
  error.statusCode = response.status;
  return error;
}
