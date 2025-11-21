import { describe, it, expect, beforeEach } from "vitest";
import { queueService } from "../src/services/queueService";
import { matchingService } from "../src/services/matchingService";
import type { MatchRequest } from "../src/types";

describe("Match Service", () => {
  beforeEach(() => {
    // Clean up queue before each test
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

    it("should return different match IDs for different requests", () => {
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

      expect(result1.matchId).not.toBe(result2.matchId);
    });
  });

  describe("cancel", () => {
    it("should cancel an enqueued match", () => {
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

    it("should throw error when cancelling non-existent match", () => {
      expect(() => {
        queueService.cancel("non-existent-id");
      }).toThrow("Match not found");
    });
  });

  describe("getStatus", () => {
    it("should return status for enqueued match", () => {
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
      expect(status?.queuePosition).toBeGreaterThan(0);
    });

    it("should return null for non-existent match", () => {
      const status = queueService.getStatus("non-existent-id");
      expect(status).toBeNull();
    });
  });
});

describe("Matching Service", () => {
  describe("calculateScore", () => {
    it("should calculate score for matching intents", () => {
      const request1 = {
        intent: "route",
        location: { geoHash: "s0m3h4sh" },
        capabilities: { text: true, voice: false, location: true },
      };
      const request2 = {
        intent: "route",
        location: { geoHash: "s0m3h4sh" },
        capabilities: { text: true, voice: false, location: true },
      };

      const score = matchingService.calculateScore(request1, request2);

      expect(score.total).toBeGreaterThan(0);
      expect(score.intent).toBe(40);
      expect(score.location).toBe(30);
      expect(score.capabilities).toBeGreaterThan(0);
    });

    it("should return lower score for different intents", () => {
      const request1 = {
        intent: "route",
        location: { geoHash: "s0m3h4sh" },
        capabilities: { text: true, voice: false, location: true },
      };
      const request2 = {
        intent: "incident",
        location: { geoHash: "s0m3h4sh" },
        capabilities: { text: true, voice: false, location: true },
      };

      const score = matchingService.calculateScore(request1, request2);

      expect(score.intent).toBe(0);
      expect(score.total).toBeLessThan(70);
    });
  });
});
