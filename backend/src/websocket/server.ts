import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { handleConnection } from "./handlers";
import { logger } from "../utils/logger";

let wss: WebSocketServer | null = null;

export function createWebSocketServer(httpServer: Server): WebSocketServer {
  wss = new WebSocketServer({
    server: httpServer,
    path: "/v1/ws",
  });

  wss.on("connection", (ws: WebSocket) => {
    handleConnection(ws);
  });

  wss.on("error", (error) => {
    logger.error("WebSocket server error", {
      error: error.message,
    });
  });

  logger.info("WebSocket server started on /v1/ws");

  return wss;
}

export function getWebSocketServer(): WebSocketServer | null {
  return wss;
}
