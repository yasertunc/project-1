import { WebSocket } from "ws";
import { queueService } from "../services/queueService";
import { matchingService } from "../services/matchingService";
import { channelService } from "../services/channelService";
import {
  ClientEvents,
  ServerEvents,
  ClientEventType,
  ServerEventType,
} from "./types";
import { logger } from "../utils/logger";
import { ERROR_CODES } from "../config/constants";

interface WebSocketConnection {
  ws: WebSocket;
  matchId?: string;
  channelId?: string;
  userId?: string;
}

const connections = new Map<WebSocket, WebSocketConnection>();

export function sendToClient<T extends ServerEventType>(
  ws: WebSocket,
  type: T,
  payload: ServerEvents[T]["payload"]
) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type,
        payload,
      })
    );
  }
}

export function sendError(
  ws: WebSocket,
  code: string,
  message: string,
  details?: unknown
) {
  sendToClient(ws, "error", {
    code,
    message,
    details,
  });
}

export async function handleClientEvent(
  ws: WebSocket,
  event: { type: ClientEventType; payload: unknown; requestId?: string }
) {
  const conn = connections.get(ws) || { ws };
  connections.set(ws, conn);

  try {
    switch (event.type) {
      case "enqueue": {
        const payload = event.payload as ClientEvents["enqueue"]["payload"];
        const queueSlot = queueService.enqueue(payload);
        conn.matchId = queueSlot.matchId;

        sendToClient(ws, "queue_update", {
          matchId: queueSlot.matchId,
          queuePosition: queueSlot.queuePosition,
          estimatedWaitTime: queueSlot.estimatedWaitTime,
        });

        // TODO: Trigger matching algorithm to find potential matches
        break;
      }

      case "cancel": {
        const payload = event.payload as ClientEvents["cancel"]["payload"];
        queueService.cancel(payload.matchId);
        conn.matchId = undefined;
        break;
      }

      case "accept_offer": {
        const payload =
          event.payload as ClientEvents["accept_offer"]["payload"];
        const result = matchingService.acceptOffer(payload.offerId);

        if (result.status === "accepted" && result.channelId) {
          const channel = channelService.openChannel(result.channelId);
          if (channel) {
            conn.channelId = result.channelId;
            sendToClient(ws, "match_found", {
              matchId: payload.offerId, // TODO: Get actual matchId
              channelId: result.channelId,
              participants: channel.participants,
            });
          }
        }
        break;
      }

      case "decline_offer": {
        const payload =
          event.payload as ClientEvents["decline_offer"]["payload"];
        matchingService.declineOffer(payload.offerId);
        sendToClient(ws, "match_declined", {
          offerId: payload.offerId,
        });
        break;
      }

      case "send_message": {
        const payload =
          event.payload as ClientEvents["send_message"]["payload"];
        if (!conn.userId) {
          sendError(ws, ERROR_CODES.UNAUTHORIZED, "User ID required");
          return;
        }

        const result = channelService.sendMessage(
          payload.channelId,
          conn.userId,
          payload.message
        );

        // Broadcast message to all participants in the channel
        const channel = channelService.openChannel(payload.channelId);
        if (channel) {
          for (const [connection, connData] of connections.entries()) {
            if (connData.channelId === payload.channelId) {
              sendToClient(connection, "message_received", {
                channelId: payload.channelId,
                message: {
                  messageId: result.messageId,
                  from: conn.userId,
                  text: payload.message.text,
                  type: payload.message.type,
                  timestamp: result.timestamp,
                },
              });
            }
          }
        }
        break;
      }

      case "close_channel": {
        const payload =
          event.payload as ClientEvents["close_channel"]["payload"];
        channelService.closeChannel(payload.channelId);
        conn.channelId = undefined;

        // Notify all participants
        for (const [connection, connData] of connections.entries()) {
          if (connData.channelId === payload.channelId) {
            sendToClient(connection, "channel_closed", {
              channelId: payload.channelId,
            });
          }
        }
        break;
      }

      default:
        sendError(
          ws,
          ERROR_CODES.INVALID_REQUEST,
          `Unknown event type: ${event.type}`
        );
    }
  } catch (error) {
    logger.error("WebSocket event handler error", {
      error: error instanceof Error ? error.message : String(error),
      eventType: event.type,
    });

    if (error instanceof Error) {
      sendError(ws, ERROR_CODES.INTERNAL_ERROR, error.message, error.stack);
    } else {
      sendError(ws, ERROR_CODES.INTERNAL_ERROR, "Internal server error");
    }
  }
}

export function handleConnection(ws: WebSocket) {
  logger.info("WebSocket connection established");

  connections.set(ws, { ws });

  ws.on("message", (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      handleClientEvent(ws, message);
    } catch (error) {
      logger.error("WebSocket message parse error", {
        error: error instanceof Error ? error.message : String(error),
      });
      sendError(ws, ERROR_CODES.INVALID_REQUEST, "Invalid message format");
    }
  });

  ws.on("close", () => {
    logger.info("WebSocket connection closed");
    connections.delete(ws);
  });

  ws.on("error", (error) => {
    logger.error("WebSocket error", {
      error: error.message,
    });
    connections.delete(ws);
  });
}

export function broadcastToMatch(
  matchId: string,
  event: ServerEventType,
  payload: ServerEvents[ServerEventType]["payload"]
) {
  for (const [ws, conn] of connections.entries()) {
    if (conn.matchId === matchId) {
      sendToClient(ws, event, payload);
    }
  }
}

export function broadcastToChannel(
  channelId: string,
  event: ServerEventType,
  payload: ServerEvents[ServerEventType]["payload"]
) {
  for (const [ws, conn] of connections.entries()) {
    if (conn.channelId === channelId) {
      sendToClient(ws, event, payload);
    }
  }
}
