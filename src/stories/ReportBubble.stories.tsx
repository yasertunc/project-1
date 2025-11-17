import type { Meta, StoryObj } from "@storybook/react";
import { useTranslation } from "react-i18next";

import { ReportBubble } from "../components/ReportBubble";

const meta: Meta<typeof ReportBubble> = {
  title: "Fellowus/ReportBubble",
  component: ReportBubble,
};
export default meta;
type Story = StoryObj<typeof ReportBubble>;

export const Sticky: Story = {
  render: () => {
    const { t } = useTranslation("common");
    return (
      <div
        style={{
          height: 200,
          overflow: "auto",
          border: "1px solid var(--color-border-light)",
          padding: 8,
        }}
      >
        <div style={{ height: 300 }}>
          <ReportBubble onClick={() => alert(t("report"))} />
        </div>
      </div>
    );
  },
};
