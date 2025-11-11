import { userEvent, within } from "@storybook/test";

export const setupStoryTest = (canvasElement: HTMLElement) => {
  return {
    canvas: within(canvasElement),
    u: userEvent.setup({ delay: 0 }),
  };
};
