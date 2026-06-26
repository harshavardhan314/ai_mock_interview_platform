import { query } from "../db/pool.js";

function parseJsonField(value) {
  if (value == null) return value;

  let parsed = value;
  for (let i = 0; i < 2; i += 1) {
    if (typeof parsed !== "string") break;
    try {
      parsed = JSON.parse(parsed);
    } catch {
      break;
    }
  }

  return parsed;
}

function mapRowToInterview(row) {
  return {
    id: row.id,
    role: row.role,
    company: row.company,
    experienceLevel: row.experience_level,
    difficulty: row.difficulty,
    interviewType: row.interview_type,
    durationMinutes: row.duration_minutes,
    numQuestions: row.num_questions,
    resumeText: row.resume_text,
    resumeFileName: row.resume_file_name,
    jobDescription: row.job_description,
    questions: parseJsonField(row.questions),
    answers: parseJsonField(row.answers),
    currentQuestionIndex: row.current_question_index,
    status: row.status,
    score: row.score,
    feedback: parseJsonField(row.feedback),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    startedAt: row.started_at ? row.started_at.toISOString() : null,
    completedAt: row.completed_at ? row.completed_at.toISOString() : null,
  };
}

function toJsonb(value) {
  if (value == null) return null;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export async function saveInterview(interview) {
  const result = await query(
    `
      INSERT INTO interviews (
        id, role, company, experience_level, difficulty, interview_type,
        duration_minutes, num_questions, resume_text, resume_file_name,
        job_description, questions, answers, current_question_index,
        status, score, feedback, created_at, updated_at, started_at, completed_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12::jsonb, $13::jsonb, $14,
        $15, $16, $17, $18, $19, $20, $21
      )
      RETURNING *
    `,
    [
      interview.id,
      interview.role,
      interview.company,
      interview.experienceLevel,
      interview.difficulty,
      interview.interviewType,
      interview.durationMinutes,
      interview.numQuestions,
      interview.resumeText,
      interview.resumeFileName ?? null,
      interview.jobDescription,
      JSON.stringify(interview.questions),
      JSON.stringify(interview.answers),
      interview.currentQuestionIndex,
      interview.status,
      interview.score,
      toJsonb(interview.feedback),
      interview.createdAt,
      interview.updatedAt,
      interview.startedAt,
      interview.completedAt,
    ]
  );

  return mapRowToInterview(result.rows[0]);
}

export async function getInterview(interviewId) {
  const result = await query(`SELECT * FROM interviews WHERE id = $1`, [interviewId]);
  return result.rows[0] ? mapRowToInterview(result.rows[0]) : null;
}

export async function listInterviews() {
  const result = await query(`SELECT * FROM interviews ORDER BY created_at DESC`);
  return result.rows.map(mapRowToInterview);
}

export async function updateInterview(interviewId, updates) {
  const existing = await getInterview(interviewId);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const result = await query(
    `
      UPDATE interviews SET
        answers = $2::jsonb,
        current_question_index = $3,
        status = $4,
        completed_at = $5,
        started_at = $6,
        feedback = $7::jsonb,
        score = $8,
        updated_at = $9
      WHERE id = $1
      RETURNING *
    `,
    [
      interviewId,
      JSON.stringify(updated.answers),
      updated.currentQuestionIndex,
      updated.status,
      updated.completedAt,
      updated.startedAt,
      toJsonb(updated.feedback ?? existing.feedback),
      updated.score ?? existing.score,
      updated.updatedAt,
    ]
  );

  return mapRowToInterview(result.rows[0]);
}
