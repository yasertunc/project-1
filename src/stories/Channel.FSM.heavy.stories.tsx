import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import * as React from "react";

import { AppShell } from "../app/AppShell";
import { ChannelController } from "../components/Channel/ChannelController";

const meta: Meta = {
  title: "Fellowus/Channel/FSM",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

export const WebSocketAndFCM: Story = {
  render: () => (
    <AppShell title="Channel FSM Demo">
      <ChannelController />
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText(/offer score/i, undefined, { timeout: 3000 });

    const acceptButton = await canvas.findByRole("button", {
      name: /accept/i,
    });
    await userEvent.click(acceptButton);

    await canvas.findByText(/opening channel/i);
    await canvas.findByText(/channel open \(id:/i, undefined, {
      timeout: 3000,
    });
  },
};
