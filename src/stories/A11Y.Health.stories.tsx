import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { MicButton } from "../components/MicButton";
import { MoodAvatar } from "../components/MoodAvatar";
import { ReportBubble } from "../components/ReportBubble";
import { useI18n } from "../i18n/useI18n";

const meta: Meta = {
  title: "Fellowus/A11Y/Health Check",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

export const Controls: Story = {
  render: () => {
    const [rec, setRec] = useState(false);
    const { t } = useI18n();
    return (
      <div
        style={{
          display: "grid",
          gap: 12,
          width: 380,
          padding: 12,
          background: "var(--muted-50)",
          borderRadius: 12,
        }}
      >
        <Button aria-label={t("a11y.notifications")}>{"🔔"}</Button>
        <Chip>{t("chip.music")}</Chip>
        <MicButton
          recording={rec}
          onPress={() => setRec(true)}
          onRelease={() => setRec(false)}
        />
        <MoodAvatar />
        <div
          style={{
            height: 120,
            overflow: "auto",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 8,
            padding: 8,
          }}
        >
          <ReportBubble onClick={() => {}} />
        </div>
      </div>
    );
  },
};
