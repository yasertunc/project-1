import { queueService } from "./queueService";
import { matchingService } from "./matchingService";
import { broadcastToMatch } from "../websocket/handlers";
import { MatchRequest, Participant, MatchScore } from "../types";
import { Intent } from "../config/constants";
import { logger } from "../utils/logger";

interface QueuedMatch {
  matchId: string;
  request: MatchRequest;
  queuedAt: Date;
}

/**
 * Matching Engine - Finds and creates matches between queued users
 */
export class MatchingEngine {
  /**
   * Process matching tick - finds potential matches and creates offers
   */
  async processTick(): Promise<{
    matchedCount: number;
    expandedCount: number;
    queueDepth: number;
  }> {
    let matchedCount = 0;
    let expandedCount = 0;
    const queueDepth = this.getTotalQueueDepth();

    // Process each intent queue
    for (const intent of ["route", "incident", "social", "coach"] as Intent[]) {
      const matches = this.findMatches(intent);
      expandedCount += matches.length;

      for (const match of matches) {
        try {
          await this.createMatchOffer(match);
          matchedCount++;
        } catch (error) {
          logger.error("Failed to create match offer", {
            error: error instanceof Error ? error.message : String(error),
            match,
          });
        }
      }
    }

    logger.info("Matching tick processed", {
      matchedCount,
      expandedCount,
      queueDepth,
    });

    return {
      matchedCount,
      expandedCount,
      queueDepth,
    };
  }

  /**
   * Find potential matches for a given intent
   */
  private findMatches(intent: Intent): Array<{
    match1: QueuedMatch;
    match2: QueuedMatch;
    score: MatchScore;
  }> {
    const matches: Array<{
      match1: QueuedMatch;
      match2: QueuedMatch;
      score: MatchScore;
    }> = [];

    // Get all queued matches for this intent
    const queuedMatches = this.getQueuedMatches(intent);

    // Try to match each pair
    for (let i = 0; i < queuedMatches.length; i++) {
      for (let j = i + 1; j < queuedMatches.length; j++) {
        const match1 = queuedMatches[i];
        const match2 = queuedMatches[j];

        // Calculate compatibility score
        const score = matchingService.calculateScore(
          match1.request,
          match2.request
        );

        // Only consider matches with minimum score threshold
        if (score.total >= 50) {
          matches.push({ match1, match2, score });
        }
      }
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.score.total - a.score.total);

    // Remove duplicates and return top matches
    const uniqueMatches = this.removeDuplicateMatches(matches);
    return uniqueMatches.slice(0, 10); // Limit to top 10 matches per tick
  }

  /**
   * Get queued matches for an intent
   */
  private getQueuedMatches(intent: Intent): QueuedMatch[] {
    return queueService.getQueuedMatches(intent);
  }

  /**
   * Remove duplicate matches (same pair in different order)
   */
  private removeDuplicateMatches(
    matches: Array<{
      match1: QueuedMatch;
      match2: QueuedMatch;
      score: MatchScore;
    }>
  ): Array<{
    match1: QueuedMatch;
    match2: QueuedMatch;
    score: MatchScore;
  }> {
    const seen = new Set<string>();
    const unique: Array<{
      match1: QueuedMatch;
      match2: QueuedMatch;
      score: MatchScore;
    }> = [];

    for (const match of matches) {
      const key1 = `${match.match1.matchId}-${match.match2.matchId}`;
      const key2 = `${match.match2.matchId}-${match.match1.matchId}`;

      if (!seen.has(key1) && !seen.has(key2)) {
        seen.add(key1);
        seen.add(key2);
        unique.push(match);
      }
    }

    return unique;
  }

  /**
   * Create a match offer for two users
   */
  private async createMatchOffer(match: {
    match1: QueuedMatch;
    match2: QueuedMatch;
    score: MatchScore;
  }): Promise<void> {
    // Generate handles for participants
    const handle1 = this.generateHandle();
    const handle2 = this.generateHandle();

    const participants: Participant[] = [
      {
        handle: handle1,
        score: match.score.total,
        capabilities: match.match1.request.capabilities,
      },
      {
        handle: handle2,
        score: match.score.total,
        capabilities: match.match2.request.capabilities,
      },
    ];

    // Create offer
    const offer = matchingService.createOffer({
      matchId: match.match1.matchId, // Use first match ID as primary
      participants,
      score: match.score,
    });

    // Broadcast offer to both users via WebSocket
    broadcastToMatch(match.match1.matchId, "offer_received", {
      offerId: offer.offerId,
      matchId: match.match1.matchId,
      participants,
      score: match.score,
      expiresAt: offer.expiresAt,
    });

    broadcastToMatch(match.match2.matchId, "offer_received", {
      offerId: offer.offerId,
      matchId: match.match2.matchId,
      participants,
      score: match.score,
      expiresAt: offer.expiresAt,
    });

    // Send push notifications (if tokens are registered)
    // TODO: Get tokens from user IDs when user system is implemented
    // For now, push notifications will be sent when tokens are available
  }

  /**
   * Generate a random handle for a user
   */
  private generateHandle(): string {
    const adjectives = [
      "Swift",
      "Brave",
      "Calm",
      "Bright",
      "Wise",
      "Kind",
      "Bold",
      "Gentle",
    ];
    const nouns = [
      "Traveler",
      "Explorer",
      "Guide",
      "Friend",
      "Companion",
      "Helper",
      "Pilot",
      "Navigator",
    ];

    const adjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);

    return `${adjective}${noun}${number}`;
  }

  /**
   * Get total queue depth across all intents
   */
  private getTotalQueueDepth(): number {
    return queueService.getTotalQueueDepth();
  }
}

export const matchingEngine = new MatchingEngine();

