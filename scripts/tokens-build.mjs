import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

const CANDIDATES = [
  "src/tokens/tokens_fellowus_v1.json",
  "tokens_fellowus_v1.json",
];

function findTokensPath() {
  for (const candidate of CANDIDATES) {
    const fullPath = resolve(process.cwd(), candidate);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }
  throw new Error(
    "tokens_fellowus_v1.json not found in src/tokens/ or project root."
  );
}

const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

function emitVariables(obj, prefix = [], target = new Map()) {
  if (!obj || typeof obj !== "object") {
    return target;
  }

  for (const [rawKey, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) continue;

    const key = toKebabCase(rawKey);
    const nextPrefix = [...prefix, key];

    if (typeof value === "object") {
      emitVariables(value, nextPrefix, target);
    } else {
      target.set(nextPrefix.join("-"), value);
    }
  }

  return target;
}

function cssVarsFromMode(modeTokens) {
  const colors = modeTokens?.colors || {};
  const map = emitVariables(colors, ["color"]);
  return Array.from(map.entries())
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n");
}

function buildDesignSystemVars(tokens) {
  const ds = tokens.designSystem || {};
  const map = new Map();

  if (ds.colors) {
    emitVariables(ds.colors, ["color"], map);
  }

  if (ds.typography) {
    const { fontFamily, sizes, weights } = ds.typography;
    if (fontFamily) {
      map.set("font-family-base", fontFamily);
    }
    if (sizes) {
      emitVariables(sizes, ["font-size"], map);
    }
    if (weights) {
      emitVariables(weights, ["font-weight"], map);
    }
  }

  if (ds.spacing) {
    emitVariables(ds.spacing, ["spacing"], map);
  }

  if (ds.borderRadius) {
    emitVariables(ds.borderRadius, ["radius"], map);
  }

  if (ds.shadows) {
    emitVariables(ds.shadows, ["shadow"], map);
  }

  if (ds.animations) {
    const { duration, easing } = ds.animations;
    if (duration) {
      emitVariables(duration, ["animation-duration"], map);
    }
    if (easing) {
      map.set("animation-easing", easing);
    }
  }

  return Array.from(map.entries()).map(
    ([name, value]) => `  --${name}: ${value};`
  );
}

function parsePx(value) {
  if (typeof value === "string" && value.trim().endsWith("px")) {
    return Number.parseFloat(value);
  }
  return value;
}

function cleanUndefined(input) {
  if (Array.isArray(input)) {
    const cleaned = input
      .map(cleanUndefined)
      .filter((item) => item !== undefined);
    return cleaned.length ? cleaned : undefined;
  }
  if (input && typeof input === "object") {
    const result = {};
    for (const [key, value] of Object.entries(input)) {
      const cleanedValue = cleanUndefined(value);
      if (cleanedValue !== undefined) {
        result[key] = cleanedValue;
      }
    }
    return Object.keys(result).length ? result : undefined;
  }
  return input === undefined ? undefined : input;
}

function buildNativeWindTokens(tokens) {
  const ds = tokens.designSystem || {};
  const colors = ds.colors || {};
  const typography = ds.typography || {};

  const palette = {
    primary: {
      main: colors.primary?.main,
      dark: colors.primary?.dark,
      light: colors.primary?.light,
      gradient: colors.primary?.gradient,
    },
    vip: {
      main: colors.vip?.main,
      dark: colors.vip?.dark,
      light: colors.vip?.light,
      gradient: colors.vip?.gradient,
    },
    semantic: colors.semantic,
    background: {
      light: colors.background?.light,
      medium: colors.background?.medium,
      dark: colors.background?.dark,
    },
    surface: {
      white: colors.surface?.white,
      gray: colors.surface?.gray,
    },
    text: {
      primary: colors.text?.primary,
      secondary: colors.text?.secondary,
      tertiary: colors.text?.tertiary,
      disabled: colors.text?.disabled,
    },
    border: colors.border,
    mapElements: colors.mapElements,
    markers: colors.markers,
    shadows: ds.shadows,
  };

  const spacing = Object.fromEntries(
    Object.entries(ds.spacing || {}).map(([key, value]) => [
      key,
      parsePx(value),
    ])
  );

  const radius = Object.fromEntries(
    Object.entries(ds.borderRadius || {}).map(([key, value]) => [
      key,
      typeof value === "string" && value.trim().endsWith("%")
        ? value
        : parsePx(value),
    ])
  );

  const typoSizes = Object.fromEntries(
    Object.entries(typography.sizes || {}).map(([key, value]) => [
      key,
      parsePx(value),
    ])
  );

  const nativeTokens = {
    palette,
    spacing,
    radius,
    typography: {
      fontFamily: typography.fontFamily,
      sizes: typoSizes,
      weights: typography.weights,
    },
  };

  return cleanUndefined(nativeTokens);
}

function stringifyTs(obj) {
  return JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, (match, prop) => {
    if (/[^a-zA-Z0-9_$]/.test(prop)) {
      return `"${prop}":`;
    }
    return `${prop}:`;
  });
}

function writeNativeWindTokens(tokens) {
  const targetDir = resolve(process.cwd(), "apps/mobile/src/theme");
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const banner =
    "/* Auto-generated from tokens_fellowus_v1.json. Do not edit by hand. */";
  const tsContent = `${banner}

export const palette = ${stringifyTs(tokens.palette)} as const;

export const spacing = ${stringifyTs(tokens.spacing)} as const;

export const radius = ${stringifyTs(tokens.radius)} as const;

export const typography = ${stringifyTs(tokens.typography)} as const;

export const nativeTokens = {
  palette,
  spacing,
  radius,
  typography,
} as const;
`;

  const jsContent = `${banner}
/* eslint-env node */

const palette = ${JSON.stringify(tokens.palette, null, 2)};

const spacing = ${JSON.stringify(tokens.spacing, null, 2)};

const radius = ${JSON.stringify(tokens.radius, null, 2)};

const typography = ${JSON.stringify(tokens.typography, null, 2)};

const nativeTokens = {
  palette,
  spacing,
  radius,
  typography,
};

module.exports = {
  palette,
  spacing,
  radius,
  typography,
  nativeTokens,
};
`;

  const tsPath = resolve(targetDir, "tokens.ts");
  const jsPath = resolve(targetDir, "tokens.js");
  writeFileSync(tsPath, tsContent, "utf8");
  writeFileSync(jsPath, jsContent, "utf8");
  console.log("✓ Generated", tsPath);
  console.log("✓ Generated", jsPath);
}

(function build() {
  const tokensPath = findTokensPath();
  const tokens = JSON.parse(readFileSync(tokensPath, "utf8"));
  const light = tokens.light || {};
  const dark = tokens.dark || {};

  const designSystemLines = buildDesignSystemVars(tokens);

  const aliasLines = [];
  const primaryGradient =
    tokens.designSystem?.colors?.primary?.gradient ||
    light.colors?.primary?.gradient;
  const primaryMain =
    tokens.designSystem?.colors?.primary?.main || light.colors?.primary?.main;
  const primaryDark =
    tokens.designSystem?.colors?.primary?.dark || light.colors?.primary?.dark;
  const vipGradient =
    tokens.designSystem?.colors?.vip?.gradient || light.colors?.vip?.gradient;

  if (primaryMain) aliasLines.push(`  --color-primary-main: ${primaryMain};`);
  if (primaryDark) aliasLines.push(`  --color-primary-dark: ${primaryDark};`);
  if (primaryGradient)
    aliasLines.push(`  --gradient-primary: ${primaryGradient};`);
  if (vipGradient) aliasLines.push(`  --gradient-vip: ${vipGradient};`);

  const bgLight =
    tokens.designSystem?.colors?.background?.light ||
    light.colors?.background?.light;
  const bgMedium =
    tokens.designSystem?.colors?.background?.medium ||
    light.colors?.background?.medium;
  const bgDark =
    tokens.designSystem?.colors?.background?.dark ||
    light.colors?.background?.dark;
  const surfaceWhite =
    tokens.designSystem?.colors?.surface?.white || light.colors?.surface?.white;
  const textPrimary =
    tokens.designSystem?.colors?.text?.primary || light.colors?.text?.primary;
  const textSecondary =
    tokens.designSystem?.colors?.text?.secondary ||
    light.colors?.text?.secondary;
  const textTertiary =
    tokens.designSystem?.colors?.text?.tertiary || light.colors?.text?.tertiary;

  if (bgLight) aliasLines.push(`  --color-bg-light: ${bgLight};`);
  if (bgMedium) aliasLines.push(`  --color-bg-medium: ${bgMedium};`);
  if (bgDark) aliasLines.push(`  --color-bg-dark: ${bgDark};`);
  if (surfaceWhite) aliasLines.push(`  --color-surface: ${surfaceWhite};`);
  if (textPrimary) aliasLines.push(`  --color-text: ${textPrimary};`);
  if (textSecondary) aliasLines.push(`  --color-text-2: ${textSecondary};`);
  if (textTertiary) aliasLines.push(`  --color-text-3: ${textTertiary};`);

  const coloredShadow =
    tokens.designSystem?.shadows?.colored ||
    "0 4px 12px rgba(102, 126, 234, 0.4)";
  aliasLines.push(`  --shadow-colored: ${coloredShadow};`);

  const radiusPhone =
    tokens.designSystem?.borderRadius?.phone ||
    light.colors?.borderRadius?.phone ||
    "40px";
  const radiusScreen =
    tokens.designSystem?.borderRadius?.screen ||
    light.colors?.borderRadius?.screen ||
    "30px";
  aliasLines.push(`  --radius-phone: ${radiusPhone};`);
  aliasLines.push(`  --radius-screen: ${radiusScreen};`);

  const spacingLg = tokens.designSystem?.spacing?.lg || "15px";
  aliasLines.push(`  --spacing-15: ${spacingLg};`);

  const rootLines = [
    cssVarsFromMode(light),
    ...designSystemLines,
    ...aliasLines,
  ].filter(Boolean);

  const dedupedRoot = (() => {
    const map = new Map();
    for (const line of rootLines) {
      for (const l of line.split("\n")) {
        const trimmed = l.trim();
        if (!trimmed) continue;
        const match = trimmed.match(/^--([a-z0-9-]+):\s*(.+);$/i);
        if (match) {
          map.set(match[1], match[2]);
        }
      }
    }
    return Array.from(map.entries()).map(
      ([name, value]) => `  --${name}: ${value};`
    );
  })();

  const rootContent = dedupedRoot.filter(Boolean).join("\n");

  const extraUtilities = `
/* Gradient helpers */
.bg-gradient-primary { background: var(--gradient-primary); }
.bg-gradient-vip { background: var(--gradient-vip); }
`;

  const cssOutput = `:root {
${rootContent}
}

[data-theme="dark"] {
${cssVarsFromMode(dark)}
}

${extraUtilities}`;

  const cssPath = resolve(process.cwd(), "src/styles/tokens.css");
  writeFileSync(cssPath, cssOutput, "utf8");
  console.log("✓ Generated", cssPath);

  const nativeTokens = buildNativeWindTokens(tokens);
  if (nativeTokens) {
    writeNativeWindTokens(nativeTokens);
  }
})();
