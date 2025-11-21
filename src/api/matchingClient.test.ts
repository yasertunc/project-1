import { describe, expect, it, vi } from "vitest";

import { createMatchingClient } from "./matchingClient";

const makeResponse = (status: number, body?: any, statusText = "OK") =>
  new Response(body ? JSON.stringify(body) : undefined, {
    status,
    statusText,
    headers: { "Content-Type": "application/json" },
  });

describe("matchingClient", () => {
  it("sends auth header and POSTs to enqueue", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(makeResponse(202, { id: "m1" }));
    const client = createMatchingClient({
      baseUrl: "https://api.test/v2/",
      fetchImpl: fetchMock as any,
      getAuthToken: () => "token123",
    });

    await client.enqueue({ userId: "u1" } as any);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/v2/match/enqueue",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer token123",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ userId: "u1" }),
      })
    );
  });

  it("throws on non-ok with server message", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        makeResponse(400, { message: "Bad body" }, "Bad Request")
      );
    const client = createMatchingClient({ fetchImpl: fetchMock as any });

    await expect(client.enqueue({} as any)).rejects.toThrow("Bad body");
  });

  it("cancel accepts 204 without throwing", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(204));
    const client = createMatchingClient({ fetchImpl: fetchMock as any });

    await expect(
      client.cancel({ matchId: "m1" } as any)
    ).resolves.toBeUndefined();
  });
});
