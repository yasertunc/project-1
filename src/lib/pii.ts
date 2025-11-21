const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi;
const PHONE_REGEX =
  /\b(?:\+?\d{1,3})?[-.\s]?(?:\(?\d{3}\)?|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const URL_REGEX = /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/gi;

const resetRegexes = () => {
  EMAIL_REGEX.lastIndex = 0;
  PHONE_REGEX.lastIndex = 0;
  URL_REGEX.lastIndex = 0;
};

export type PiiScanResult = {
  hasEmail: boolean;
  hasPhone: boolean;
  hasUrl: boolean;
};

/**
 * Redacts Personally Identifiable Information (PII) from text.
 *
 * Replaces email addresses, phone numbers, and URLs with placeholders.
 *
 * @param input - Input text that may contain PII
 * @returns Text with PII redacted (e.g., emails → "[REDACTED_EMAIL]", phones → "[REDACTED_PHONE]")
 *
 * @example
 * ```ts
 * redactPii("Contact me at john@example.com or 555-1234");
 * // Returns: "Contact me at [REDACTED_EMAIL] or [REDACTED_PHONE]"
 * ```
 */
export function redactPii(input: string): string {
  resetRegexes();
  if (!input) return input;
  return input
    .replace(EMAIL_REGEX, "[REDACTED_EMAIL]")
    .replace(PHONE_REGEX, "[REDACTED_PHONE]")
    .replace(URL_REGEX, "[REDACTED_URL]");
}

/**
 * Scans text for Personally Identifiable Information (PII) without redacting.
 *
 * @param input - Input text to scan
 * @returns Object indicating which types of PII were found
 *
 * @example
 * ```ts
 * const result = scanPii("Email: test@example.com");
 * // Returns: { hasEmail: true, hasPhone: false, hasUrl: false }
 * ```
 */
export function scanPii(input: string): PiiScanResult {
  resetRegexes();
  if (!input) {
    return {
      hasEmail: false,
      hasPhone: false,
      hasUrl: false,
    };
  }

  return {
    hasEmail: EMAIL_REGEX.test(input),
    hasPhone: PHONE_REGEX.test(input),
    hasUrl: URL_REGEX.test(input),
  };
}

/**
 * Sanitizes log messages by redacting PII before logging.
 *
 * Use this function to prevent sensitive data from appearing in logs.
 * Handles strings, objects (JSON stringified), and other types.
 *
 * @param message - Log message that may contain PII (string, object, or any value)
 * @returns Sanitized message with PII redacted
 *
 * @example
 * ```ts
 * console.log(sanitizeLogMessage(`User ${user.email} logged in`));
 * // Logs: "User [REDACTED_EMAIL] logged in"
 * ```
 */
export function sanitizeLogMessage(message: unknown): string {
  const normalized =
    typeof message === "string"
      ? message
      : typeof message === "object"
        ? JSON.stringify(message)
        : String(message);
  return redactPii(normalized);
}
