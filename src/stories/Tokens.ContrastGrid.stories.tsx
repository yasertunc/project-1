import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = { title: "Fellowus/Tokens/ContrastGrid" };
export default meta;
type Story = StoryObj;

const Pair = ({ fg, bg, label }: { fg: string; bg: string; label: string }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "center",
      padding: 8,
      background: "var(--color-surface-white)",
      borderRadius: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}
  >
    <div
      style={{
        width: 200,
        height: 56,
        borderRadius: 8,
        background: `var(${bg})`,
        display: "grid",
        placeItems: "center",
      }}
    >
      <span style={{ color: `var(${fg})`, fontWeight: 600 }}>{label}</span>
    </div>
    <code>
      {fg} on {bg}
    </code>
  </div>
);

export const Grid: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 16,
      }}
    >
      <Pair
        fg="--color-surface-white"
        bg="--color-primary-main"
        label="Primary Button"
      />
      <Pair
        fg="--color-text-primary"
        bg="--color-surface-white"
        label="Body Text"
      />
      <Pair
        fg="--color-text-secondary"
        bg="--color-background-light"
        label="Muted Text"
      />
      <Pair
        fg="--color-surface-white"
        bg="--color-semantic-success"
        label="Success"
      />
      <Pair
        fg="--color-surface-white"
        bg="--color-semantic-error"
        label="Error"
      />
      <Pair
        fg="--color-text-primary"
        bg="--color-semantic-warning"
        label="Warning"
      />
    </div>
  ),
};
