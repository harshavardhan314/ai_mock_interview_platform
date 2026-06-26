import multer from "multer";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ message: "Resume file is too large. Maximum size is 5 MB." });
      return;
    }

    res.status(400).json({ message: error.message || "File upload failed." });
    return;
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Internal Server Error",
  });
}
