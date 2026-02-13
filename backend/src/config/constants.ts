/**
 * Application Constants
 */

export const CONSTANTS = {
  API_PREFIX: process.env.API_PREFIX || "/api/v1",
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // 5MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
  ALLOWED_FILE_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_EXTENSIONS: [".pdf", ".doc", ".docx"],
};

export const ERROR_MESSAGES = {
  INVALID_FILE_TYPE:
    "Invalid file type. Only PDF and Word documents are allowed.",
  FILE_TOO_LARGE: "File size exceeds maximum limit.",
  FILE_NOT_FOUND: "File not found.",
  RESUME_NOT_FOUND: "Resume not found.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
};

export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: "File uploaded successfully.",
  RESUME_PARSED: "Resume parsed successfully.",
  RESUME_DELETED: "Resume deleted successfully.",
};
