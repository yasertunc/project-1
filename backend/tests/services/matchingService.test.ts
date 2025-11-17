import { describe, it, expect } from "vitest";
import { matchingService } from "../../src/services/matchingService";
import { OfferRequest, Participant } from "../../src/types";

describe("MatchingService", () => {
  describe("calculateScore", () => {
    it("should calculate score for matching intents", () => {
      const request1 = {
        intent: "route",
        location: { geoHash: "s0m3h4sh123" },
        capabilities: { text: true, voice: false, location: true },
      };
      const request2 = {
        intent: "route",
        location: { geoHash: "s0m3h4sh456" },
        capabilities: { text: true, voice: false, location: true },
      };

      const score = matchingService.calculateScore(request1, request2);

      expect(score.intent).toBe(40); // Same intent
      expect(score.total).toBeGreaterThan(0);
    });

    it("should calculate location score based on geohash prefix", () => {
      const request1 = {
        intent: "route",
        location: { geoHash: "s0m3h4" },
        capabilities: { text: true, voice: false, location: true },
      };
      const request2 = {
        intent: "route",
        location: { geoHash: "s0m3h4" },
        capabilities: { text: true, voice: false, location: true },
      };

      const score = matchingService.calculateScore(request1, request2);

      expect(score.location).toBe(30); // Same geohash prefix
    });

    it("should calculate capabilities score", () => {
      const request1 = {
        intent: "route",
        location: { geoHash: "s0m3h4" },
        capabilities: { text: true, voice: true, location: true },
      };
      const request2 = {
        intent: "route",
        location: { geoHash: "s0m3h4" },
        capabilities: { text: true, voice: true, location: true },
      };

      const score = matchingService.calculateScore(request1, request2);

      expect(score.capabilities).toBe(20); // All capabilities match
    });
  });

  describe("createOffer", () => {
    it("should create an offer", () => {
      const participants: Participant[] = [
        {
          handle: "User1",
          score: 90,
          capabilities: { text: true, voice: false, location: true },
        },
        {
          handle: "User2",
          score: 90,
          capabilities: { text: true, voice: false, location: true },
        },
      ];

      const offerRequest: OfferRequest = {
        matchId: "test-match-id",
        participants,
        score: {
          total: 90,
          intent: 40,
          location: 30,
          capabilities: 20,
        },
      };

      const offer = matchingService.createOffer(offerRequest);

      expect(offer).toHaveProperty("offerId");
      expect(offer).toHaveProperty("expiresAt");
    });
  });

  describe("acceptOffer", () => {
    it("should accept a valid offer", () => {
      const participants: Participant[] = [
        {
          handle: "User1",
          score: 90,
          capabilities: { text: true, voice: false, location: true },
        },
        {
          handle: "User2",
          score: 90,
          capabilities: { text: true, voice: false, location: true },
        },
      ];

      const offerRequest: OfferRequest = {
        matchId: "test-match-id",
        participants,
        score: {
          total: 90,
          intent: 40,
          location: 30,
          capabilities: 20,
        },
      };

      const offer = matchingService.createOffer(offerRequest);
      const result = matchingService.acceptOffer(offer.offerId);

      expect(result.status).toBe("accepted");
      expect(result.channelId).toBeTruthy();
    });

    it("should throw error for non-existent offer", () => {
      expect(() => {
        matchingService.acceptOffer("non-existent-offer-id");
      }).toThrow("Offer not found");
    });
  });

  describe("declineOffer", () => {
    it("should decline a valid offer", () => {
      const participants: Participant[] = [
        {
          handle: "User1",
          score: 90,
          capabilities: { text: true, voice: false, location: true },
        },
        {
          handle: "User2",
          score: 90,
          capabilities: { text: true, voice: false, location: true },
        },
      ];

      const offerRequest: OfferRequest = {
        matchId: "test-match-id",
        participants,
        score: {
          total: 90,
          intent: 40,
          location: 30,
          capabilities: 20,
        },
      };

      const offer = matchingService.createOffer(offerRequest);
      const result = matchingService.declineOffer(offer.offerId);

      expect(result.status).toBe("declined");
      expect(result.channelId).toBeNull();
    });
  });
});

