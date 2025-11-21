#!/usr/bin/env node

/**
 * Device Matrix Validation Script
 *
 * Validates device matrix CI/CD workflow and configuration
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const DEVICE_MATRIX_WORKFLOW = join(
  rootDir,
  ".github/workflows/device-matrix.yml"
);
const DEVICE_MATRIX_DOC = join(rootDir, "docs/mobile-device-matrix.md");
const DEVICE_MATRIX_IMPL_DOC = join(
  rootDir,
  "docs/mobile-device-matrix-implementation.md"
);

function checkFileExists(filePath, description) {
  if (existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.error(`❌ ${description} missing: ${filePath}`);
    return false;
  }
}

function checkWorkflowFile() {
  console.log("\n⚙️  Checking device matrix workflow...\n");

  if (!checkFileExists(DEVICE_MATRIX_WORKFLOW, "Device matrix workflow")) {
    return false;
  }

  try {
    const content = readFileSync(DEVICE_MATRIX_WORKFLOW, "utf-8");

    const checks = [
      {
        name: "Workflow triggers configured",
        pattern: /on:\s*[\s\S]*push|schedule/i,
      },
      { name: "Android emulator setup", pattern: /android|emulator/i },
      { name: "Device matrix strategy", pattern: /matrix|strategy/i },
      { name: "Screenshot capture", pattern: /screenshot|artifact/i },
      { name: "Log collection", pattern: /log|adb/i },
    ];

    let allPass = true;
    for (const check of checks) {
      if (content.match(check.pattern)) {
        console.log(`  ✅ ${check.name}`);
      } else {
        console.warn(`  ⚠️  ${check.name} not found`);
        allPass = false;
      }
    }

    // Check for specific devices
    const pixel6Match = content.match(/Pixel.*6|pixel.*6/i);
    const pixel5Match = content.match(/Pixel.*5|pixel.*5/i);

    if (pixel6Match) {
      console.log(`  ✅ Pixel 6 emulator configured`);
    } else {
      console.warn(`  ⚠️  Pixel 6 emulator not found`);
    }

    if (pixel5Match) {
      console.log(`  ✅ Pixel 5 emulator configured`);
    } else {
      console.warn(`  ⚠️  Pixel 5 emulator not found`);
    }

    return allPass;
  } catch (error) {
    console.error(`  ❌ Error reading workflow: ${error.message}`);
    return false;
  }
}

function checkDocumentation() {
  console.log("\n📚 Checking device matrix documentation...\n");

  const docs = [
    { path: DEVICE_MATRIX_DOC, name: "Device matrix plan" },
    {
      path: DEVICE_MATRIX_IMPL_DOC,
      name: "Device matrix implementation guide",
    },
  ];

  let allExist = true;
  for (const doc of docs) {
    if (!checkFileExists(doc.path, doc.name)) {
      allExist = false;
    }
  }

  return allExist;
}

function generateReport(results) {
  console.log("\n" + "=".repeat(60));
  console.log("📊 Device Matrix Validation Report");
  console.log("=".repeat(60));

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter((r) => r).length;
  const failed = total - passed;

  console.log(`\nTotal Checks: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nProgress: ${Math.round((passed / total) * 100)}%`);

  if (failed === 0) {
    console.log(
      "\n🎉 All checks passed! Device matrix is properly configured."
    );
  } else {
    console.log("\n⚠️  Some checks failed. Please review and fix issues.");
  }

  return failed === 0;
}

function main() {
  console.log("📱 Device Matrix Validation\n");

  const results = {
    workflow: checkWorkflowFile(),
    documentation: checkDocumentation(),
  };

  const success = generateReport(results);
  process.exit(success ? 0 : 1);
}

main();
