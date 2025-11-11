import type { Meta, StoryObj } from "@storybook/react";
import { useTranslation } from "react-i18next";

import { Input } from "../components/Input";

const meta: Meta<typeof Input> = { title: "Fellowus/Input", component: Input };
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => {
    const { t } = useTranslation("common");
    return (
      <Input
        label={t("alias.label")}
        placeholder={t("alias.placeholder")}
        leftIcon="🎤"
      />
    );
  },
};

export const Error: Story = {
  render: () => {
    const { t } = useTranslation("common");
    return (
      <Input
        label={t("alias.label")}
        placeholder={t("alias.placeholder")}
        error={t("error.required")}
      />
    );
  },
};
