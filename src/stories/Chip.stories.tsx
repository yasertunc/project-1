import type { Meta, StoryObj } from "@storybook/react";
import { useTranslation } from "react-i18next";

import { Chip } from "../components/Chip";

const meta: Meta<typeof Chip> = {
  title: "Fellowus/Chip",
  component: Chip,
  argTypes: { selected: { control: "boolean" } },
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: () => {
    const { t } = useTranslation("common");
    return <Chip>{t("chip.music")}</Chip>;
  },
};

export const Selected: Story = {
  render: () => {
    const { t } = useTranslation("common");
    return <Chip selected>{t("chip.daily")}</Chip>;
  },
};
