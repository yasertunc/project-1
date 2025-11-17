import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "./errorHandler";
import { ERROR_CODES } from "../config/constants";

/**
 * Request validation middleware using Zod
 */
export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");

        const apiError: ApiError = new Error(`Validation error: ${errorMessage}`);
        apiError.statusCode = 400;
        apiError.code = ERROR_CODES.INVALID_REQUEST;
        apiError.details = error.issues;
        next(apiError);
      } else {
        next(error);
      }
    }
  };
}

// Validation schemas
export const matchRequestSchema = z.object({
  intent: z.enum(["route", "incident", "social", "coach"]),
  location: z.object({
    geoHash: z.string().min(1),
    radius: z.number().positive(),
  }),
  capabilities: z.object({
    text: z.boolean(),
    voice: z.boolean(),
    location: z.boolean(),
  }),
  preferences: z.object({
    maxWaitTime: z.number().positive(),
    language: z.enum(["en", "tr", "ar"]),
  }),
});

export const cancelRequestSchema = z.object({
  matchId: z.string().uuid(),
});

export const messageRequestSchema = z.object({
  text: z.string().min(1).max(1000),
  type: z.enum(["text", "voice", "location"]),
});

export const reportRequestSchema = z.object({
  channelId: z.string().uuid(),
  reportedHandle: z.string().min(1),
  reason: z.enum(["spam", "harassment", "inappropriate", "other"]),
  description: z.string().optional(),
});

export const pushRegisterSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(["android", "ios"]),
  userId: z.string().optional(),
});

export const pushUnregisterSchema = z.object({
  token: z.string().min(1),
});

