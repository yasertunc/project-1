import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import { MicButton } from "../components/MicButton";

const meta: Meta<typeof MicButton> = {
  title: "Fellowus/MicButton",
  component: MicButton,
};
export default meta;
type Story = StoryObj<typeof MicButton>;

export const PressToTalk: Story = {
  render: () => {
    const [rec, setRec] = useState(false);
    return (
      <MicButton
        recording={rec}
        onPress={() => setRec(true)}
        onRelease={() => setRec(false)}
      />
    );
  },
};
