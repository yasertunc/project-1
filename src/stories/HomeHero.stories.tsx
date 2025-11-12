import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";

import HomeHero from "../components/homepage/HomeHero";

const meta: Meta<typeof HomeHero> = {
  title: "Fellowus/Home/HomeHero",
  component: HomeHero,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof HomeHero>;

export const Small: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const MediumHover: Story = {
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const howItWorks = await canvas.findByRole("button", {
      name: /How It Works/i,
    });
    await userEvent.hover(howItWorks);
  },
};

export const LargeFocus: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab(); // focus first CTA
    const getStarted = await canvas.findByRole("button", {
      name: /Get Started/i,
    });
    await userEvent.tab(); // move focus to second CTA
    const howItWorks = await canvas.findByRole("button", {
      name: /How It Works/i,
    });
    expect(howItWorks).toHaveFocus();
    await userEvent.tab();
    const download = await canvas.findByRole("button", {
      name: /Download App/i,
    });
    expect(download).toHaveFocus();
    await userEvent.click(getStarted);
  },
};
