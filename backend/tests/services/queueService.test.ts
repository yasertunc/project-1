import { describe, it, expect, beforeEach } from "vitest";
import { queueService } from "../../src/services/queueService";
import { MatchRequest } from "../../src/types";

describe("QueueService", () => {
  beforeEach(() => {
    // Reset queue before each test
    // Note: In a real implementation, we'd need a reset method
  });

  describe("enqueue", () => {
    it("should enqueue a match request", () => {
      const request: MatchRequest = {
        intent: "route",
        location: {
          geoHash: "s0m3h4sh",
          radius: 1000,
        },
        capabilities: {
          text: true,
          voice: false,
          location: true,
        },
        preferences: {
          maxWaitTime: 300,
          language: "en",
        },
      };

      const result = queueService.enqueue(request);

      expect(result).toHaveProperty("matchId");
      expect(result).toHaveProperty("queuePosition");
      expect(result).toHaveProperty("estimatedWaitTime");
      expect(result.queuePosition).toBeGreaterThan(0);
    });

    it("should return correct queue position", () => {
      const request: MatchRequest = {
        intent: "route",
        location: {
          geoHash: "s0m3h4sh",
          radius: 1000,
        },
        capabilities: {
          text: true,
          voice: false,
          location: true,
        },
        preferences: {
          maxWaitTime: 300,
          language: "en",
        },
      };

      const result1 = queueService.enqueue(request);
      const result2 = queueService.enqueue(request);

      expect(result2.queuePosition).toBeGreaterThan(result1.queuePosition);
    });
  });

  describe("cancel", () => {
    it("should cancel a queued match", () => {
      const request: MatchRequest = {
        intent: "route",
        location: {
          geoHash: "s0m3h4sh",
          radius: 1000,
        },
        capabilities: {
          text: true,
          voice: false,
          location: true,
        },
        preferences: {
          maxWaitTime: 300,
          language: "en",
        },
      };

      const { matchId } = queueService.enqueue(request);
      queueService.cancel(matchId);

      const status = queueService.getStatus(matchId);
      expect(status?.status).toBe("cancelled");
    });

    it("should throw error if match not found", () => {
      expect(() => {
        queueService.cancel("non-existent-id");
      }).toThrow("Match not found");
    });
  });

  describe("getStatus", () => {
    it("should return match status", () => {
      const request: MatchRequest = {
        intent: "route",
        location: {
          geoHash: "s0m3h4sh",
          radius: 1000,
        },
        capabilities: {
          text: true,
          voice: false,
          location: true,
        },
        preferences: {
          maxWaitTime: 300,
          language: "en",
        },
      };

      const { matchId } = queueService.enqueue(request);
      const status = queueService.getStatus(matchId);

      expect(status).not.toBeNull();
      expect(status?.matchId).toBe(matchId);
      expect(status?.status).toBe("queued");
    });

    it("should return null for non-existent match", () => {
      const status = queueService.getStatus("non-existent-id");
      expect(status).toBeNull();
    });
  });
});
