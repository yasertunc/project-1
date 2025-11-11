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

  const out = `:root {\n${cssVarsFromMode(light)}\n}\n\n[data-theme="dark"] {\n${cssVarsFromMode(dark)}\n}\n`;
  const outPath = resolve(process.cwd(), "src/styles/tokens.css");
  writeFileSync(outPath, out, "utf8");
  console.log("✓ Generated", outPath);
})();
