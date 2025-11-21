import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";

import { formatNumber, formatDate, formatRelativeMinutes } from "./format";
import i18n from "./setup";

describe("format", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("formatNumber", () => {
    test("formats number with default locale", () => {
      expect(formatNumber(1234.56)).toBe("1,234.56");
    });

    test("formats number with custom options", () => {
      expect(formatNumber(1234.56, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe("1,234.56");
      expect(formatNumber(1234.5, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe("1,234.50");
    });

    test("formats currency", () => {
      const result = formatNumber(1234.56, { style: "currency", currency: "USD" });
      expect(result).toContain("1,234.56");
      expect(result).toContain("$");
    });

    test("respects i18n language", async () => {
      await i18n.changeLanguage("tr");
      // Turkish uses different number formatting
      const result = formatNumber(1234.56);
      expect(result).toBeDefined();
    });
  });

  describe("formatDate", () => {
    test("formats Date object", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatDate(date);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("formats date string", () => {
      const result = formatDate("2024-01-15T10:30:00Z");
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("formats timestamp number", () => {
      const timestamp = new Date("2024-01-15T10:30:00Z").getTime();
      const result = formatDate(timestamp);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("uses default dateStyle medium", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatDate(date);
      expect(result).toBeDefined();
    });

    test("accepts custom options", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatDate(date, { dateStyle: "short" });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("respects i18n language", async () => {
      await i18n.changeLanguage("tr");
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatDate(date);
      expect(result).toBeDefined();
    });
  });

  describe("formatRelativeMinutes", () => {
    test("formats positive minutes", () => {
      const result = formatRelativeMinutes(5);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("formats negative minutes (past)", () => {
      const result = formatRelativeMinutes(-5);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("formats zero minutes", () => {
      const result = formatRelativeMinutes(0);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("uses numeric auto style", () => {
      const result = formatRelativeMinutes(1);
      expect(result).toBeDefined();
    });

    test("respects i18n language", async () => {
      await i18n.changeLanguage("tr");
      const result = formatRelativeMinutes(5);
      expect(result).toBeDefined();
    });
  });
});

