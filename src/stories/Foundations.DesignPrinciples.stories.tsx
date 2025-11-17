import type { Meta, StoryObj } from "@storybook/react";

import DesignPrinciples from "../components/design/DesignPrinciples";

const meta: Meta<typeof DesignPrinciples> = {
  title: "Foundations/Design Principles",
  component: DesignPrinciples,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renk, tipografi, boşluk ve hareket kararları için tek kaynak. Tasarımcılar ile geliştiriciler aynı Storybook ekranını referans alabilir.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DesignPrinciples>;

export const Overview: Story = {};
