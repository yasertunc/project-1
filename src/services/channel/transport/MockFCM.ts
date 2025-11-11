import { EventBus } from "../../../utils/EventBus";

export type FCMEvent =
  | {
      type: "pushOffer";
      matchId: string;
      participants: string[];
      score: number;
    }
  | { type: "deliveryError"; code: string };

export class MockFCMTransport {
  private bus = new EventBus<FCMEvent>();
  private timers: Array<ReturnType<typeof setTimeout>> = [];
  private subscribed = false;

  subscribe() {
    if (this.subscribed) return;
    this.subscribed = true;

    const timer = setTimeout(() => {
      this.bus.emit({
        type: "pushOffer",
        matchId: "m_fcm_1",
        participants: ["u_demo", "u_peer"],
        score: 0.81,
      });
    }, 600);

    this.timers.push(timer);
  }

  on(listener: (event: FCMEvent) => void) {
    return this.bus.on(listener);
  }

  tearDown() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.bus.clear();
    this.subscribed = false;
  }
}
