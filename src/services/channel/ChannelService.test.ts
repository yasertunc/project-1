import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MockChannelService } from "./ChannelService";

describe("MockChannelService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("opens channel and notifies subscribers", async () => {
    const svc = new MockChannelService();
    const states: string[] = [];
    svc.onState((s) => states.push(s));

    const openPromise = svc.open({ matchId: "m1" });
    expect(states).toContain("opening");

    vi.runAllTimers();
    const result = await openPromise;
    expect(result.channelId).toBeDefined();
    expect(states).toContain("open");
  });

  it("emits error when open fails", async () => {
    const svc = new MockChannelService();
    const states: string[] = [];
    svc.onState((s) => states.push(s));

    const promise = svc.open({ matchId: "fail-123" });
    promise.catch(() => {}); // avoid unhandled rejection until assertion
    await vi.runAllTimersAsync();
    await expect(promise).rejects.toThrow("CHANNEL_OPEN_FAILED");
    expect(states).toContain("error");
  });

  it("closes back to idle", async () => {
    const svc = new MockChannelService();
    const openPromise = svc.open({ matchId: "m1", channelId: "ch1" });
    await vi.runAllTimersAsync();
    await openPromise;
    const closePromise = svc.close();
    await vi.runAllTimersAsync();
    await closePromise;
    expect(svc.state()).toBe("idle");
  });
});
