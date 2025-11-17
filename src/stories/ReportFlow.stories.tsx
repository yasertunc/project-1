import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import { ReportBubble } from "../components/ReportBubble";
import {
  ReportCategoryModal,
  ReportCategory,
} from "../components/ReportCategoryModal";
import { within, userEvent } from "@storybook/test";

const meta: Meta = {
  title: "Fellowus/Report Flow",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

export const BubbleToModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [picked, setPicked] = useState<ReportCategory | null>(null);

    return (
      <div
        style={{
          width: 380,
          height: 260,
          overflow: "auto",
          border: "1px solid var(--color-border-light)",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <div style={{ height: 320, position: "relative" }}>
          <ReportBubble onClick={() => setOpen(true)} />
          {picked && (
            <div aria-live="polite" style={{ marginTop: 8 }}>
              Selected: {picked}
            </div>
          )}
        </div>
        <ReportCategoryModal
          open={open}
          onClose={() => setOpen(false)}
          onSelect={(category) => {
            setPicked(category);
            setOpen(false);
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await user.click(canvas.getByRole("button", { name: /report/i }));

    const first = await canvas.findByRole("button", {
      name: /harassment/i,
    });
    if (document.activeElement !== first) {
      throw new Error("Focus not on first option when modal opens");
    }

    await user.keyboard("{Escape}");

    await user.click(canvas.getByRole("button", { name: /report/i }));
    await user.click(await canvas.findByRole("button", { name: /spam/i }));

    await canvas.findByText(
      /selected:\s*(spam|personal-info|harassment|hate|self-harm|other)/i
    );
  },
};
