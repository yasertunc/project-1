import {
  MatchRequest,
  CancelRequest,
  MessageRequest,
  Capabilities,
} from "../types";

export interface WebSocketMessage {
  type: string;
  payload?: unknown;
  requestId?: string;
}

// Client → Server Events
export interface ClientEvents {
  enqueue: { payload: MatchRequest };
  cancel: { payload: CancelRequest };
  accept_offer: { payload: { offerId: string } };
  decline_offer: { payload: { offerId: string } };
  send_message: { payload: { channelId: string; message: MessageRequest } };
  close_channel: { payload: { channelId: string } };
}

// Server → Client Events
export interface ServerEvents {
  queue_update: {
    payload: {
      matchId: string;
      queuePosition: number;
      estimatedWaitTime: number;
    };
  };
  offer_received: {
    payload: {
      offerId: string;
      matchId: string;
      participants: Array<{
        handle: string;
        score: number;
        capabilities: Capabilities;
      }>;
      score: {
        total: number;
        intent: number;
        location: number;
        capabilities: number;
      };
      expiresAt: string;
    };
  };
  offer_timeout: { payload: { offerId: string } };
  match_found: {
    payload: {
      matchId: string;
      channelId: string;
      participants: Array<{
        handle: string;
        capabilities: Capabilities;
      }>;
    };
  };
  match_declined: { payload: { offerId: string } };
  channel_opened: {
    payload: {
      channelId: string;
      participants: Array<{
        handle: string;
        capabilities: Capabilities;
      }>;
      expiresAt: string;
    };
  };
  message_received: {
    payload: {
      channelId: string;
      message: {
        messageId: string;
        from: string;
        text: string;
        type: string;
        timestamp: string;
      };
    };
  };
  channel_closed: { payload: { channelId: string } };
  error: {
    payload: {
      code: string;
      message: string;
      details?: unknown;
    };
  };
}

export type ClientEventType = keyof ClientEvents;
export type ServerEventType = keyof ServerEvents;

