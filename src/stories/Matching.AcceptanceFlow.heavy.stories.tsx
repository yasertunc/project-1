import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import * as React from "react";

import { AppShell } from "../app/AppShell";
import { AcceptanceOffer } from "../components/Matching/AcceptanceOffer";
import { ChannelStatusBanner } from "../components/Channel/ChannelStatusBanner";
import { MockChannelService } from "../services/channel/ChannelService";
import { channelOpenMock, enqueueMock, offerMock } from "../mocks/matchingMock";

const meta: Meta = {
  title: "Fellowus/Matching/Acceptance Flow",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  render: () => {
    const svcRef = React.useRef<MockChannelService | null>(null);
    if (!svcRef.current) {
      svcRef.current = new MockChannelService();
    }
    const svc = svcRef.current;

    const [phase, setPhase] = React.useState<
      "idle" | "queued" | "offered" | "accepted" | "declined"
    >("idle");
    const [offer, setOffer] = React.useState<Awaited<
      ReturnType<typeof offerMock>
    > | null>(null);
    const [busy, setBusy] = React.useState(false);

    async function start() {
      setBusy(true);
      await enqueueMock({});
      setPhase("queued");
      const nextOffer = await offerMock();
      setOffer(nextOffer);
      setPhase("offered");
      setBusy(false);
    }

    async function accept() {
      if (!offer) return;
      setBusy(true);
      try {
        await svc.open({ matchId: offer.matchId });
        await channelOpenMock();
        setPhase("accepted");
      } catch {
        setPhase("declined");
      } finally {
        setBusy(false);
      }
    }

    return (
      <AppShell title="Acceptance Demo">
        <div style={{ display: "grid", gap: 12, width: 460 }}>
          <ChannelStatusBanner svc={svc} />

          {phase === "idle" && (
            <button
              type="button"
              className="rounded-full bg-primary-main px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light"
              onClick={start}
            >
              Find match
            </button>
          )}

          {phase === "queued" && (
            <div role="status" aria-live="polite" aria-label="Searching">
              Searching…
            </div>
          )}

          {phase === "offered" && offer && (
            <AcceptanceOffer
              offer={offer}
              onAccept={accept}
              onDecline={() => setPhase("declined")}
              busy={busy}
            />
          )}

          {phase === "accepted" && (
            <div
              role="status"
              aria-live="polite"
              aria-label="Match accepted, channel open"
            >
              Match accepted, channel open.
            </div>
          )}

          {phase === "declined" && (
            <div role="status" aria-live="polite" aria-label="Offer declined">
              Offer declined.
            </div>
          )}
        </div>
      </AppShell>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await user.click(canvas.getByRole("button", { name: /find match/i }));
    await canvas.findByRole("status", { name: /searching/i });
    await canvas.findByText(/offer score/i);

    await user.click(canvas.getByRole("button", { name: /accept/i }));
    await canvas.findByText(/channel open/i);
    await canvas.findByRole("status", { name: /match accepted/i });

    expect(true).toBe(true);
  },
};
