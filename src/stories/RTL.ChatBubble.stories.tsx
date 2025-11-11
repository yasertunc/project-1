import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { ChatBubble } from "../components/ChatBubble";
import { useI18n } from "../i18n/useI18n";

const meta: Meta<typeof ChatBubble> = {
  title: "Fellowus/ChatBubble (RTL)",
  component: ChatBubble,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const Arabic: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <div
        dir="rtl"
        style={{
          width: 360,
          background: "var(--muted-50)",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <ChatBubble author="other">{t("chat.rtl.greeting")}</ChatBubble>
        <ChatBubble author="me">{t("chat.rtl.reply")}</ChatBubble>
        <ChatBubble author="system">{t("chat.rtl.warning")}</ChatBubble>
      </div>
    );
  },
};
