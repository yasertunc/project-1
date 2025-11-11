import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const EN = JSON.parse(
  readFileSync(join(ROOT, "src/locales/en/common.json"), "utf8"),
);

const keys = new Set();
const missing = new Set();

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      walk(p);
    } else if (/\.(tsx?|jsx?)$/.test(name)) {
      const src = readFileSync(p, "utf8");
      const rx = /\bt\(\s*['"]([^'"]+)['"]\s*\)/g;
      let m;
      while ((m = rx.exec(src))) {
        keys.add(m[1]);
      }
    }
  }
}

function has(en, path) {
  if (Object.prototype.hasOwnProperty.call(en, path)) {
    return typeof en[path] === "string";
  }

  const parts = path.split(".");
  let cur = en;
  for (const part of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, part)) {
      cur = cur[part];
    } else {
      return false;
    }
  }
  return typeof cur === "string";
}

walk(SRC);
for (const k of keys) {
  if (!has(EN, k)) {
    missing.add(k);
  }
}

if (missing.size) {
  console.error("\nMissing i18n keys in src/locales/en/common.json:\n");
  for (const k of missing) {
    console.error(" -", k);
  }
  process.exit(1);
} else {
  console.log("i18n check passed ✓");
}
