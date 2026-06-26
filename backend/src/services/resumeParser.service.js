import { createRequire } from "node:module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const ALLOWED_EXTENSIONS = new Set(["pdf", "docx", "txt"]);
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export function validateResumeFile(file) {
  if (!file) {
    return { valid: false, message: "Resume file is required. Upload a PDF, DOCX, or TXT file." };
  }

  if (file.size > MAX_RESUME_BYTES) {
    return { valid: false, message: "Resume file is too large. Maximum size is 5 MB." };
  }

  const extension = getFileExtension(file.originalname);
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return {
      valid: false,
      message: "Unsupported resume format. Upload a PDF, DOCX, or TXT file.",
    };
  }

  return { valid: true, extension };
}

export async function parseResumeFile(file) {
  const validation = validateResumeFile(file);
  if (!validation.valid) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  const extension = validation.extension;
  let resumeText = "";

  if (extension === "pdf") {
    const parsed = await pdfParse(file.buffer);
    resumeText = parsed.text || "";
  } else if (extension === "docx") {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    resumeText = parsed.value || "";
  } else {
    resumeText = file.buffer.toString("utf8");
  }

  resumeText = resumeText.replace(/\s+/g, " ").trim();

  if (!resumeText) {
    const error = new Error("Could not extract text from the uploaded resume. Try a different file.");
    error.statusCode = 422;
    throw error;
  }

  return {
    resumeText,
    resumeFileName: file.originalname,
  };
}

function getFileExtension(fileName = "") {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.at(-1) : "";
}
