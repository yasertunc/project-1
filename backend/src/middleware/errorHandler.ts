import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ERROR_CODES } from "../config/constants";

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const code = err.code || ERROR_CODES.INTERNAL_ERROR;

  logger.error("API Error", {
    error: err.message,
    stack: err.stack,
    code,
    statusCode,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    error: {
      code,
      message: err.message || "Internal server error",
      details: err.details,
    },
  });
}

