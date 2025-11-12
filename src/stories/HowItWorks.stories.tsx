import type { Meta, StoryObj } from "@storybook/react";

import HowItWorks from "../components/homepage/HowItWorks";

const meta: Meta<typeof HowItWorks> = {
  title: "Fellowus/Home/HowItWorks",
  component: HowItWorks,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof HowItWorks>;

export const Small: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Medium: Story = {
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};

export const Large: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};
