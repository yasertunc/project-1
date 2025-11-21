import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ChannelFSM } from "./ChannelFSM";

type Listener<T> = (event: T) => void;

const wsInstances: any[] = [];
const fcmInstances: any[] = [];

vi.mock("./transport/MockWebSocket", () => {
  class StubWS {
    listeners: Listener<any>[] = [];
    connect = vi.fn();
    send = vi.fn();
    close = vi.fn();
    constructor() {
      wsInstances.push(this);
    }
    on(listener: Listener<any>) {
      this.listeners.push(listener);
      return vi.fn();
    }
  }
  return { MockWebSocketTransport: StubWS };
});

vi.mock("./transport/MockFCM", () => {
  class StubFCM {
    listeners: Listener<any>[] = [];
    subscribe = vi.fn();
    tearDown = vi.fn();
    constructor() {
      fcmInstances.push(this);
    }
    on(listener: Listener<any>) {
      this.listeners.push(listener);
      return vi.fn();
    }
  }
  return { MockFCMTransport: StubFCM };
});

describe("ChannelFSM", () => {
  let fsm: ChannelFSM;
  let wsInstance: any;
  let fcmInstance: any;

  beforeEach(() => {
    vi.useFakeTimers();
    wsInstances.splice(0, wsInstances.length);
    fcmInstances.splice(0, fcmInstances.length);
    fsm = new ChannelFSM();
    [wsInstance] = wsInstances;
    [fcmInstance] = fcmInstances;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("delivers offer -> awaiting_ack -> open flow", () => {
    const snapshots: any[] = [];
    fsm.subscribe((s) => snapshots.push(s));

    // wire listeners
    fsm.start();
    expect(wsInstance.connect).toHaveBeenCalled();
    expect(fcmInstance.subscribe).toHaveBeenCalled();

    // mock inbound offer
    wsInstance.listeners[0]?.({
      type: "offer",
      matchId: "m1",
      participants: ["u1", "u2"],
      score: 0.9,
    });

    expect(fsm.getSnapshot().phase).toBe("offer_received");

    fsm.acceptOffer();
    expect(wsInstance.send).toHaveBeenCalledWith({
      type: "ackOffer",
      matchId: "m1",
    });
    expect(fsm.getSnapshot().phase).toBe("awaiting_ack");

    // simulate channel open before ACK timeout
    wsInstance.listeners[0]?.({ type: "channelOpen", channelId: "ch1" });
    expect(fsm.getSnapshot()).toMatchObject({
      phase: "open",
      ctx: { matchId: "m1", channelId: "ch1" },
    });
  });

  it("times out when ACK is not received", () => {
    fsm.start();
    wsInstance.listeners[0]?.({
      type: "offer",
      matchId: "m2",
      participants: [],
      score: 0.5,
    });
    fsm.acceptOffer();

    // opening timer is stored in teardown; clear to force timeout path
    const teardownFns = (fsm as any).teardown as Array<() => void>;
    teardownFns[teardownFns.length - 1]?.();

    vi.advanceTimersByTime(5000);
    expect(fsm.getSnapshot().phase).toBe("error");
    expect(fsm.getSnapshot().ctx.errorCode).toBe("ACK_TIMEOUT");
  });

  it("dispose resets to idle and clears timers", () => {
    fsm.start();
    fsm.dispose();
    expect(fsm.getSnapshot().phase).toBe("idle");
    expect(wsInstance.close).toHaveBeenCalled();
    expect(fcmInstance.tearDown).toHaveBeenCalled();
  });
});
