import { Request, Response, NextFunction } from "express";
import { queueService } from "../services/queueService";
import { matchingService } from "../services/matchingService";
import { MatchRequest, CancelRequest, OfferRequest } from "../types";
import { ApiError } from "../middleware/errorHandler";
import { ERROR_CODES } from "../config/constants";

export class MatchController {
  /**
   * POST /v1/match/enqueue
   */
  async enqueue(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as MatchRequest;
      const queueSlot = queueService.enqueue(request);
      res.status(202).json(queueSlot);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /v1/match/cancel
   */
  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.body as CancelRequest;
      if (!matchId) {
        const error: ApiError = new Error("matchId is required");
        error.statusCode = 400;
        error.code = ERROR_CODES.INVALID_REQUEST;
        throw error;
      }

      queueService.cancel(matchId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Match not found") {
        const apiError: ApiError = error;
        apiError.statusCode = 404;
        apiError.code = ERROR_CODES.NOT_FOUND;
        next(apiError);
      } else if (
        error instanceof Error &&
        error.message === "Match cannot be cancelled"
      ) {
        const apiError: ApiError = error;
        apiError.statusCode = 409;
        apiError.code = ERROR_CODES.INVALID_REQUEST;
        next(apiError);
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /v1/match/:matchId/status
   */
  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.params;
      const status = queueService.getStatus(matchId);

      if (!status) {
        const error: ApiError = new Error("Match not found");
        error.statusCode = 404;
        error.code = ERROR_CODES.NOT_FOUND;
        throw error;
      }

      res.json(status);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /v1/match/offer
   */
  async sendOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const offerRequest = req.body as OfferRequest;
      const offer = matchingService.createOffer(offerRequest);
      res.json(offer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /v1/match/offer/:offerId/accept
   */
  async acceptOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { offerId } = req.params;
      const result = matchingService.acceptOffer(offerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /v1/match/offer/:offerId/decline
   */
  async declineOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { offerId } = req.params;
      const result = matchingService.declineOffer(offerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const matchController = new MatchController();
