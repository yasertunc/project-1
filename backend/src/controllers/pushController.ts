import { Request, Response, NextFunction } from "express";
import { pushService } from "../services/pushService";
import { ApiError } from "../middleware/errorHandler";
import { ERROR_CODES } from "../config/constants";

export class PushController {
  /**
   * POST /v1/push/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, platform, userId } = req.body;

      if (!token || !platform) {
        const error: ApiError = new Error("token and platform are required");
        error.statusCode = 400;
        error.code = ERROR_CODES.INVALID_REQUEST;
        throw error;
      }

      if (platform !== "android" && platform !== "ios") {
        const error: ApiError = new Error("platform must be 'android' or 'ios'");
        error.statusCode = 400;
        error.code = ERROR_CODES.INVALID_REQUEST;
        throw error;
      }

      pushService.registerToken(token, platform, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /v1/push/unregister
   */
  async unregister(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      if (!token) {
        const error: ApiError = new Error("token is required");
        error.statusCode = 400;
        error.code = ERROR_CODES.INVALID_REQUEST;
        throw error;
      }

      pushService.unregisterToken(token);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const pushController = new PushController();

