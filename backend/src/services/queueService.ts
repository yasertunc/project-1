import { v4 as uuidv4 } from "uuid";
import { MatchRequest, QueueSlot, MatchStatusResponse } from "../types";
import { MatchStatus, Intent } from "../config/constants";
import { config } from "../config/env";
import { logger } from "../utils/logger";

interface QueuedMatch {
  matchId: string;
  request: MatchRequest;
  queuedAt: Date;
  expiresAt: Date;
  status: MatchStatus;
}

// In-memory storage (will be replaced with Redis in production)
const matchQueue = new Map<string, QueuedMatch>();
const queuesByIntent = new Map<Intent, QueuedMatch[]>();

export class QueueService {
  /**
   * Enqueue a match request
   */
  enqueue(request: MatchRequest): QueueSlot {
    // Check queue size limit
    if (matchQueue.size >= config.matching.maxQueueSize) {
      throw new Error("Queue is full");
    }

    const matchId = uuidv4();
    const queuedAt = new Date();
    const expiresAt = new Date(queuedAt.getTime() + config.matching.timeout);

    const queuedMatch: QueuedMatch = {
      matchId,
      request,
      queuedAt,
      expiresAt,
      status: "queued",
    };

    matchQueue.set(matchId, queuedMatch);

    // Add to intent-specific queue
    if (!queuesByIntent.has(request.intent)) {
      queuesByIntent.set(request.intent, []);
    }
    queuesByIntent.get(request.intent)!.push(queuedMatch);

    const queuePosition = this.getQueuePosition(matchId, request.intent);
    const estimatedWaitTime = this.estimateWaitTime(request.intent);

    logger.info("Match enqueued", {
      matchId,
      intent: request.intent,
      queuePosition,
    });

    return {
      matchId,
      queuePosition,
      estimatedWaitTime,
    };
  }

  /**
   * Cancel a match request
   */
  cancel(matchId: string): void {
    const match = matchQueue.get(matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    if (match.status !== "queued") {
      throw new Error("Match cannot be cancelled");
    }

    match.status = "cancelled";

    // Remove from intent-specific queue
    const intentQueue = queuesByIntent.get(match.request.intent);
    if (intentQueue) {
      const index = intentQueue.findIndex((m) => m.matchId === matchId);
      if (index !== -1) {
        intentQueue.splice(index, 1);
      }
    }

    // Keep match in queue with cancelled status so getStatus() can retrieve it
    // It will be cleaned up by the expiration cleanup process

    logger.info("Match cancelled", { matchId });
  }

  /**
   * Get match status
   */
  getStatus(matchId: string): MatchStatusResponse | null {
    const match = matchQueue.get(matchId);
    if (!match) {
      return null;
    }

    // Check if expired
    if (new Date() > match.expiresAt && match.status === "queued") {
      match.status = "expired";
      matchQueue.delete(matchId);
    }

    const queuePosition =
      match.status === "queued"
        ? this.getQueuePosition(matchId, match.request.intent)
        : null;

    return {
      matchId,
      status: match.status,
      queuePosition,
      matchedAt:
        match.status === "matched" ? match.expiresAt.toISOString() : null,
      participants: null, // Will be populated when matched
    };
  }

  /**
   * Get queue position for a match
   */
  private getQueuePosition(matchId: string, intent: Intent): number {
    const intentQueue = queuesByIntent.get(intent) || [];
    const index = intentQueue.findIndex((m) => m.matchId === matchId);
    return index !== -1 ? index + 1 : 0;
  }

  /**
   * Estimate wait time based on queue length
   */
  private estimateWaitTime(intent: Intent): number {
    const intentQueue = queuesByIntent.get(intent) || [];
    // Rough estimate: 30 seconds per person in queue
    return intentQueue.length * 30;
  }

  /**
   * Get next match from queue for matching
   */
  getNextMatch(intent: Intent): QueuedMatch | null {
    const intentQueue = queuesByIntent.get(intent) || [];
    return intentQueue.find((m) => m.status === "queued") || null;
  }

  /**
   * Get all queued matches for an intent (for matching engine)
   */
  getQueuedMatches(intent: Intent): QueuedMatch[] {
    const intentQueue = queuesByIntent.get(intent) || [];
    return intentQueue.filter((m) => m.status === "queued");
  }

  /**
   * Get total queue depth across all intents
   */
  getTotalQueueDepth(): number {
    return matchQueue.size;
  }

  /**
   * Mark match as matched
   */
  markMatched(matchId: string): void {
    const match = matchQueue.get(matchId);
    if (match) {
      match.status = "matched";
    }
  }

  /**
   * Clean up expired matches
   */
  cleanupExpired(): void {
    const now = new Date();
    for (const [matchId, match] of matchQueue.entries()) {
      if (now > match.expiresAt && match.status === "queued") {
        match.status = "expired";
        matchQueue.delete(matchId);

        const intentQueue = queuesByIntent.get(match.request.intent);
        if (intentQueue) {
          const index = intentQueue.findIndex((m) => m.matchId === matchId);
          if (index !== -1) {
            intentQueue.splice(index, 1);
          }
        }

        logger.info("Match expired", { matchId });
      }
    }
  }
}

export const queueService = new QueueService();

// Cleanup expired matches every minute
setInterval(() => {
  queueService.cleanupExpired();
}, 60000);
