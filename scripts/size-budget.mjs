import fs from "node:fs";
import path from "node:path";

const OUTPUT_DIR = "storybook-static";

const BASE_BUDGET = {
  raw: 500 * 1024, // 500 kB
  gzip: 300 * 1024, // 300 kB (heuristic)
};

const OVERRIDES = [
  {
    pattern: /assets[\\/]+DocsRenderer-.*\.js$/i,
    raw: 1024 * 1024,
    gzip: 400 * 1024,
    reason: "Storybook docs renderer vendor bundle",
  },
  {
    pattern: /assets[\\/]+index-.*\.js$/i,
    raw: 850 * 1024,
    gzip: 320 * 1024,
    reason: "Storybook manager vendor bundle",
  },
  {
    pattern: /assets[\\/]+axe-.*\.js$/i,
    raw: 650 * 1024,
    gzip: 350 * 1024,
    reason: "axe accessibility tooling shipped with docs",
  },
  {
    pattern: /sb-manager[\\/]+globals-runtime\.js$/i,
    raw: 1.6 * 1024 * 1024,
    gzip: 500 * 1024,
    reason: "Storybook manager runtime (pending code-splitting)",
  },
];

if (!fs.existsSync(OUTPUT_DIR)) {
  console.warn(
    `[size-budget] Directory "${OUTPUT_DIR}" not found. Run "storybook build" first.`,
  );
  process.exit(0);
}

const gzipEstimate = (length) => Math.round(length * 0.32);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(js|css)$/i.test(entry.name)) {
      yield full;
    }
  }
}

let failed = false;

for (const file of walk(OUTPUT_DIR)) {
  const buffer = fs.readFileSync(file);
  const raw = buffer.length;
  const gzip = gzipEstimate(raw);
  const relative = path.relative(OUTPUT_DIR, file);

  const override = OVERRIDES.find(({ pattern }) => pattern.test(relative));
  const effectiveBudget = override ?? BASE_BUDGET;

  const exceedsEffective =
    raw > effectiveBudget.raw || gzip > effectiveBudget.gzip;
  const exceedsBase = raw > BASE_BUDGET.raw || gzip > BASE_BUDGET.gzip;

  if (exceedsEffective) {
    const limitRaw = (effectiveBudget.raw / 1024).toFixed(0);
    const limitGzip = (effectiveBudget.gzip / 1024).toFixed(0);
    console.error(
      `🚫 ${relative} exceeded budget: raw ${(raw / 1024).toFixed(
        0,
      )}kB (limit ${limitRaw}kB), gzip≈${(gzip / 1024).toFixed(
        0,
      )}kB (limit ${limitGzip}kB)`,
    );
    failed = true;
    continue;
  }

  if (override && exceedsBase) {
    console.warn(
      `ℹ️  ${relative} exceeds default budget but is temporarily allowed (${override.reason}).`,
    );
  } else if (!override && exceedsBase) {
    console.warn(
      `⚠️  ${relative} is approaching the bundle budget (raw ${(
        raw / 1024
      ).toFixed(0)}kB, gzip≈${(gzip / 1024).toFixed(0)}kB).`,
    );
  }
}

if (failed) {
  console.error(
    "Bundle size budget exceeded. See messages above for offending chunks.",
  );
  process.exit(1);
} else {
  console.log("✅ Bundle size within budget.");
}
