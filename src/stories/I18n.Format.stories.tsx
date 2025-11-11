import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import {
  formatNumber,
  formatDate,
  formatRelativeMinutes,
} from "../i18n/format";
import { useI18n } from "../i18n/useI18n";

const meta: Meta = {
  title: "Fellowus/I18n/Formatting",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

export const Demo: Story = {
  render: () => {
    const { t } = useI18n();
    const now = new Date();
    return (
      <div
        style={{
          display: "grid",
          gap: 8,
          width: 380,
          background: "var(--muted-50)",
          padding: 12,
          borderRadius: 12,
        }}
      >
        <div>
          <b>{t("alias.label")}:</b> {t("alias.placeholder")}
        </div>
        <div>
          <b>{t("format.number")}:</b> {formatNumber(1234567.89)}
        </div>
        <div>
          <b>{t("format.date")}:</b> {formatDate(now)}
        </div>
        <div>
          <b>{t("format.eta")}:</b> {formatRelativeMinutes(5)}
        </div>
      </div>
    );
  },
};
