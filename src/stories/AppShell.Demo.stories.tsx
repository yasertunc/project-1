import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import * as React from "react";

import { AppShell } from "../app/AppShell";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { useI18n } from "../i18n/useI18n";

const meta = {
  title: "Fellowus/App Shell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Landing: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <AppShell title="Fellowus">
        <div style={{ display: "grid", gap: 16 }}>
          <p>{t("system.warning")}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Chip>{t("chip.music")}</Chip>
            <Chip selected>{t("chip.daily")}</Chip>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="primary">{t("btn.join")}</Button>
            <Button variant="outline">{t("btn.skip")}</Button>
          </div>
        </div>
      </AppShell>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const user = userEvent.setup();

    await user.keyboard("{Tab}{Enter}");
    const main = c.getByRole("main");
    if (document.activeElement !== main) {
      throw new Error("Skip link did not move focus to <main>");
    }

    const toggle = c.getByRole("button", { name: /toggle theme/i });
    const prev = toggle.textContent;
    await user.click(toggle);
    const next = toggle.textContent;
    if (prev === next) {
      throw new Error("Theme label did not update");
    }
  },
};
