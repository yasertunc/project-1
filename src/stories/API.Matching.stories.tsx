import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import { createMatchingClient } from "../api/matchingClient";

const meta: Meta = {
  title: "Fellowus/API/Matching (mocked)",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

export const Demo: Story = {
  render: () => {
    const [out, setOut] = useState<any>(null);

    const client = createMatchingClient({
      baseUrl: "https://mock",
      fetchImpl: async (input) => {
        const url = String(input);
        if (url.endsWith("/v1/match/enqueue")) {
          return new Response(
            JSON.stringify({
              request: { requestId: "req_1", userId: "u_1" },
              enqueuedAt: new Date().toISOString(),
              priority: 1,
            }),
            { status: 202, headers: { "Content-Type": "application/json" } },
          );
        }
        if (url.endsWith("/v1/match/cancel")) {
          return new Response(null, { status: 204 });
        }
        if (url.endsWith("/v1/match/tick")) {
          return new Response(
            JSON.stringify({
              matchedCount: 1,
              expandedCount: 2,
              queueDepth: 10,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        return new Response(
          JSON.stringify({ code: "NOT_IMPL", message: "Not implemented" }),
          {
            status: 501,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    });

    return (
      <div style={{ display: "grid", gap: 8, width: 420 }}>
        <button
          className="rounded-pill bg-primary-600 px-3 py-1.5 text-white"
          onClick={async () => {
            const res = await client.enqueue({
              requestId: "r1",
              userId: "u1",
              profileSnapshot: {},
              geoHash: "sx",
              coordinates: { lat: 0, lon: 0 },
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 60_000).toISOString(),
              preferences: { intent: "social", radiusKm: 5, locale: "en" },
              capabilities: { mic: true, text: true, shareLocation: false },
              reputationScore: 0.5,
            });
            setOut(res);
          }}
        >
          Call enqueue()
        </button>
        <button
          className="rounded-pill bg-muted-100 px-3 py-1.5"
          onClick={async () => {
            await client.cancel({ requestId: "r1", userId: "u1" });
            setOut("cancelled");
          }}
        >
          Call cancel()
        </button>
        <button
          className="rounded-pill bg-muted-100 px-3 py-1.5"
          onClick={async () => {
            const res = await client.tick();
            setOut(res);
          }}
        >
          Call tick()
        </button>
        <pre
          style={{ background: "var(--surface)", padding: 8, borderRadius: 8 }}
        >
          {JSON.stringify(out, null, 2)}
        </pre>
      </div>
    );
  },
};
