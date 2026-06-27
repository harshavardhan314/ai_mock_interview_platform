# AI Mock Interview Platform

An end-to-end mock interview platform that turns a candidate's **resume + job description** into a tailored voice-ready interview, stores the full session in **PostgreSQL**, and generates **LLM-powered feedback** after completion.

This document explains the system the way you would in a design review or onsite interview: architecture, data flow, technology choices, and how each layer connects.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [High-Level Architecture](#high-level-architecture)
3. [Tech Stack](#tech-stack)
4. [Repository Structure](#repository-structure)
5. [End-to-End User Flow](#end-to-end-user-flow)
6. [Backend Deep Dive](#backend-deep-dive)
7. [Frontend Deep Dive](#frontend-deep-dive)
8. [AI / LLM Pipeline](#ai--llm-pipeline)
9. [Database Design](#database-design)
10. [API Reference](#api-reference)
11. [Environment Variables](#environment-variables)
12. [Local Development Setup](#local-development-setup)
13. [Design Decisions & Tradeoffs](#design-decisions--tradeoffs)
14. [Future Improvements](#future-improvements)
15. [Deploying to Render](./DEPLOYMENT.md)

---

## Problem Statement

Candidates preparing for software interviews need practice that is:

- **Personalized** to their resume and target role
- **Interactive** (voice + text, not static question banks)
- **Actionable** with structured feedback after the session

This platform solves that by combining document parsing, generative AI for question creation and evaluation, and a persistent session model backed by PostgreSQL.

---

## High-Level Architecture

The project is a **decoupled client–server** application:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                      │
│  Clerk Auth │ Create Interview │ Interview Room │ Feedback/History  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTP /api/* (Vite dev proxy)
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express)                     │
│  Routes → Controllers → Services → Repository → PostgreSQL (Neon)   │
│                              ↓                                       │
│                     Groq API (Whisper + Llama)                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Request path (layered backend)

```
HTTP Request
    → Express Router
    → Controller (HTTP I/O, status codes)
    → Service (business rules, validation, orchestration)
    → Repository (SQL / persistence)
    → PostgreSQL
```

AI calls are isolated in `groq.service.js` so API keys never reach the browser and model usage stays centralized.

---

## Tech Stack

### Frontend (`frontend/`)

| Tool | Purpose |
|------|---------|
| **React 19** | UI components and page routing |
| **Vite 8** | Dev server, HMR, production bundling |
| **React Router 7** | Client-side routing (`/dashboard`, `/interview/:id`, etc.) |
| **Tailwind CSS 4** | Utility-first styling |
| **Clerk** | Authentication (login, signup, protected routes) |
| **Lucide React** | Icons |
| **Framer Motion** | UI animations |
| **Browser MediaRecorder API** | Capture microphone audio for voice answers |
| **Web Speech API** | Text-to-speech for interviewer questions/responses |

### Backend (`backend/`)

| Tool | Purpose |
|------|---------|
| **Node.js (ES Modules)** | Runtime |
| **Express 4** | HTTP server, routing, middleware |
| **Multer** | Multipart file upload (resume PDF/DOCX/TXT) |
| **pdf-parse** | Extract text from PDF resumes |
| **mammoth** | Extract text from DOCX resumes |
| **pg** | PostgreSQL client (connection pooling) |
| **dotenv** | Environment configuration |
| **cors** | Cross-origin access for frontend |

### Infrastructure & External Services

| Tool | Purpose |
|------|---------|
| **Neon PostgreSQL** | Managed Postgres (serverless-friendly, SSL) |
| **Groq API** | LLM inference + speech-to-text |


### Groq Models Used

| Stage | Model | Why |
|-------|-------|-----|
| Question generation | `llama-3.1-8b-instant` | Fast, low-latency structured JSON output |
| Live interviewer replies | `llama-3.1-8b-instant` | Short spoken responses during the session |
| Speech-to-text | `whisper-large-v3` | Accurate transcription of technical answers |
| Post-interview feedback | `llama-3.3-70b-versatile` | Deeper evaluation with multi-dimensional scoring |

---

## Repository Structure

```
ai_mock_interview/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── pages/               # Route-level screens
│   │   │   ├── CreateInterview.jsx
│   │   │   ├── InterviewRoom.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   └── Analytics.jsx
│   │   ├── services/
│   │   │   ├── interviewApi.js  # REST client for interview CRUD
│   │   │   └── voiceAgentApi.js # Voice loop API client
│   │   └── components/          # Shared UI (Navbar, AppShell, etc.)
│   └── vite.config.js           # Proxies /api → localhost:5000
│
├── backend/                     # Express API
│   └── src/
│       ├── index.js             # App entry, middleware, health check
│       ├── config/env.js        # Env loading (path-relative, not cwd-dependent)
│       ├── routes/              # HTTP route definitions
│       ├── controllers/         # Request/response handlers
│       ├── services/            # Business logic + Groq integration
│       ├── repositories/        # PostgreSQL data access
│       ├── db/                  # Pool + schema migration
│       └── middleware/          # Global error handler
│
├── docker-compose.yml           # Optional local Postgres
└── package.json                 # Root scripts (dev:backend, dev:frontend)
```

---

## End-to-End User Flow

### Phase 1 — Authentication

1. User lands on `/` (marketing/home page).
2. User signs up or logs in via **Clerk** (`/login`, `/signup`).
3. Protected pages (`/dashboard`, `/create-interview`, etc.) are wrapped in `ProtectedRoute`, which redirects unauthenticated users.

### Phase 2 — Interview Creation

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant Parser as Resume Parser
    participant Groq as Groq API
    participant DB as PostgreSQL

    U->>FE: Upload resume + fill job description
    FE->>BE: POST /api/interviews (multipart/form-data)
    BE->>Parser: Extract text (PDF/DOCX/TXT)
    Parser-->>BE: resumeText
    BE->>Groq: Generate tailored questions (JSON)
    Groq-->>BE: questions[]
    BE->>DB: INSERT interview (status: ready)
    BE-->>FE: { interview }
    FE->>U: Redirect to /interview/:id
```

**What happens internally:**

1. Frontend sends `FormData` with resume file + metadata (role, company, difficulty, duration, job description).
2. Backend validates file type (PDF, DOCX, TXT) and size (max 5 MB).
3. `resumeParser.service.js` extracts plain text.
4. `groq.service.js` generates `N` questions where `N = round(durationMinutes / 5)`, clamped between 3 and 10.
5. Interview record is persisted in PostgreSQL with `status: "ready"`.

### Phase 3 — Live Interview Session

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant Groq as Groq API
    participant TTS as Browser Speech API

    FE->>BE: GET /api/interviews/:id
    FE->>BE: POST /api/interviews/:id/start
    BE-->>FE: interview (status: in_progress)
    FE->>TTS: Speak first question aloud

    loop Each question
        U->>FE: Record voice OR type answer
        opt Voice path
            FE->>BE: POST /api/voice-agent/respond
            BE->>Groq: Whisper transcription
            Groq-->>BE: transcript
            BE->>Groq: Interviewer reply (Llama)
            Groq-->>BE: aiResponse
            BE-->>FE: { transcript, aiResponse }
            FE->>TTS: Speak aiResponse
        end
        FE->>BE: POST /api/interviews/:id/answer
        BE-->>FE: { interview, isComplete, nextQuestion }
        FE->>TTS: Speak next question (if any)
    end
```

**Interview room capabilities:**

- **Text answers**: User types in a textarea and clicks "Save Answer".
- **Voice answers**: Browser records audio → backend transcribes with Whisper → Llama generates a short interviewer acknowledgment/follow-up → browser speaks it via Web Speech API.
- **Progress tracking**: Question index, timer, and transcript sidebar update in real time.
- **Persistence**: Every saved answer is written to PostgreSQL immediately (no localStorage).

### Phase 4 — Completion & AI Feedback

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as Backend
    participant Groq as Groq API
    participant DB as PostgreSQL

    FE->>BE: POST /api/interviews/:id/complete
    BE->>DB: Load full interview (questions + answers + resume + JD)
    BE->>Groq: Evaluate entire session (llama-3.3-70b)
    Groq-->>BE: Structured feedback JSON
    BE->>DB: UPDATE score + feedback
    BE-->>FE: { interview, feedback }
    FE->>FE: Navigate to /feedback/:id
```

**Feedback includes:**

- `overallScore`, `technicalScore`, `communicationScore`, `problemSolvingScore`, `confidenceScore`, `relevanceScore`
- `strengths[]`, `improvements[]`
- `questionFeedback[]` (per-question rating + comment)
- `summary` (narrative overview)

### Phase 5 — Review & Analytics

- **Feedback page** (`/feedback/:id`): Loads interview from API and renders AI evaluation.
- **History page** (`/history`): Lists all sessions from `GET /api/interviews`.
- **Dashboard** (`/dashboard`): Recent sessions + aggregate stats (count, average score, best score).
- **Analytics** (`/analytics`): Averages technical/relevance/communication scores across completed interviews.

All history data comes from **PostgreSQL via the backend API** — not browser localStorage.

---

## Backend Deep Dive

### Entry point (`backend/src/index.js`)

- Loads environment from `backend/.env` using a **path relative to the module** (not `process.cwd()`), so the server works regardless of which directory you start it from.
- Runs schema migration on startup (`CREATE TABLE IF NOT EXISTS interviews`).
- Registers CORS, JSON body parser, routes, and a global error handler.
- Exposes `GET /api/health` with `groqConfigured` and `dbConnected` flags.

### Layer responsibilities

| Layer | File(s) | Responsibility |
|-------|---------|----------------|
| **Routes** | `routes/interview.routes.js`, `routes/voiceAgent.routes.js` | Map URLs to controllers |
| **Controllers** | `controllers/*.controller.js` | Parse HTTP input, call services, return JSON |
| **Services** | `services/interview.service.js`, `services/groq.service.js`, `services/resumeParser.service.js` | Business rules, AI orchestration, validation |
| **Repository** | `repositories/interview.repository.js` | SQL queries, row ↔ object mapping |
| **DB** | `db/pool.js`, `db/migrate.js` | Connection pool, schema |

### Interview state machine

```
ready → in_progress → completed
```

| Status | Meaning |
|--------|---------|
| `ready` | Created, questions generated, not yet started |
| `in_progress` | User has started; answering questions |
| `completed` | All questions answered |

### Question count formula

```javascript
numQuestions = clamp(round(durationMinutes / 5), min=3, max=10)
```

A 15-minute session → 3 questions. A 30-minute session → 6 questions.

---

## Frontend Deep Dive

### Routing (`frontend/src/App.jsx`)

| Route | Page | Auth |
|-------|------|------|
| `/` | Home | Public |
| `/login`, `/signup` | Clerk auth | Public |
| `/dashboard` | Dashboard | Protected |
| `/create-interview` | Create session | Protected |
| `/interview/:interviewId` | Live interview room | Protected |
| `/feedback/:interviewId` | AI feedback report | Protected |
| `/history` | Past sessions | Protected |
| `/analytics` | Score analytics | Protected |

### API clients

- **`interviewApi.js`**: CRUD for interviews (create, get, start, answer, complete, list).
- **`voiceAgentApi.js`**: Sends base64 audio to `/api/voice-agent/respond`.

### Dev proxy

Vite proxies `/api` → `http://localhost:5000`, so the frontend can call `/api/interviews` without CORS issues during development.

---

## AI / LLM Pipeline

There are **three distinct Groq call sites**, each with a different purpose:

### 1. Question Generation (at creation time)

- **Input**: resume text, job description, role, difficulty, experience level, duration
- **Output**: JSON array of `{ category, prompt, expectedTopics }`
- **Model**: `llama-3.1-8b-instant`
- **Constraint**: `response_format: { type: "json_object" }` for reliable parsing

### 2. Live Voice Loop (during interview)

```
User speaks → Whisper (STT) → transcript
transcript + interview context → Llama (short reply) → spoken by browser TTS
```

- Transcript is shown in the textarea; user confirms and saves.
- Interviewer reply is kept under ~55 words for natural speech.

### 3. Post-Interview Evaluation (at completion)

- **Input**: Full interview object — resume, JD, all Q&A pairs
- **Output**: Multi-dimensional scored feedback JSON
- **Model**: `llama-3.3-70b-versatile` (stronger reasoning for evaluation)
- **Stored in**: PostgreSQL `feedback` column + `score` field

### Why Groq?

- **Low latency** for real-time voice loop (critical for conversational UX)
- **OpenAI-compatible API** (simple `fetch`-based integration, no heavy SDK required on backend)
- **Cost-effective** for high-token evaluation calls

### Security note

The `GROQ_API_KEY` lives only in `backend/.env`. The frontend never sees it. All AI calls are server-side.

---

## Database Design

### `interviews` table (PostgreSQL / Neon)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `role`, `company` | VARCHAR | Target job metadata |
| `experience_level`, `difficulty`, `interview_type` | VARCHAR | Session config |
| `duration_minutes`, `num_questions` | INTEGER | Timing config |
| `resume_text` | TEXT | Parsed resume content |
| `resume_file_name` | VARCHAR | Original uploaded filename |
| `job_description` | TEXT | User-provided JD |
| `questions` | JSONB | Generated question array |
| `answers` | JSONB | Saved answer array |
| `current_question_index` | INTEGER | Progress pointer |
| `status` | VARCHAR | `ready` / `in_progress` / `completed` |
| `score` | NUMERIC | Overall score from AI feedback |
| `feedback` | JSONB | Full LLM feedback object |
| `created_at`, `updated_at`, `started_at`, `completed_at` | TIMESTAMPTZ | Lifecycle timestamps |

Schema is applied automatically on backend startup via `db/migrate.js`.

---

## API Reference

### Health

```
GET /api/health
→ { status, service, groqConfigured, dbConnected }
```

### Interviews

```
GET    /api/interviews                         List all sessions
POST   /api/interviews                         Create (multipart: resume file + fields)
GET    /api/interviews/:id                     Get single session
POST   /api/interviews/:id/start               Mark in_progress
POST   /api/interviews/:id/answer              Save answer { answer: "..." }
POST   /api/interviews/:id/complete            Generate AI feedback
```

### Voice Agent

```
POST /api/voice-agent/respond
Body: { audioBase64, mimeType, interviewContext }
→ { transcript, aiResponse, models }
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
CLIENT_URL=http://localhost:5173

GROQ_API_KEY=your_groq_api_key
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_WHISPER_MODEL=whisper-large-v3
GROQ_CHAT_MODEL=llama-3.1-8b-instant
MAX_AUDIO_BYTES=8388608

DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

### Frontend (`frontend/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=/api
```

`VITE_API_URL` defaults to `/api` (uses Vite proxy in dev). Set to full URL in production if API is on a different domain.

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- A Groq API key ([console.groq.com](https://console.groq.com))
- A Clerk account for auth ([clerk.com](https://clerk.com))
- A PostgreSQL database (Neon recommended, or local Docker)

### Steps

```bash
# 1. Clone and install
cd ai_mock_interview
npm install --prefix backend
npm install --prefix frontend

# 2. Configure environment
cp backend/.env.example backend/.env   # then fill in keys
# Add VITE_CLERK_PUBLISHABLE_KEY to frontend/.env

# 3. Start backend (runs migration on boot)
npm run dev:backend

# 4. Start frontend (separate terminal)
npm run dev:frontend

# 5. Open app
# http://localhost:5173
```

### Optional: local Postgres via Docker

```bash
npm run db:up
# Set DATABASE_URL=postgresql://interview:interview@localhost:5432/ai_mock_interview
```

---

## Design Decisions & Tradeoffs

### 1. Separate frontend and backend folders

**Why**: Clear ownership boundaries, independent deployability, and the backend can serve multiple clients later (mobile, CLI, etc.).

### 2. Server-side resume parsing

**Why**: Parsing PDF/DOCX in the browser is unreliable and exposes parsing libraries to the client. The backend owns validation, text extraction, and storage.

### 3. PostgreSQL over in-memory / localStorage

**Why**: Sessions survive browser refreshes and device changes. History, analytics, and feedback are durable. JSONB columns give flexibility for questions/answers/feedback without a complex relational schema.

### 4. Groq for all AI tasks

**Why**: Single provider, OpenAI-compatible API, fast inference. Tradeoff: vendor lock-in to Groq — mitigated by abstracting calls in `groq.service.js`.

### 5. Browser TTS instead of paid TTS API

**Why**: Zero cost for MVP, no extra API latency. Tradeoff: voice quality varies by browser/OS.

### 6. Feedback generated on `/complete`, not at creation

**Why**: Feedback requires the full Q&A transcript. Calling the LLM before answers exist would produce meaningless evaluation.

### 7. Env loading relative to backend root

**Why**: Prevents a class of bugs where `GROQ_API_KEY` appears missing because the server was started from the wrong working directory.

---

## Future Improvements

- **User-scoped interviews**: Link sessions to Clerk `userId` (currently all interviews are global)
- **Streaming LLM responses**: Reduce perceived latency for feedback generation
- **Resume file storage**: Store original PDF in object storage (S3/R2) instead of only parsed text
- **Rate limiting & usage tracking**: Protect Groq API costs per user
- **WebSocket voice pipeline**: Lower latency than record-then-upload
- **Rubrics per role**: Different evaluation criteria for SDE vs PM vs Data roles
- **CI/CD + production deploy**: Frontend on Vercel/Netlify, backend on Render/Railway, Neon for DB

---

## Quick "Explain It in 60 Seconds" (Interview Pitch)

> "I built a full-stack AI mock interview platform. The user uploads their resume and a job description. The backend parses the resume, calls Groq to generate tailored interview questions, and stores the session in PostgreSQL on Neon. During the interview, the user can answer by voice — audio goes to Groq Whisper for transcription, and Llama generates a conversational interviewer response that the browser speaks aloud. When all questions are answered, a stronger model evaluates the full transcript and produces multi-dimensional feedback with scores, strengths, and per-question review. The React frontend handles auth via Clerk, and all data flows through a REST API — no localStorage. The architecture is layered: routes, controllers, services, repository, with all AI calls isolated server-side to protect API keys."
