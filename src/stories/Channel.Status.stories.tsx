import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import * as React from "react";

import { AppShell } from "../app/AppShell";
import { ChannelStatusBanner } from "../components/Channel/ChannelStatusBanner";
import { Button } from "../components/Button";
import { MockChannelService } from "../services/channel/ChannelService";

const meta: Meta = {
  title: "Fellowus/Channel/Status",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof meta>;

const ChannelHappyDemo: React.FC = () => {
  const svcRef = React.useRef<MockChannelService | null>(null);
  if (!svcRef.current) {
    svcRef.current = new MockChannelService();
  }
  const svc = svcRef.current;
  return (
    <AppShell title="Channel Demo">
      <div style={{ display: "grid", gap: 12, width: 420 }}>
        <ChannelStatusBanner svc={svc} />
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => svc.open({ matchId: "m_123" })}>Open</Button>
          <Button variant="outline" onClick={() => svc.close()}>
            Close
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

const ChannelErrorDemo: React.FC = () => {
  const svcRef = React.useRef<MockChannelService | null>(null);
  if (!svcRef.current) {
    svcRef.current = new MockChannelService();
  }
  const svc = svcRef.current;
  return (
    <AppShell title="Channel Error">
      <div style={{ display: "grid", gap: 12, width: 420 }}>
        <ChannelStatusBanner svc={svc} />
        <Button onClick={() => svc.open({ matchId: "fail_1" })}>
          Open (fail)
        </Button>
      </div>
    </AppShell>
  );
};

export const HappyPath: Story = {
  render: () => <ChannelHappyDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const user = userEvent.setup();

    await c.findByText(/no channel/i);

    await user.click(c.getByRole("button", { name: /open/i }));
    await c.findByText(/opening channel/i);
    await c.findByText(/channel open/i);

    await user.click(c.getByRole("button", { name: /close/i }));
    await c.findByText(/no channel/i);
  },
};

export const ErrorPath: Story = {
  render: () => <ChannelErrorDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const user = userEvent.setup();

    await user.click(c.getByRole("button", { name: /open \(fail\)/i }));
    await c.findByText(/channel error/i);
  },
};
