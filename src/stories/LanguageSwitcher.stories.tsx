import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { Input } from "../components/Input";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useI18n } from "../i18n/useI18n";

const meta: Meta = {
  title: "Fellowus/Language Switcher",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

export const Demo: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <div style={{ display: "grid", gap: 12, width: 380 }}>
        <LanguageSwitcher />
        <Input label={t("alias.label")} placeholder={t("alias.placeholder")} />
        <div style={{ display: "flex", gap: 8 }}>
          <Chip>{t("chip.music")}</Chip>
          <Chip selected>{t("chip.daily")}</Chip>
        </div>
        <Button>{t("btn.primary")}</Button>
        <Button variant="outline">{t("btn.outline")}</Button>
      </div>
    );
  },
};
