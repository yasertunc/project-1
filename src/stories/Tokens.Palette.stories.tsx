import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta = { title: "Fellowus/Tokens/Palette" };
export default meta;
type Story = StoryObj;

const Box = ({ label, color }: { label: string; color: string }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: 96,
        height: 48,
        borderRadius: 12,
        background: `var(${color})`,
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    />
    <code>{color}</code>
    <span>{label}</span>
  </div>
);

export const Palette: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 12,
      }}
    >
      <Box label="primary-600" color="--color-primary-600" />
      <Box label="primary-400" color="--color-primary-400" />
      <Box label="amber-500" color="--color-accent-amber-500" />
      <Box label="ink-900" color="--ink-900" />
      <Box label="muted-50" color="--muted-50" />
      <Box label="surface" color="--surface" />
    </div>
  ),
};
