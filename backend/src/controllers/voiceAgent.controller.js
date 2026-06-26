import { env } from "../config/env.js";
import { generateInterviewReply, transcribeAudio } from "../services/groq.service.js";

export async function respondToVoiceAgent(req, res, next) {
  try {
    const { audioBase64, mimeType, interviewContext } = req.body;

    if (!audioBase64 || typeof audioBase64 !== "string") {
      return res.status(400).json({ message: "audioBase64 is required." });
    }

    const estimatedBytes = Math.ceil((audioBase64.length * 3) / 4);
    if (estimatedBytes > env.maxAudioBytes) {
      return res.status(413).json({
        message: "Audio clip is too large. Keep answers shorter for low latency.",
      });
    }

    const transcript = await transcribeAudio({ audioBase64, mimeType });

    if (!transcript) {
      return res.status(422).json({
        message: "No speech was detected. Please record your answer again.",
        transcript: "",
      });
    }

    const aiResponse = await generateInterviewReply({ transcript, interviewContext });

    res.json({
      transcript,
      aiResponse,
      models: {
        transcription: env.whisperModel,
        chat: env.chatModel,
      },
    });
  } catch (error) {
    next(error);
  }
}
