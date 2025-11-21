import { describe, expect, it } from "vitest";

import { redactPii, sanitizeLogMessage, scanPii } from "./pii";

describe("pii utils", () => {
  it("redacts emails, phones and urls", () => {
    const input =
      "Email me at demo@example.com or call +1 415-555-1234, see https://example.com";
    const redacted = redactPii(input);
    expect(redacted).toContain("[REDACTED_EMAIL]");
    expect(redacted).toContain("[REDACTED_PHONE]");
    expect(redacted).toContain("[REDACTED_URL]");
  });

  it("scans consistently across repeated calls", () => {
    const text =
      "Contact alice@test.com, phone (555) 123-4567, site http://example.com";
    const first = scanPii(text);
    const second = scanPii(text);
    expect(first).toEqual({
      hasEmail: true,
      hasPhone: true,
      hasUrl: true,
    });
    expect(second).toEqual(first);
  });

  it("sanitizes loggable objects", () => {
    const message = sanitizeLogMessage({ email: "demo@example.com" });
    expect(message).toContain("[REDACTED_EMAIL]");
  });

  it("handles empty input", () => {
    expect(redactPii("")).toBe("");
    expect(scanPii("")).toEqual({
      hasEmail: false,
      hasPhone: false,
      hasUrl: false,
    });
  });
});
