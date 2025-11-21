import * as admin from "firebase-admin";
import { config } from "../config/env";
import { logger } from "../utils/logger";

// Firebase Admin SDK initialization
let firebaseApp: admin.app.App | null = null;

export function initializeFirebase(): void {
  if (firebaseApp) {
    logger.warn("Firebase already initialized");
    return;
  }

  try {
    // Initialize Firebase Admin SDK
    // Option 1: Service account key file
    if (config.firebase.serviceAccountKey) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const serviceAccount = require(config.firebase.serviceAccountKey);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: config.firebase.projectId,
      });
    } else {
      // Option 2: Environment variables (for production)
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: config.firebase.projectId,
      });
    }

    logger.info("Firebase Admin SDK initialized", {
      projectId: config.firebase.projectId,
    });
  } catch (error) {
    logger.error("Failed to initialize Firebase Admin SDK", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

// In-memory storage for push tokens (will be replaced with database in production)
const pushTokens = new Map<
  string,
  {
    token: string;
    platform: "android" | "ios";
    userId?: string;
    createdAt: Date;
    lastUsed: Date;
  }
>();

export class PushService {
  /**
   * Reset all tokens (for testing purposes)
   */
  reset(): void {
    pushTokens.clear();
  }
  /**
   * Register a push token for a user
   */
  registerToken(
    token: string,
    platform: "android" | "ios",
    userId?: string
  ): void {
    pushTokens.set(token, {
      token,
      platform,
      userId,
      createdAt: new Date(),
      lastUsed: new Date(),
    });

    logger.info("Push token registered", { token, platform, userId });
  }

  /**
   * Unregister a push token
   */
  unregisterToken(token: string): void {
    pushTokens.delete(token);
    logger.info("Push token unregistered", { token });
  }

  /**
   * Send push notification to a single token
   */
  async sendToToken(
    token: string,
    notification: {
      title: string;
      body: string;
      data?: Record<string, string>;
    }
  ): Promise<boolean> {
    if (!firebaseApp) {
      logger.error("Firebase not initialized");
      return false;
    }

    const tokenData = pushTokens.get(token);
    if (!tokenData) {
      logger.warn("Token not found", { token });
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        android: {
          priority: "high" as const,
        },
        apns: {
          headers: {
            "apns-priority": "10",
          },
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      tokenData.lastUsed = new Date();

      logger.info("Push notification sent", {
        token,
        messageId: response,
      });

      return true;
    } catch (error) {
      logger.error("Failed to send push notification", {
        error: error instanceof Error ? error.message : String(error),
        token,
      });

      // Handle invalid token
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "messaging/invalid-registration-token"
      ) {
        pushTokens.delete(token);
      }

      return false;
    }
  }

  /**
   * Send push notification to multiple tokens
   */
  async sendToTokens(
    tokens: string[],
    notification: {
      title: string;
      body: string;
      data?: Record<string, string>;
    }
  ): Promise<{ success: number; failure: number }> {
    if (!firebaseApp) {
      logger.error("Firebase not initialized");
      return { success: 0, failure: tokens.length };
    }

    if (tokens.length === 0) {
      return { success: 0, failure: 0 };
    }

    try {
      const messages: admin.messaging.Message[] = tokens.map((token) => ({
        token,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        android: {
          priority: "high" as const,
        },
        apns: {
          headers: {
            "apns-priority": "10",
          },
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
        },
      }));

      const response = await admin.messaging().sendEach(messages);

      // Update last used timestamps
      for (const token of tokens) {
        const tokenData = pushTokens.get(token);
        if (tokenData) {
          tokenData.lastUsed = new Date();
        }
      }

      // Remove invalid tokens
      response.responses.forEach((resp, index) => {
        if (
          !resp.success &&
          resp.error &&
          "code" in resp.error &&
          resp.error.code === "messaging/invalid-registration-token"
        ) {
          pushTokens.delete(tokens[index]);
        }
      });

      logger.info("Batch push notifications sent", {
        success: response.successCount,
        failure: response.failureCount,
      });

      return {
        success: response.successCount,
        failure: response.failureCount,
      };
    } catch (error) {
      logger.error("Failed to send batch push notifications", {
        error: error instanceof Error ? error.message : String(error),
      });
      return { success: 0, failure: tokens.length };
    }
  }

  /**
   * Send match offer notification
   */
  async sendMatchOffer(
    tokens: string[],
    offerId: string,
    matchId: string
  ): Promise<void> {
    await this.sendToTokens(tokens, {
      title: "New Match Offer",
      body: "You have a new match offer! Tap to view.",
      data: {
        type: "match_offer",
        offerId,
        matchId,
      },
    });
  }

  /**
   * Send message notification
   */
  async sendMessageNotification(
    token: string,
    channelId: string,
    senderHandle: string,
    messageText: string
  ): Promise<void> {
    await this.sendToToken(token, {
      title: `Message from ${senderHandle}`,
      body: messageText,
      data: {
        type: "message",
        channelId,
        senderHandle,
      },
    });
  }

  /**
   * Send channel opened notification
   */
  async sendChannelOpened(tokens: string[], channelId: string): Promise<void> {
    await this.sendToTokens(tokens, {
      title: "Channel Opened",
      body: "Your match is ready! Start chatting now.",
      data: {
        type: "channel_opened",
        channelId,
      },
    });
  }

  /**
   * Get tokens for a user (if userId is stored)
   */
  getTokensForUser(userId: string): string[] {
    const tokens: string[] = [];
    for (const [token, data] of pushTokens.entries()) {
      if (data.userId === userId) {
        tokens.push(token);
      }
    }
    return tokens;
  }
}

export const pushService = new PushService();
