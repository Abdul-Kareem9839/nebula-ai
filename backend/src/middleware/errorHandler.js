import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  if (statusCode >= 500) {
    logger.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
  });
}
