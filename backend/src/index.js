import cors from "cors";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./config/env.js";
import { runMigrations } from "./db/migrate.js";
import { pool } from "./db/pool.js";
import { errorHandler } from "./middleware/errorHandler.js";
import interviewRoutes from "./routes/interview.routes.js";
import voiceAgentRoutes from "./routes/voiceAgent.routes.js";

const app = express();

app.use(clerkMiddleware());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Debug-Session-Id"],
  })
);

app.use(express.json({ limit: `${env.maxAudioBytes * 1.4}b` }));

app.get("/api/health", async (req, res) => {
  let dbConnected = false;

  try {
    await pool.query("SELECT 1");
    dbConnected = true;
  } catch {
    dbConnected = false;
  }

  res.json({
    status: "ok",
    service: "ai-mock-interview-api",
    groqConfigured: Boolean(env.groqApiKey),
    dbConnected,
  });
});

app.use("/api/interviews", interviewRoutes);
app.use("/api/voice-agent", voiceAgentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

async function startServer() {
  try {
    await runMigrations();
    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message || error);
    console.error(
      "Ensure PostgreSQL is running. Start it with: npm run db:up (requires Docker) or configure DATABASE_URL in backend/.env"
    );
    process.exit(1);
  }
}

startServer();
