import fs from "node:fs";
import path from "node:path";

const LHCI_DIR = process.env.LHCI_DIR ?? ".lighthouseci";
const LYCHEE_DIR = process.env.LYCHEE_DIR ?? "lychee";
const PREVIEW_URL = process.env.PREVIEW_URL ?? "N/A";
const TEST_STATUS = process.env.TEST_STATUS ?? "ℹ️ pending";
const VR_STATUS = process.env.VR_STATUS ?? "ℹ️ pending";

const percentage = (value) =>
  typeof value === "number" && value <= 1
    ? `${Math.round(value * 100)}%`
    : (value ?? "—");

function walkFiles(targetDir, predicate) {
  if (!fs.existsSync(targetDir)) return [];
  const results = [];
  const stack = [targetDir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(current)) {
        stack.push(path.join(current, entry));
      }
    } else if (predicate(current)) {
      results.push(current);
    }
  }
  return results;
}

function readLighthouseScores() {
  const files = walkFiles(LHCI_DIR, (file) => file.endsWith(".json"));
  if (!files.length) return null;

  // prefer JSON files containing an LHR result
  const candidate = files
    .map((file) => {
      try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .find((data) => data?.lhr?.categories || data?.categories);

  const categories =
    candidate?.lhr?.categories ??
    candidate?.categories ??
    candidate?.categories ??
    {};

  return {
    performance: percentage(
      categories.performance?.score ?? categories["performance"]?.score
    ),
    accessibility: percentage(
      categories.accessibility?.score ?? categories["accessibility"]?.score
    ),
    seo: percentage(categories.seo?.score ?? categories["seo"]?.score),
  };
}

function readLinkIssues() {
  const reports = walkFiles(
    LYCHEE_DIR,
    (file) => path.basename(file) === "out.md"
  );
  if (!reports.length) return { broken: 0 };

  const total = reports.reduce((sum, reportPath) => {
    try {
      const content = fs.readFileSync(reportPath, "utf8");
      const match = content.match(/Issues:\s*(\d+)/i);
      return sum + (match ? Number.parseInt(match[1] ?? "0", 10) : 0);
    } catch {
      return sum;
    }
  }, 0);

  return { broken: total };
}

function buildSummary() {
  const lighthouse = readLighthouseScores() ?? {
    performance: "—",
    accessibility: "—",
    seo: "—",
  };
  const lychee = readLinkIssues();

  const lines = [
    "### 🔎 CI Summary",
    "",
    `**Preview:** ${PREVIEW_URL}`,
    "",
    "| Metric | Value |",
    "|---|---|",
    `| Lighthouse (Perf) | ${lighthouse.performance} |`,
    `| Lighthouse (A11y) | ${lighthouse.accessibility} |`,
    `| Lighthouse (SEO) | ${lighthouse.seo} |`,
    `| Broken Links | ${lychee.broken} |`,
    "",
    `**Tests:** ${TEST_STATUS}  •  **VR:** ${VR_STATUS}`,
    "",
  ];

  return lines.join("\n");
}

const summary = buildSummary();
fs.writeFileSync("ci-summary.md", summary, "utf8");
console.log(summary);
