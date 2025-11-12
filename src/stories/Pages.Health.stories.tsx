import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Fellowus/Pages Health",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

export const FaviconAndAssets: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <p>If you see an icon below, static assets are served correctly:</p>
      <img
        src="/storybook-favicon.svg"
        alt="favicon"
        width={48}
        height={48}
        loading="lazy"
        decoding="async"
      />
    </div>
  ),
};

