import { readFileSync, writeFileSync, existsSync } from "fs";
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
    "tokens_fellowus_v1.json not found in src/tokens/ or project root.",
  );
}

function cssVarsFromMode(modeTokens) {
  const c = modeTokens.colors || {};
  const lines = [];
  const add = (key, value) => {
    if (value !== undefined && value !== null) {
      lines.push(`  --${key}: ${value};`);
    }
  };

  if (c.primary) {
    for (const key of Object.keys(c.primary)) {
      add(`color-primary-${key}`, c.primary[key]);
    }
  }

  if (c.accent?.amber?.["500"])
    add("color-accent-amber-500", c.accent.amber["500"]);
  if (c.success?.["500"]) add("color-success-500", c.success["500"]);
  if (c.danger?.["500"]) add("color-danger-500", c.danger["500"]);

  if (c.ink) {
    for (const key of Object.keys(c.ink)) {
      add(`ink-${key}`, c.ink[key]);
    }
  }

  if (c.muted) {
    for (const key of Object.keys(c.muted)) {
      add(`muted-${key}`, c.muted[key]);
    }
  }

  if (c.surface) add("surface", c.surface);

  return lines.join("\n");
}

(function build() {
  const tokensPath = findTokensPath();
  const tokens = JSON.parse(readFileSync(tokensPath, "utf8"));
  const light = tokens.light || tokens;
  const dark = tokens.dark || tokens;

  const additionalRootLines = [
    "  --color-primary-main: #667eea;",
    "  --color-primary-dark: #764ba2;",
    "  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);",
    "  --gradient-vip: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);",
    "  --color-bg-light: #f5f7fa;",
    "  --color-bg-medium: #e3e9f3;",
    "  --color-bg-dark: #1a1a1a;",
    "  --color-surface: #ffffff;",
    "  --color-text: #333333;",
    "  --color-text-2: #666666;",
    "  --color-text-3: #999999;",
    "  --shadow-colored: 0 4px 12px rgba(102,126,234,.4);",
    "  --radius-phone: 40px;",
    "  --radius-screen: 30px;",
    "  --spacing-15: 15px;",
  ].join("\n");

  const extraUtilities = `
/* Gradient helpers */
.bg-gradient-primary { background: var(--gradient-primary); }
.bg-gradient-vip { background: var(--gradient-vip); }
`;

  const rootContent = [cssVarsFromMode(light), additionalRootLines]
    .filter(Boolean)
    .join("\n");

  const out = `:root {\n${rootContent}\n}\n\n[data-theme="dark"] {\n${cssVarsFromMode(
    dark,
  )}\n}\n\n${extraUtilities}`;
  const outPath = resolve(process.cwd(), "src/styles/tokens.css");
  writeFileSync(outPath, out, "utf8");
  console.log("✓ Generated", outPath);
})();
