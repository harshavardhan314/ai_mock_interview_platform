# AI Mock Interview Platform

An AI-powered mock interview platform that generates personalized interviews from your **resume** and **job description**, conducts voice/text interviews, and provides detailed AI feedback.

## ✨ Features
- 📄 Resume parsing (PDF/DOCX/TXT)
- 🤖 AI-generated interview questions using Groq LLM
- 🎤 Voice & text interview support (Whisper STT + Browser TTS)
- 📊 AI-powered performance analysis with detailed scores
- 📚 Interview history & analytics dashboard
- 🔒 Secure authentication with Clerk
- 💾 PostgreSQL (Neon) for persistent interview storage

## 🛠️ Tech Stack
**Frontend:** React, Vite, Tailwind CSS, React Router, Clerk, Framer Motion  
**Backend:** Node.js, Express, PostgreSQL, Multer, pdf-parse, Mammoth  
**AI:** Groq (Llama 3.1, Llama 3.3, Whisper)

## 🚀 Getting Started
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

Create `.env` files with your **Groq API Key**, **Clerk Keys**, and **PostgreSQL (Neon) Database URL**, then open **http://localhost:5173**.

---
**Created by Harsha Tariviti**