import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";

import AppPhoneMock from "../components/AppPhoneMock";

const meta: Meta<typeof AppPhoneMock> = {
  title: "Fellowus/Mobile/AppPhoneMock",
  component: AppPhoneMock,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AppPhoneMock>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Varsayılan harita görünümü renderlanıyor", async () => {
      await expect(
        canvas.getByRole("button", { name: "HARİTA" }),
      ).toBeInTheDocument();
      await expect(
        canvas.getByLabelText("AI Asistan"),
      ).toBeInTheDocument();
    });

    await step("Sohbet sekmesine geç", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "SOHBET" }));
      await expect(
        canvas.getByText("Toplantı saat 15:00'te başlayacak"),
      ).toBeInTheDocument();
    });

    await step("VIP avantajlarını görüntüle", async () => {
      const vipButtons = canvas.getAllByRole("button", { name: "VIP" });
      await userEvent.click(vipButtons[0]);
      await expect(
        canvas.getByText("VIP Üyelik"),
      ).toBeInTheDocument();
    });

    await step("Ayarlar paneline geç", async () => {
      const settingsButtons = canvas.getAllByRole("button", { name: "⚙" });
      await userEvent.click(settingsButtons[0]);
      await expect(
        canvas.getByText("Hesap"),
      ).toBeInTheDocument();
    });
  },
};
