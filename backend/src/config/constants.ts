export const INTENTS = ["route", "incident", "social", "coach"] as const;
export type Intent = (typeof INTENTS)[number];

export const LANGUAGES = ["en", "tr", "ar"] as const;
export type Language = (typeof LANGUAGES)[number];

export const MESSAGE_TYPES = ["text", "voice", "location"] as const;
export type MessageType = (typeof MESSAGE_TYPES)[number];

export const REPORT_REASONS = [
  "spam",
  "harassment",
  "inappropriate",
  "other",
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const MATCH_STATUS = [
  "queued",
  "matched",
  "cancelled",
  "expired",
] as const;
export type MatchStatus = (typeof MATCH_STATUS)[number];

export const ERROR_CODES = {
  INVALID_REQUEST: "INVALID_REQUEST",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  MATCH_EXPIRED: "MATCH_EXPIRED",
  CHANNEL_CLOSED: "CHANNEL_CLOSED",
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export const MATCHING_SCORES = {
  INTENT: 40,
  LOCATION: 30,
  CAPABILITIES: 20,
  QUEUE_TIME: 10,
} as const;

