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
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 16,
      }}
    >
      <Box label="Primary Main" color="--color-primary-main" />
      <Box label="Primary Dark" color="--color-primary-dark" />
      <Box label="Primary Light" color="--color-primary-light" />
      <Box label="VIP Main" color="--color-vip-main" />
      <Box label="VIP Dark" color="--color-vip-dark" />
      <Box label="VIP Light" color="--color-vip-light" />
      <Box label="Success" color="--color-semantic-success" />
      <Box label="Error" color="--color-semantic-error" />
      <Box label="Warning" color="--color-semantic-warning" />
      <Box label="Info" color="--color-semantic-info" />
      <Box label="Online" color="--color-semantic-online" />
      <Box label="Offline" color="--color-semantic-offline" />
      <Box label="Background Light" color="--color-background-light" />
      <Box label="Background Medium" color="--color-background-medium" />
      <Box label="Background Dark" color="--color-background-dark" />
      <Box label="Surface White" color="--color-surface-white" />
      <Box label="Surface Gray" color="--color-surface-gray" />
      <Box label="Text Primary" color="--color-text-primary" />
      <Box label="Text Secondary" color="--color-text-secondary" />
      <Box label="Text Tertiary" color="--color-text-tertiary" />
      <Box label="Text Disabled" color="--color-text-disabled" />
    </div>
  ),
};
