import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function run() {
  const configPath = resolve(__dirname, "..", "ts-prune.json");
  let ignorePattern = "";

  try {
    const raw = await readFile(configPath, "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed.ignorePattern === "string") {
      ignorePattern = parsed.ignorePattern;
    }
  } catch (error) {
    console.warn(`[ts-prune-runner] Unable to read config: ${error.message}`);
  }

  const isWin = process.platform === "win32";
  const command = isWin ? "powershell.exe" : "npx";
  const commandArgs = isWin
    ? [
        "-Command",
        ignorePattern
          ? `npx ts-prune --ignore '${ignorePattern}'`
          : "npx ts-prune",
      ]
    : ["ts-prune", ...(ignorePattern ? ["--ignore", ignorePattern] : [])];

  console.log(
    `[ts-prune-runner] executing: ${command} ${commandArgs.join(" ")}`
  );

  const child = spawn(command, commandArgs, {
    stdio: "inherit",
  });
  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

run();
