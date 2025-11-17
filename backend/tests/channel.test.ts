import { describe, it, expect } from "vitest";
import { channelService } from "../src/services/channelService";
import type { Participant, MessageRequest } from "../src/types";

describe("Channel Service", () => {
  describe("createChannel", () => {
    it("should create a new channel", () => {
      const participants: Participant[] = [
        {
          handle: "User1",
          score: 80,
          capabilities: {
            text: true,
            voice: false,
            location: true,
          },
        },
        {
          handle: "User2",
          score: 80,
          capabilities: {
            text: true,
            voice: true,
            location: false,
          },
        },
      ];

      const channel = channelService.createChannel(participants);

      expect(channel).toHaveProperty("channelId");
      expect(channel).toHaveProperty("participants");
      expect(channel).toHaveProperty("expiresAt");
      expect(channel.participants).toHaveLength(2);
    });
  });

  describe("sendMessage", () => {
    it("should send a message to a channel", () => {
      const participants: Participant[] = [
        {
          handle: "User1",
          score: 80,
          capabilities: {
            text: true,
            voice: false,
            location: true,
          },
        },
        {
          handle: "User2",
          score: 80,
          capabilities: {
            text: true,
            voice: true,
            location: false,
          },
        },
      ];

      const channel = channelService.createChannel(participants);
      const messageRequest: MessageRequest = {
        text: "Hello!",
        type: "text",
      };

      const result = channelService.sendMessage(
        channel.channelId,
        "User1",
        messageRequest
      );

      expect(result).toHaveProperty("messageId");
      expect(result).toHaveProperty("timestamp");
    });

    it("should throw error when sending to non-existent channel", () => {
      const messageRequest: MessageRequest = {
        text: "Hello!",
        type: "text",
      };

      expect(() => {
        channelService.sendMessage("non-existent-id", "User1", messageRequest);
      }).toThrow("Channel not found");
    });
  });

  describe("getMessages", () => {
    it("should retrieve messages from a channel", () => {
      const participants: Participant[] = [
        {
          handle: "User1",
          score: 80,
          capabilities: {
            text: true,
            voice: false,
            location: true,
          },
        },
        {
          handle: "User2",
          score: 80,
          capabilities: {
            text: true,
            voice: true,
            location: false,
          },
        },
      ];

      const channel = channelService.createChannel(participants);

      // Send a message
      channelService.sendMessage(channel.channelId, "User1", {
        text: "Hello!",
        type: "text",
      });

      const messages = channelService.getMessages(channel.channelId);

      expect(messages).not.toBeNull();
      expect(messages?.messages).toHaveLength(1);
      expect(messages?.messages[0].text).toBe("Hello!");
    });
  });

  describe("closeChannel", () => {
    it("should close a channel", () => {
      const participants: Participant[] = [
        {
          handle: "User1",
          score: 80,
          capabilities: {
            text: true,
            voice: false,
            location: true,
          },
        },
      ];

      const channel = channelService.createChannel(participants);
      channelService.closeChannel(channel.channelId);

      const openedChannel = channelService.openChannel(channel.channelId);
      expect(openedChannel).toBeNull();
    });
  });
});

