import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Button } from "../components/Button";
import { useI18n } from "../i18n/useI18n";

const meta: Meta<typeof Button> = {
  title: "Fellowus/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "outline", "ghost", "secondary", "accent"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: (args: React.ComponentProps<typeof Button>) => {
    const { t } = useI18n();
    return <Button {...args}>{t("btn.primary")}</Button>;
  },
  args: { variant: "primary" },
};

export const Accent: Story = {
  render: (args: React.ComponentProps<typeof Button>) => {
    const { t } = useI18n();
    return <Button {...args}>{t("btn.match")}</Button>;
  },
  args: { variant: "accent" },
};

export const Outline: Story = {
  render: (args: React.ComponentProps<typeof Button>) => {
    const { t } = useI18n();
    return <Button {...args}>{t("btn.outline")}</Button>;
  },
  args: { variant: "outline" },
};
