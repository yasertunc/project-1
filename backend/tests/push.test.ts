import { describe, it, expect, beforeEach } from "vitest";
import { pushService } from "../src/services/pushService";

describe("Push Service", () => {
  beforeEach(() => {
    // Clean up tokens before each test
    // Note: In a real implementation, we'd need a reset method
  });

  describe("registerToken", () => {
    it("should register a push token", () => {
      pushService.registerToken("test-token-123", "android", "user-123");

      const tokens = pushService.getTokensForUser("user-123");
      expect(tokens).toContain("test-token-123");
    });

    it("should register multiple tokens for the same user", () => {
      pushService.registerToken("token-1", "android", "user-123");
      pushService.registerToken("token-2", "ios", "user-123");

      const tokens = pushService.getTokensForUser("user-123");
      expect(tokens).toHaveLength(2);
      expect(tokens).toContain("token-1");
      expect(tokens).toContain("token-2");
    });
  });

  describe("unregisterToken", () => {
    it("should unregister a push token", () => {
      pushService.registerToken("test-token-123", "android", "user-123");
      pushService.unregisterToken("test-token-123");

      const tokens = pushService.getTokensForUser("user-123");
      expect(tokens).not.toContain("test-token-123");
    });
  });

  describe("getTokensForUser", () => {
    it("should return empty array for user with no tokens", () => {
      const tokens = pushService.getTokensForUser("non-existent-user");
      expect(tokens).toHaveLength(0);
    });
  });
});

