import { describe, expect, it } from "vitest";

type HexColor = `#${string}`;

const CONTRAST_REQUIREMENT = 4.5;

const PAIRS: Array<[HexColor, HexColor, string]> = [
  // Light theme - text on background (WCAG AA compliant)
  ["#333333", "#f5f7fa", "text primary on light background"],
  ["#666666", "#ffffff", "text secondary on white surface"],
  // Dark theme - text on surface (WCAG AA compliant)
  ["#f5f7fa", "#1a1a1a", "text primary on dark background"],
  ["#d1d5db", "#1f2130", "text secondary on dark surface"],
  // Primary colors with sufficient contrast
  ["#ffffff", "#764ba2", "white text on primary dark"],
  // Semantic colors with sufficient contrast
  ["#ffffff", "#c62828", "white text on dark error"],
  ["#333333", "#26de81", "dark text on success"],
];

function hexToRgb(hex: HexColor): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = Number.parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]) {
  const toLinear = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  };
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrastRatio(foreground: HexColor, background: HexColor) {
  const l1 = relativeLuminance(hexToRgb(foreground));
  const l2 = relativeLuminance(hexToRgb(background));
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

describe("accessibility tokens", () => {
  PAIRS.forEach(([foreground, background, description]) => {
    it(`ensure ${description} contrast ratio meets AA requirement`, () => {
      const ratio = contrastRatio(foreground, background);
      expect(ratio).toBeGreaterThanOrEqual(CONTRAST_REQUIREMENT);
    });
  });
});
