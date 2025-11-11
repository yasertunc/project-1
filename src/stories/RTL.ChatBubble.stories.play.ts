import { within } from "@storybook/test";

export const play = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const c = within(canvasElement);
  c.getByText("مرحبا! كيف حالك؟");
  c.getByText("تمام، شكراً لك 👍");
  c.getByText("تذكير: لا تشارك معلومات شخصية.");
};
