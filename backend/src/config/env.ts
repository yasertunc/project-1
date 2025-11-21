import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "fellowus-4ceb8",
    serviceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "",
  },
  rateLimit: {
    enqueue: parseInt(process.env.RATE_LIMIT_ENQUEUE || "10", 10),
    messages: parseInt(process.env.RATE_LIMIT_MESSAGES || "60", 10),
    reports: parseInt(process.env.RATE_LIMIT_REPORTS || "5", 10),
  },
  matching: {
    timeout: parseInt(process.env.MATCH_TIMEOUT || "300000", 10), // 5 minutes
    maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE || "1000", 10),
    channelExpiration: parseInt(
      process.env.CHANNEL_EXPIRATION || "86400000",
      10
    ), // 24 hours
  },
  api: {
    baseUrl: process.env.API_BASE_URL || "http://localhost:3000",
    apiVersion: process.env.API_VERSION || "v2",
  },
} as const;

