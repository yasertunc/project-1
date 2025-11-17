import { describe, it, expect } from "vitest";
import { queueService } from "../../src/services/queueService";
import { matchingService } from "../../src/services/matchingService";
import { channelService } from "../../src/services/channelService";
import type { MatchRequest } from "../../src/types";

describe("Match Flow Integration", () => {
  it("should complete full match flow: enqueue -> offer -> accept -> channel", () => {
    // Step 1: Enqueue two match requests
    const request1: MatchRequest = {
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

    const request2: MatchRequest = {
      intent: "route",
      location: {
        geoHash: "s0m3h4sh",
        radius: 1000,
      },
      capabilities: {
        text: true,
        voice: true,
        location: true,
      },
      preferences: {
        maxWaitTime: 300,
        language: "en",
      },
    };

    const queueSlot1 = queueService.enqueue(request1);
    const queueSlot2 = queueService.enqueue(request2);

    expect(queueSlot1.matchId).toBeDefined();
    expect(queueSlot2.matchId).toBeDefined();

    // Step 2: Calculate match score
    const score = matchingService.calculateScore(request1, request2);
    expect(score.total).toBeGreaterThan(50); // Should match

    // Step 3: Create offer
    const offer = matchingService.createOffer({
      matchId: queueSlot1.matchId,
      participants: [
        {
          handle: "User1",
          score: score.total,
          capabilities: request1.capabilities,
        },
        {
          handle: "User2",
          score: score.total,
          capabilities: request2.capabilities,
        },
      ],
      score,
    });

    expect(offer.offerId).toBeDefined();
    expect(offer.expiresAt).toBeDefined();

    // Step 4: Accept offer
    const acceptResult = matchingService.acceptOffer(offer.offerId);
    expect(acceptResult.status).toBe("accepted");
    expect(acceptResult.channelId).toBeDefined();

    // Step 5: Verify channel was created
    const channel = channelService.openChannel(acceptResult.channelId!);
    expect(channel).not.toBeNull();
    expect(channel?.participants).toHaveLength(2);
  });
});

