import { query } from "./pool.js";

export async function runMigrations() {
  await query(`
    CREATE TABLE IF NOT EXISTS interviews (
      id UUID PRIMARY KEY,
      user_id VARCHAR(255) DEFAULT '',
      role VARCHAR(255) NOT NULL,
      company VARCHAR(255) DEFAULT '',
      experience_level VARCHAR(50) NOT NULL DEFAULT 'Mid-level',
      difficulty VARCHAR(50) NOT NULL DEFAULT 'Medium',
      interview_type VARCHAR(50) NOT NULL DEFAULT 'Mixed',
      duration_minutes INTEGER NOT NULL,
      num_questions INTEGER NOT NULL,
      resume_text TEXT NOT NULL,
      resume_file_name VARCHAR(255),
      job_description TEXT NOT NULL,
      questions JSONB NOT NULL DEFAULT '[]'::jsonb,
      answers JSONB NOT NULL DEFAULT '[]'::jsonb,
      current_question_index INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'ready',
      score NUMERIC,
      feedback TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ
    )
  `);

  // Migration for existing tables
  await query(`
    ALTER TABLE interviews 
    ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT ''
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews (status)
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews (user_id)
  `);
}
