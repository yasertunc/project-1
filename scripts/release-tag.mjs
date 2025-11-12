#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function readPackageVersion() {
  const pkgPath = path.join(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (!pkg.version) {
    throw new Error("package.json is missing a version field.");
  }
  return pkg.version;
}

function nextPreRelease(baseVersion, preid) {
  const normalized = preid.replace(/^-/, "");

  if (/\.\d+$/.test(normalized)) {
    return `${baseVersion}-${normalized}`;
  }

  const pattern = `v${baseVersion}-${normalized}.`;
  let highest = 0;

  try {
    const output = execSync(`git tag -l "${pattern}*"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
    });

    output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((tag) => {
        const match = tag.match(/\.([0-9]+)$/);
        if (match) {
          const value = Number.parseInt(match[1], 10);
          if (!Number.isNaN(value)) {
            highest = Math.max(highest, value);
          }
        }
      });
  } catch {
    // ignore; no previous tags
  }

  return `${baseVersion}-${normalized}.${highest + 1}`;
}

function tagExists(tag) {
  try {
    const result = execSync(`git tag -l "${tag}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
    }).trim();
    return result === tag;
  } catch {
    return false;
  }
}

function ensureCleanWorkingTree() {
  const status = execSync("git status --porcelain", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();

  if (status) {
    throw new Error("Working tree is not clean. Please commit or stash changes before tagging.");
  }
}

function main() {
  const pkgVersion = readPackageVersion();
  const baseVersion = pkgVersion.split("-")[0];
  const preid = process.argv[2];

  let targetVersion = pkgVersion;

  if (preid) {
    targetVersion = nextPreRelease(baseVersion, preid);
  }

  const tag = `v${targetVersion}`;

  ensureCleanWorkingTree();

  execSync("git fetch --tags", { stdio: "inherit" });

  if (tagExists(tag)) {
    throw new Error(`Tag ${tag} already exists. Aborting.`);
  }

  execSync(`git tag ${tag}`, { stdio: "inherit" });
  execSync(`git push origin ${tag}`, { stdio: "inherit" });

  console.log(`✅ Created and pushed tag ${tag}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}

