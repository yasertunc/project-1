import express, { Express } from "express";
import cors from "cors";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { generalRateLimiter } from "./middleware/rateLimiter";
import matchRoutes from "./routes/match";
import channelRoutes from "./routes/channel";
import reportRoutes from "./routes/report";
import pushRoutes from "./routes/push";

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next();
  });

  // Health check (no rate limiting)
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Apply general rate limiting to all API routes
  app.use("/v1", generalRateLimiter);

  // API routes
  app.use("/v1/match", matchRoutes);
  app.use("/v1/channel", channelRoutes);
  app.use("/v1/report", reportRoutes);
  app.use("/v1/push", pushRoutes);

  // Error handling
  app.use(errorHandler);

  return app;
}
