import type { Meta, StoryObj } from "@storybook/react";

import Homepage from "../components/Homepage";

const meta: Meta<typeof Homepage> = {
  title: "Pages/Homepage",
  component: Homepage,
  parameters: {
    layout: "fullscreen",
    a11y: { disable: false },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Homepage>;

export const Default: Story = {};

export const RTL: Story = {
  parameters: {
    layout: "fullscreen",
    direction: "rtl",
  },
  globals: {
    locale: "ar",
  },
};
