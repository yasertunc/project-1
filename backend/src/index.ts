import { createApp } from "./app";
import { config } from "./config/env";
import { logger } from "./utils/logger";
import { createWebSocketServer } from "./websocket/server";
import { initializeFirebase } from "./services/pushService";

const app = createApp();

// Initialize Firebase (if service account key is provided)
if (config.firebase.serviceAccountKey) {
  try {
    initializeFirebase();
  } catch (error) {
    logger.warn("Firebase initialization failed, push notifications disabled", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
} else {
  logger.warn("Firebase service account key not provided, push notifications disabled");
}

const server = app.listen(config.server.port, () => {
  logger.info(`Server running on port ${config.server.port}`, {
    nodeEnv: config.server.nodeEnv,
    port: config.server.port,
  });
});

// Create WebSocket server
createWebSocketServer(server);

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

