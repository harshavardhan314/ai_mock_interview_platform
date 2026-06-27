import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../..");
const envPath = path.join(backendRoot, ".env");

dotenv.config({ path: envPath });

const groqApiKey = process.env.GROQ_API_KEY?.trim() || "";

export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  groqApiKey,
  groqBaseUrl: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
  whisperModel: process.env.GROQ_WHISPER_MODEL || "whisper-large-v3",
  chatModel: process.env.GROQ_CHAT_MODEL || "llama-3.1-8b-instant",
  maxAudioBytes: Number(process.env.MAX_AUDIO_BYTES || 8 * 1024 * 1024),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://interview:interview@localhost:5432/ai_mock_interview",
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY?.trim() || "",
  clerkSecretKey: process.env.CLERK_SECRET_KEY?.trim() || "",
};
