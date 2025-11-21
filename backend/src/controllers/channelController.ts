import { Request, Response, NextFunction } from "express";
import { channelService } from "../services/channelService";
import { MessageRequest } from "../types";
import { ApiError } from "../middleware/errorHandler";
import { ERROR_CODES } from "../config/constants";

export class ChannelController {
  /**
   * POST /v1/channel/:channelId/open
   */
  async open(req: Request, res: Response, next: NextFunction) {
    try {
      const { channelId } = req.params;
      const channel = channelService.openChannel(channelId);

      if (!channel) {
        const error: ApiError = new Error("Channel not found or closed");
        error.statusCode = 404;
        error.code = ERROR_CODES.NOT_FOUND;
        throw error;
      }

      res.json(channel);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /v1/channel/:channelId/messages
   */
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { channelId } = req.params;
      const from = req.headers["x-user-handle"] as string; // TODO: Get from auth token
      const messageRequest = req.body as MessageRequest;

      if (!from) {
        const error: ApiError = new Error("User handle is required");
        error.statusCode = 401;
        error.code = ERROR_CODES.UNAUTHORIZED;
        throw error;
      }

      const result = channelService.sendMessage(
        channelId,
        from,
        messageRequest
      );
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Channel not found") {
          const apiError: ApiError = error;
          apiError.statusCode = 404;
          apiError.code = ERROR_CODES.NOT_FOUND;
          next(apiError);
        } else if (
          error.message === "Channel is closed" ||
          error.message === "Channel expired"
        ) {
          const apiError: ApiError = error;
          apiError.statusCode = 409;
          apiError.code = ERROR_CODES.CHANNEL_CLOSED;
          next(apiError);
        } else {
          next(error);
        }
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /v1/channel/:channelId/messages
   */
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { channelId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const before = req.query.before as string | undefined;

      const messages = channelService.getMessages(channelId, limit, before);

      if (!messages) {
        const error: ApiError = new Error("Channel not found or closed");
        error.statusCode = 404;
        error.code = ERROR_CODES.NOT_FOUND;
        throw error;
      }

      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /v1/channel/:channelId/close
   */
  async close(req: Request, res: Response, next: NextFunction) {
    try {
      const { channelId } = req.params;
      channelService.closeChannel(channelId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Channel not found") {
        const apiError: ApiError = error;
        apiError.statusCode = 404;
        apiError.code = ERROR_CODES.NOT_FOUND;
        next(apiError);
      } else {
        next(error);
      }
    }
  }
}

export const channelController = new ChannelController();
