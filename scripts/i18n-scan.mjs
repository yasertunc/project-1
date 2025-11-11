import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

const findings = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      walk(p);
    } else if (/\.(tsx?|jsx?)$/.test(name)) {
      scanFile(p);
    }
  }
}

function scanFile(p) {
  const src = readFileSync(p, "utf8");
  const lines = src.split("\n");
  const skipRegex = /\bt\(\s*['"]/;

  lines.forEach((line, idx) => {
    if (skipRegex.test(line)) return;
    const rx = />\s*([^<{][^<>{}]+?)\s*</g;
    let m;
    while ((m = rx.exec(line))) {
      const text = m[1].trim();
      if (!text) continue;
      if (/^{.*}$/.test(text)) continue;
      if (text.length <= 2) continue;
      if (/^[#@/\\|()[\]{}<>=+*~`^%$€£¥!?,.;:'"0-9\s-]+$/.test(text)) continue;
      if (/[\u{1F300}-\u{1FAFF}]/u.test(text)) continue;
      if (/(Primary|Outline|Join|Skip|MATCH|Nickname|Report)/i.test(text))
        continue;
      findings.push({ file: p, line: idx + 1, text });
    }
  });
}

walk(SRC);

if (findings.length) {
  console.log("\nPotential hard-coded strings (consider moving to locales):\n");
  for (const f of findings) {
    console.log(`${f.file}:${f.line} — "${f.text}"`);
  }
} else {
  console.log("No obvious hard-coded JSX strings found.");
}
