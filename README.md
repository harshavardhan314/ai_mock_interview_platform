# 🤖 AI Mock Interview Platform

An AI-powered mock interview platform that generates personalized interview questions from your **resume** and **job description**, conducts voice/text interviews, and provides detailed AI feedback.

## ✨ Features

- 🔐 Secure authentication with Clerk
- 📄 Resume upload (PDF/DOCX/TXT)
- 🤖 AI-generated interview questions using Groq LLM
- 🎙️ Voice and text-based interview support
- 📝 Speech-to-text transcription with Whisper
- 📊 AI-powered interview evaluation and feedback
- 📚 Interview history and performance analytics
- 💾 PostgreSQL database for persistent storage

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Neon)
- **AI:** Groq (Llama 3.3 & Whisper)
- **Authentication:** Clerk

## 🚀 How It Works

1. Upload your resume and job description.
2. AI generates personalized interview questions.
3. Complete the interview using voice or text.
4. Receive detailed AI feedback with scores and improvement suggestions.
5. View past interviews and track your progress.

## 📦 Run Locally

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

---

⭐ If you found this project useful, consider giving it a star!