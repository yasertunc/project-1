#!/usr/bin/env node

/**
 * E2E Test Validation Script
 *
 * Validates E2E test structure, coverage, and configuration
 * without requiring UI implementation or running actual tests.
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const E2E_DIR = join(rootDir, "e2e");
const CONFIG_FILE = join(rootDir, "playwright.e2e.config.ts");
const PACKAGE_JSON = join(rootDir, "package.json");

const REQUIRED_TEST_FILES = [
  "flows.spec.ts",
  "failures.spec.ts",
  "api-failures.spec.ts",
  "matching-flow.spec.ts",
  "profile-setup.spec.ts",
  "notification-flow.spec.ts",
  "accessibility-flow.spec.ts",
  "download-flow.spec.ts",
  "performance-flow.spec.ts",
  "smoke.spec.ts",
];

const REQUIRED_TEST_SCRIPTS = ["test:e2e", "test:e2e:failures", "test:e2e:all"];

function checkFileExists(filePath, description) {
  if (existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.error(`❌ ${description} missing: ${filePath}`);
    return false;
  }
}

function checkTestFiles() {
  console.log("\n📁 Checking E2E test files...\n");

  let allExist = true;
  for (const file of REQUIRED_TEST_FILES) {
    const filePath = join(E2E_DIR, file);
    if (!checkFileExists(filePath, `Test file: ${file}`)) {
      allExist = false;
    }
  }

  return allExist;
}

function checkConfigFile() {
  console.log("\n⚙️  Checking Playwright configuration...\n");

  if (!checkFileExists(CONFIG_FILE, "Playwright config")) {
    return false;
  }

  try {
    const config = readFileSync(CONFIG_FILE, "utf-8");

    const checks = [
      { name: "Base URL configured", pattern: /baseURL/i },
      { name: "Test timeout set", pattern: /^\s*timeout:/m },
      { name: "Expect timeout set", pattern: /expect:\s*\{[\s\S]*timeout:/m },
    ];

    let allPass = true;
    for (const check of checks) {
      if (config.match(check.pattern)) {
        console.log(`  ✅ ${check.name}`);
      } else {
        console.error(`  ❌ ${check.name} missing`);
        allPass = false;
      }
    }

    return allPass;
  } catch (error) {
    console.error(`  ❌ Error reading config: ${error.message}`);
    return false;
  }
}

function checkPackageScripts() {
  console.log("\n📦 Checking package.json scripts...\n");

  if (!checkFileExists(PACKAGE_JSON, "package.json")) {
    return false;
  }

  try {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf-8"));
    const scripts = pkg.scripts || {};

    let allExist = true;
    for (const script of REQUIRED_TEST_SCRIPTS) {
      if (scripts[script]) {
        console.log(`  ✅ Script: ${script}`);
      } else {
        console.error(`  ❌ Script missing: ${script}`);
        allExist = false;
      }
    }

    return allExist;
  } catch (error) {
    console.error(`  ❌ Error reading package.json: ${error.message}`);
    return false;
  }
}

function checkTestStructure() {
  console.log("\n🔍 Checking test file structure...\n");

  let allValid = true;
  for (const file of REQUIRED_TEST_FILES) {
    const filePath = join(E2E_DIR, file);
    if (!existsSync(filePath)) {
      continue;
    }

    try {
      const content = readFileSync(filePath, "utf-8");

      const checks = [
        {
          name: "Imports Playwright",
          pattern: /from ['"]@playwright\/test['"]/,
        },
        { name: "Has test.describe", pattern: /test\.describe/ },
        { name: "Has test cases", pattern: /test\(/ },
      ];

      let fileValid = true;
      for (const check of checks) {
        if (content.match(check.pattern)) {
          console.log(`  ✅ ${file}: ${check.name}`);
        } else {
          console.error(`  ❌ ${file}: ${check.name} missing`);
          fileValid = false;
        }
      }

      if (!fileValid) {
        allValid = false;
      }
    } catch (error) {
      console.error(`  ❌ Error reading ${file}: ${error.message}`);
      allValid = false;
    }
  }

  return allValid;
}

function generateReport(results) {
  console.log("\n" + "=".repeat(60));
  console.log("📊 E2E Test Validation Report");
  console.log("=".repeat(60));

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter((r) => r).length;
  const failed = total - passed;

  console.log(`\nTotal Checks: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nProgress: ${Math.round((passed / total) * 100)}%`);

  if (failed === 0) {
    console.log("\n🎉 All checks passed! E2E tests are ready.");
  } else {
    console.log("\n⚠️  Some checks failed. Please review and fix issues.");
  }

  return failed === 0;
}

function main() {
  console.log("🔍 E2E Test Validation\n");

  const results = {
    testFiles: checkTestFiles(),
    configFile: checkConfigFile(),
    packageScripts: checkPackageScripts(),
    testStructure: checkTestStructure(),
  };

  const success = generateReport(results);
  process.exit(success ? 0 : 1);
}

main();
