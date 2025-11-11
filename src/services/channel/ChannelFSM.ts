import { MockWebSocketTransport } from "./transport/MockWebSocket";
import { MockFCMTransport } from "./transport/MockFCM";

export type ChannelPhase =
  | "idle"
  | "offer_received"
  | "awaiting_ack"
  | "opening"
  | "open"
  | "declined"
  | "error";

export type ChannelContext = {
  matchId?: string;
  channelId?: string;
  participants?: string[];
  score?: number;
  errorCode?: string;
};

export type ChannelSnapshot = {
  phase: ChannelPhase;
  ctx: ChannelContext;
};

type Subscriber = (snapshot: ChannelSnapshot) => void;

export class ChannelFSM {
  private ws = new MockWebSocketTransport();
  private fcm = new MockFCMTransport();
  private subscriptions = new Set<Subscriber>();
  private snapshot: ChannelSnapshot = { phase: "idle", ctx: {} };
  private ackTimer?: ReturnType<typeof setTimeout>;
  private started = false;
  private teardown: Array<() => void> = [];

  subscribe(subscriber: Subscriber) {
    this.subscriptions.add(subscriber);
    subscriber(this.snapshot);
    return () => this.subscriptions.delete(subscriber);
  }

  getSnapshot() {
    return this.snapshot;
  }

  start() {
    if (this.started) return;
    this.started = true;

    const wsUnsub = this.ws.on((event) => {
      if (event.type === "offer") {
        this.receiveOffer(event.matchId, event.participants, event.score);
      } else if (event.type === "channelOpen") {
        this.toOpen(event.channelId);
      } else if (event.type === "error") {
        this.toError(event.code);
      }
    });

    const fcmUnsub = this.fcm.on((event) => {
      if (event.type === "pushOffer" && this.snapshot.phase === "idle") {
        this.receiveOffer(event.matchId, event.participants, event.score);
      } else if (event.type === "deliveryError") {
        this.toError(event.code);
      }
    });

    this.teardown.push(wsUnsub, fcmUnsub);
    this.ws.connect();
    this.fcm.subscribe();
  }

  dispose() {
    if (this.ackTimer) {
      clearTimeout(this.ackTimer);
    }
    this.teardown.forEach((fn) => fn());
    this.teardown = [];
    this.ws.close();
    this.fcm.tearDown();
    this.started = false;
    this.reset();
  }

  acceptOffer() {
    if (this.snapshot.phase !== "offer_received" || !this.snapshot.ctx.matchId)
      return;

    const { matchId } = this.snapshot.ctx;
    this.transition({ phase: "awaiting_ack", ctx: { ...this.snapshot.ctx } });

    this.ws.send({ type: "ackOffer", matchId });

    if (this.ackTimer) {
      clearTimeout(this.ackTimer);
    }
    this.ackTimer = setTimeout(() => {
      if (this.snapshot.phase === "awaiting_ack") {
        this.toError("ACK_TIMEOUT");
      }
    }, 5000);

    const openingTimer = setTimeout(() => {
      if (this.snapshot.phase === "awaiting_ack") {
        this.transition({
          phase: "opening",
          ctx: { ...this.snapshot.ctx },
        });
      }
    }, 150);
    this.teardown.push(() => clearTimeout(openingTimer));
  }

  declineOffer() {
    if (this.snapshot.phase !== "offer_received") return;
    this.transition({
      phase: "declined",
      ctx: { ...this.snapshot.ctx },
    });
  }

  reset() {
    if (this.ackTimer) {
      clearTimeout(this.ackTimer);
    }
    this.ackTimer = undefined;
    this.transition({ phase: "idle", ctx: {} });
  }

  private receiveOffer(matchId: string, participants: string[], score: number) {
    if (this.snapshot.phase !== "idle") return;
    this.transition({
      phase: "offer_received",
      ctx: { matchId, participants, score },
    });
  }

  private toOpen(channelId: string) {
    if (this.ackTimer) {
      clearTimeout(this.ackTimer);
    }
    this.transition({
      phase: "open",
      ctx: { ...this.snapshot.ctx, channelId },
    });
  }

  private toError(code: string) {
    if (this.ackTimer) {
      clearTimeout(this.ackTimer);
    }
    this.transition({
      phase: "error",
      ctx: { ...this.snapshot.ctx, errorCode: code },
    });
  }

  private transition(next: ChannelSnapshot) {
    this.snapshot = next;
    for (const subscriber of [...this.subscriptions]) {
      subscriber(this.snapshot);
    }
  }
}
