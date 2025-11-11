import { EventBus } from "../../../utils/EventBus";

export type WSInbound =
  | { type: "connected" }
  | {
      type: "offer";
      matchId: string;
      participants: string[];
      score: number;
    }
  | { type: "channelOpen"; channelId: string }
  | { type: "error"; code: string; message?: string };

export type WSOutbound =
  | { type: "ackOffer"; matchId: string }
  | { type: "close" };

export class MockWebSocketTransport {
  private bus = new EventBus<WSInbound>();
  private connected = false;
  private timers: Array<ReturnType<typeof setTimeout>> = [];

  connect() {
    if (this.connected) return;
    this.connected = true;

    const connectedTimer = setTimeout(
      () => this.bus.emit({ type: "connected" }),
      50,
    );
    this.timers.push(connectedTimer);

    const offerTimer = setTimeout(() => {
      this.bus.emit({
        type: "offer",
        matchId: "m_ws_1",
        participants: ["u_demo", "u_peer"],
        score: 0.84,
      });
    }, 300);
    this.timers.push(offerTimer);
  }

  send(message: WSOutbound) {
    if (!this.connected) return;

    if (message.type === "ackOffer") {
      const ackTimer = setTimeout(() => {
        if (!this.connected) return;
        this.bus.emit({ type: "channelOpen", channelId: "ch_ws_1" });
      }, 350);
      this.timers.push(ackTimer);
    }

    if (message.type === "close") {
      this.close();
    }
  }

  on(listener: (event: WSInbound) => void) {
    return this.bus.on(listener);
  }

  close() {
    if (!this.connected) return;
    this.connected = false;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.bus.clear();
  }
}
