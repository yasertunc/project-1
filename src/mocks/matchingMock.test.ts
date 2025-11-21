import { describe, expect, it, vi } from "vitest";

import { channelOpenMock, enqueueMock, offerMock } from "./matchingMock";

describe("matchingMock helpers", () => {
  it("enqueueMock returns request metadata", async () => {
    vi.useFakeTimers();
    const promise = enqueueMock({ userId: "demo" });
    vi.runAllTimers();
    const res = await promise;
    expect(res.request.requestId).toBeDefined();
    vi.useRealTimers();
  });

  it("offerMock yields match payload", async () => {
    vi.useFakeTimers();
    const promise = offerMock();
    vi.runAllTimers();
    const res = await promise;
    expect(res.matchId).toBe("m_demo");
    expect(res.participants.length).toBeGreaterThan(0);
    vi.useRealTimers();
  });

  it("channelOpenMock returns channel id", async () => {
    vi.useFakeTimers();
    const promise = channelOpenMock();
    vi.runAllTimers();
    const res = await promise;
    expect(res.channelId).toBe("ch_demo");
    vi.useRealTimers();
  });
});
