import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const baseUrl = process.env.STORYBOOK_URL ?? "http://localhost:6006";
const stories = [
  new URL("/iframe.html?id=pages-homepage--default", baseUrl).toString(),
  new URL(
    "/iframe.html?id=pages-homepage--rtl&globals=locale%3Aar",
    baseUrl
  ).toString(),
];

const axeCliPath = path.resolve(
  process.cwd(),
  "node_modules",
  "@axe-core",
  "cli",
  "dist",
  "src",
  "bin",
  "cli.js"
);

async function waitForServer(url, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok || res.status === 404) return true;
    } catch {
      // retry
    }
    await delay(250);
  }
  return false;
}

async function run() {
  let serverProcess;
  const healthUrl = new URL("/", baseUrl).toString();

  const serverReady = await waitForServer(healthUrl);
  if (!serverReady) {
    const staticDir = path.resolve(process.cwd(), "storybook-static");
    const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
    serverProcess = spawn(
      npxBin,
      ["http-server", staticDir, "-p", new URL(baseUrl).port || "6006", "-c-1"],
      {
        stdio: "inherit",
        shell: process.platform === "win32",
      }
    );
    if (!(await waitForServer(healthUrl))) {
      console.error("[a11y-stories] Unable to reach Storybook at", baseUrl);
      serverProcess.kill("SIGTERM");
      process.exit(1);
    }
  }

  let failures = 0;
  for (const url of stories) {
    const result = spawnSync(
      process.execPath,
      [axeCliPath, url, "--exit", "--load-delay", "1000"],
      { stdio: "inherit" }
    );

    if (result.status !== 0) {
      if (result.error) {
        console.error(result.error);
      }
      failures += 1;
    }
  }

  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }

  process.exit(failures > 0 ? 1 : 0);
}

run();
