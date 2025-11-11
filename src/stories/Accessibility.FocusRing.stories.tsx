import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { Input } from "../components/Input";
import { useTranslation } from "react-i18next";

const meta: Meta = {
  title: "Fellowus/A11Y/Focus & Keyboard",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

export const FocusOrder: Story = {
  render: () => {
    const { t } = useTranslation("common");
    return (
      <div style={{ display: "grid", gap: 12, width: 360 }}>
        <Input label={t("alias.label")} placeholder={t("alias.placeholder")} />
        <Chip>{t("chip.music")}</Chip>
        <Chip selected>{t("chip.daily")}</Chip>
        <Button>{t("btn.primary")}</Button>
        <Button variant="outline">{t("btn.outline")}</Button>
      </div>
    );
  },
  parameters: {
    test: { disable: true },
  },
};
