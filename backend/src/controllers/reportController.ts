import { Request, Response, NextFunction } from "express";
import { ReportRequest, ReportResponse } from "../types";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";

// In-memory storage (will be replaced with database in production)
const reports = new Map<
  string,
  ReportRequest & { reportId: string; createdAt: Date }
>();

export class ReportController {
  /**
   * POST /v1/report
   */
  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const reportRequest = req.body as ReportRequest;
      const reportId = uuidv4();

      reports.set(reportId, {
        ...reportRequest,
        reportId,
        createdAt: new Date(),
      });

      logger.info("Report created", {
        reportId,
        channelId: reportRequest.channelId,
        reason: reportRequest.reason,
      });

      const response: ReportResponse = { reportId };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
