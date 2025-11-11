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
      background: "var(--surface)",
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
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
      }}
    >
      <Pair fg="--ink-200" bg="--color-primary-600" label="Button text" />
      <Pair fg="--ink-900" bg="--surface" label="Body text" />
      <Pair fg="--ink-700" bg="--muted-50" label="Muted text" />
    </div>
  ),
};
