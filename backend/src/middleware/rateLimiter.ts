import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { config } from "../config/env";
import { logger } from "../utils/logger";
import { ERROR_CODES } from "../config/constants";

/**
 * Create a rate limiter middleware
 */
export function createRateLimiter(
  windowMs: number,
  max: number,
  message: string = "Too many requests, please try again later"
) {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message,
      },
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });

      res.status(429).json({
        error: {
          code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
          message,
        },
      });
    },
  });
}

/**
 * Rate limiter for enqueue endpoint
 */
export const enqueueRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  config.rateLimit.enqueue,
  "Too many match requests, please try again later"
);

/**
 * Rate limiter for message sending
 */
export const messageRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  config.rateLimit.messages,
  "Too many messages, please slow down"
);

/**
 * Rate limiter for report endpoint
 */
export const reportRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  config.rateLimit.reports,
  "Too many reports, please try again later"
);

/**
 * Rate limiter for general API endpoints
 */
export const generalRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  100, // 100 requests per minute
  "Too many requests, please try again later"
);
