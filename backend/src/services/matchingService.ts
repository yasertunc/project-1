import { v4 as uuidv4 } from "uuid";
import {
  OfferRequest,
  OfferResponse,
  OfferActionResponse,
  MatchScore,
  Participant,
  Capabilities,
} from "../types";
import { queueService } from "./queueService";
import { channelService } from "./channelService";
import { MATCHING_SCORES } from "../config/constants";
import { logger } from "../utils/logger";

interface Offer {
  offerId: string;
  matchId: string;
  participants: Participant[];
  score: MatchScore;
  expiresAt: Date;
  status: "pending" | "accepted" | "declined" | "expired";
}

// In-memory storage (will be replaced with Redis in production)
const offers = new Map<string, Offer>();

export class MatchingService {
  /**
   * Create a matching offer
   */
  createOffer(offerRequest: OfferRequest): OfferResponse {
    const offerId = uuidv4();
    const expiresAt = new Date(Date.now() + 30000); // 30 seconds

    const offer: Offer = {
      offerId,
      matchId: offerRequest.matchId,
      participants: offerRequest.participants,
      score: offerRequest.score,
      expiresAt,
      status: "pending",
    };

    offers.set(offerId, offer);

    // Cleanup expired offers
    setTimeout(() => {
      const storedOffer = offers.get(offerId);
      if (storedOffer && storedOffer.status === "pending") {
        storedOffer.status = "expired";
        offers.delete(offerId);
        logger.info("Offer expired", { offerId });
      }
    }, 30000);

    logger.info("Offer created", { offerId, matchId: offerRequest.matchId });

    return {
      offerId,
      expiresAt: expiresAt.toISOString(),
    };
  }

  /**
   * Accept an offer
   */
  acceptOffer(offerId: string): OfferActionResponse {
    const offer = offers.get(offerId);
    if (!offer) {
      throw new Error("Offer not found");
    }

    if (offer.status !== "pending") {
      throw new Error("Offer is not pending");
    }

    if (new Date() > offer.expiresAt) {
      offer.status = "expired";
      offers.delete(offerId);
      throw new Error("Offer expired");
    }

    offer.status = "accepted";

    // Mark match as matched
    queueService.markMatched(offer.matchId);

    // Create channel
    const channel = channelService.createChannel(offer.participants);

    logger.info("Offer accepted", { offerId, channelId: channel.channelId });

    return {
      status: "accepted",
      channelId: channel.channelId,
    };
  }

  /**
   * Decline an offer
   */
  declineOffer(offerId: string): OfferActionResponse {
    const offer = offers.get(offerId);
    if (!offer) {
      throw new Error("Offer not found");
    }

    if (offer.status !== "pending") {
      throw new Error("Offer is not pending");
    }

    offer.status = "declined";
    offers.delete(offerId);

    logger.info("Offer declined", { offerId });

    return {
      status: "declined",
      channelId: null,
    };
  }

  /**
   * Calculate match score
   */
  calculateScore(
    request1: {
      intent: string;
      location: { geoHash: string };
      capabilities: Capabilities;
    },
    request2: {
      intent: string;
      location: { geoHash: string };
      capabilities: Capabilities;
    }
  ): MatchScore {
    let intentScore = 0;
    let locationScore = 0;
    let capabilitiesScore = 0;

    // Intent match
    if (request1.intent === request2.intent) {
      intentScore = MATCHING_SCORES.INTENT;
    }

    // Location match (simple geohash prefix matching)
    const geoHash1 = request1.location.geoHash.substring(0, 6);
    const geoHash2 = request2.location.geoHash.substring(0, 6);
    if (geoHash1 === geoHash2) {
      locationScore = MATCHING_SCORES.LOCATION;
    } else if (geoHash1.substring(0, 5) === geoHash2.substring(0, 5)) {
      locationScore = MATCHING_SCORES.LOCATION * 0.7;
    } else if (geoHash1.substring(0, 4) === geoHash2.substring(0, 4)) {
      locationScore = MATCHING_SCORES.LOCATION * 0.4;
    }

    // Capabilities match
    const caps1 = request1.capabilities;
    const caps2 = request2.capabilities;
    const commonCapabilities = [
      caps1.text && caps2.text,
      caps1.voice && caps2.voice,
      caps1.location && caps2.location,
    ].filter(Boolean).length;
    if (commonCapabilities > 0) {
      capabilitiesScore =
        (commonCapabilities / 3) * MATCHING_SCORES.CAPABILITIES;
    }

    const total = intentScore + locationScore + capabilitiesScore;

    return {
      total,
      intent: intentScore,
      location: locationScore,
      capabilities: capabilitiesScore,
    };
  }
}

export const matchingService = new MatchingService();
