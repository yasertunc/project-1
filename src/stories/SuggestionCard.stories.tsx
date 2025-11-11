import type { Meta, StoryObj } from "@storybook/react";
import { useTranslation } from "react-i18next";

import { SuggestionCard } from "../components/SuggestionCard";

const meta: Meta<typeof SuggestionCard> = {
  title: "Fellowus/SuggestionCard",
  component: SuggestionCard,
};
export default meta;
type Story = StoryObj<typeof SuggestionCard>;

export const Guide: Story = {
  render: () => {
    const { t } = useTranslation("common");
    return (
      <SuggestionCard
        title={t("guide.waiting.title")}
        meta={t("guide.waiting.meta")}
        primaryCta={{ label: t("btn.join") }}
        secondaryCta={{ label: t("guide.hide") }}
      />
    );
  },
};

export const Warning: Story = {
  render: () => {
    const { t } = useTranslation("common");
    return (
      <SuggestionCard
        title={t("system.warning")}
        tone="warning"
        secondaryCta={{ label: t("guide.rules") }}
      />
    );
  },
};
