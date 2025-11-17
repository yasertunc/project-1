import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Logo } from "../components/Brand/Logo";

const meta: Meta<typeof Logo> = {
  title: "Fellowus/Brand/Logo",
  component: Logo,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "number", min: 16, max: 256, step: 8 } },
    variant: { control: { type: "radio" }, options: ["blue", "amber"] },
    shadow: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: { size: 96, variant: "blue", shadow: true },
};

export const Amber: Story = {
  args: { size: 96, variant: "amber", shadow: false },
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        background: "var(--color-background-light)",
        padding: 16,
        borderRadius: 12,
      }}
    >
      <Logo size={32} />
      <Logo size={48} />
      <Logo size={64} />
      <Logo size={96} />
      <Logo size={128} />
    </div>
  ),
};
