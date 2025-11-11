import type { Meta, StoryObj } from "@storybook/react";
import { useTranslation } from "react-i18next";

import { ChatBubble } from "../components/ChatBubble";

const meta: Meta<typeof ChatBubble> = {
  title: "Fellowus/ChatBubble",
  component: ChatBubble,
};
export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const Inbound: Story = {
  args: { author: "other", children: "Hello! 👋" },
};
export const Outbound: Story = {
  args: { author: "me", children: "Hi there!" },
};

export const System: Story = {
  render: () => {
    const { t } = useTranslation("common");
    return <ChatBubble author="system">{t("system.warning")}</ChatBubble>;
  },
};
