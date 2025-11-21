import { v4 as uuidv4 } from "uuid";
import {
  Participant,
  ChannelResponse,
  MessageRequest,
  Message,
  MessagesResponse,
  Capabilities,
} from "../types";
import { config } from "../config/env";
import { logger } from "../utils/logger";

interface Channel {
  channelId: string;
  participants: Array<{
    handle: string;
    capabilities: Capabilities;
  }>;
  messages: Message[];
  createdAt: Date;
  expiresAt: Date;
  isClosed: boolean;
}

// In-memory storage (will be replaced with Redis in production)
const channels = new Map<string, Channel>();

export class ChannelService {
  /**
   * Create a new channel
   */
  createChannel(participants: Participant[]): ChannelResponse {
    const channelId = uuidv4();
    const createdAt = new Date();
    const expiresAt = new Date(
      createdAt.getTime() + config.matching.channelExpiration
    );

    const channel: Channel = {
      channelId,
      participants: participants.map((p) => ({
        handle: p.handle,
        capabilities: p.capabilities,
      })),
      messages: [],
      createdAt,
      expiresAt,
      isClosed: false,
    };

    channels.set(channelId, channel);

    logger.info("Channel created", {
      channelId,
      participantCount: participants.length,
    });

    return {
      channelId,
      participants: channel.participants,
      expiresAt: expiresAt.toISOString(),
    };
  }

  /**
   * Open a channel (get channel info)
   */
  openChannel(channelId: string): ChannelResponse | null {
    const channel = channels.get(channelId);
    if (!channel || channel.isClosed) {
      return null;
    }

    // Check expiration
    if (new Date() > channel.expiresAt) {
      channel.isClosed = true;
      channels.delete(channelId);
      return null;
    }

    return {
      channelId,
      participants: channel.participants,
      expiresAt: channel.expiresAt.toISOString(),
    };
  }

  /**
   * Send a message to a channel
   */
  sendMessage(
    channelId: string,
    from: string,
    messageRequest: MessageRequest
  ): { messageId: string; timestamp: string } {
    const channel = channels.get(channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }

    if (channel.isClosed) {
      throw new Error("Channel is closed");
    }

    if (new Date() > channel.expiresAt) {
      channel.isClosed = true;
      channels.delete(channelId);
      throw new Error("Channel expired");
    }

    // Verify sender is a participant
    const isParticipant = channel.participants.some((p) => p.handle === from);
    if (!isParticipant) {
      throw new Error("Not a participant");
    }

    const messageId = uuidv4();
    const timestamp = new Date().toISOString();

    const message: Message = {
      messageId,
      from,
      text: messageRequest.text,
      type: messageRequest.type,
      timestamp,
    };

    channel.messages.push(message);

    // Limit message count
    if (channel.messages.length > 1000) {
      channel.messages.shift();
    }

    logger.info("Message sent", { channelId, messageId, from });

    // Send push notification to other participants
    // TODO: Get push token for participant handle and send notifications
    // For now, push notifications will be sent when tokens are available
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _otherParticipants = channel.participants.filter(
      (p) => p.handle !== from
    );

    return { messageId, timestamp };
  }

  /**
   * Get messages from a channel
   */
  getMessages(
    channelId: string,
    limit: number = 50,
    before?: string
  ): MessagesResponse | null {
    const channel = channels.get(channelId);
    if (!channel || channel.isClosed) {
      return null;
    }

    let messages = [...channel.messages];

    // Filter by before message ID if provided
    if (before) {
      const beforeIndex = messages.findIndex((m) => m.messageId === before);
      if (beforeIndex !== -1) {
        messages = messages.slice(0, beforeIndex);
      }
    }

    // Limit results
    const limitedMessages = messages.slice(-limit);
    const hasMore = messages.length > limit;

    return {
      messages: limitedMessages,
      hasMore,
    };
  }

  /**
   * Close a channel
   */
  closeChannel(channelId: string): void {
    const channel = channels.get(channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }

    channel.isClosed = true;
    channels.delete(channelId);

    logger.info("Channel closed", { channelId });
  }

  /**
   * Clean up expired channels
   */
  cleanupExpired(): void {
    const now = new Date();
    for (const [channelId, channel] of channels.entries()) {
      if (now > channel.expiresAt) {
        channel.isClosed = true;
        channels.delete(channelId);
        logger.info("Channel expired", { channelId });
      }
    }
  }
}

export const channelService = new ChannelService();

// Cleanup expired channels every hour
setInterval(() => {
  channelService.cleanupExpired();
}, 3600000);
