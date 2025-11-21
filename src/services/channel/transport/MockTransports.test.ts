import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MockFCMTransport } from "./MockFCM";
import { MockWebSocketTransport } from "./MockWebSocket";

describe("Mock transports", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("emits a single push offer after subscribing", () => {
    const transport = new MockFCMTransport();
    const events: any[] = [];
    transport.on((e) => events.push(e));
    transport.subscribe();
    transport.subscribe(); // idempotent

    vi.runAllTimers();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: "pushOffer" });
  });

  it("teardown cancels scheduled emissions", () => {
    const transport = new MockFCMTransport();
    const events: any[] = [];
    transport.on((e) => events.push(e));
    transport.subscribe();
    transport.tearDown();

    vi.runAllTimers();
    expect(events).toHaveLength(0);
  });

  it("websocket emits connected and offer after connect", () => {
    const ws = new MockWebSocketTransport();
    const events: any[] = [];
    ws.on((e) => events.push(e));

    ws.connect();
    vi.runAllTimers();

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "connected" }),
        expect.objectContaining({ type: "offer" }),
      ])
    );
  });

  it("ackOffer leads to channelOpen when connected", () => {
    const ws = new MockWebSocketTransport();
    const events: any[] = [];
    ws.on((e) => events.push(e));

    ws.connect();
    ws.send({ type: "ackOffer", matchId: "m1" });
    vi.runAllTimers();

    expect(events).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: "channelOpen" })])
    );
  });

  it("ignores sends before connect", () => {
    const ws = new MockWebSocketTransport();
    const events: any[] = [];
    ws.on((e) => events.push(e));

    ws.send({ type: "ackOffer", matchId: "m1" });
    vi.runAllTimers();

    expect(events).toHaveLength(0);
  });

  it("close prevents further emissions", () => {
    const ws = new MockWebSocketTransport();
    const events: any[] = [];
    ws.on((e) => events.push(e));

    ws.connect();
    ws.close();
    vi.runAllTimers();

    expect(events).toHaveLength(0);
  });
});
