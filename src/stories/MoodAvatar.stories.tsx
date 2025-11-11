import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { MoodAvatar, Mood } from "../components/MoodAvatar";

const meta: Meta<typeof MoodAvatar> = {
  title: "Fellowus/MoodAvatar",
  component: MoodAvatar,
};
export default meta;
type Story = StoryObj<typeof MoodAvatar>;

export const Cycle: Story = {
  render: () => {
    const [mood, setMood] = useState<Mood>("neutral");
    return <MoodAvatar mood={mood} onChange={setMood} />;
  },
};
