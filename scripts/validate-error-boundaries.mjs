#!/usr/bin/env node

/**
 * Error Boundary Validation Script
 *
 * Validates error boundary implementation and test utilities
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const ERROR_BOUNDARY_FILE = join(rootDir, "src/components/ErrorBoundary.tsx");
const HOMEPAGE_FILE = join(rootDir, "src/components/Homepage.tsx");
const FAILURES_TEST_FILE = join(rootDir, "e2e/failures.spec.ts");
const API_FAILURES_TEST_FILE = join(rootDir, "e2e/api-failures.spec.ts");

function checkFileExists(filePath, description) {
  if (existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.error(`❌ ${description} missing: ${filePath}`);
    return false;
  }
}

function checkErrorBoundaryImplementation() {
  console.log("\n🛡️  Checking Error Boundary implementation...\n");

  if (!checkFileExists(ERROR_BOUNDARY_FILE, "ErrorBoundary component")) {
    return false;
  }

  try {
    const content = readFileSync(ERROR_BOUNDARY_FILE, "utf-8");

    const checks = [
      {
        name: "Class component extends React.Component",
        pattern: /class.*ErrorBoundary.*extends.*React\.Component/,
      },
      { name: "componentDidCatch method", pattern: /componentDidCatch/ },
      { name: "Error state management", pattern: /hasError|error/ },
      { name: "Fallback UI rendering", pattern: /fallback|error.*ui/i },
    ];

    let allPass = true;
    for (const check of checks) {
      if (content.match(check.pattern)) {
        console.log(`  ✅ ${check.name}`);
      } else {
        console.error(`  ❌ ${check.name} missing`);
        allPass = false;
      }
    }

    return allPass;
  } catch (error) {
    console.error(`  ❌ Error reading ErrorBoundary: ${error.message}`);
    return false;
  }
}

function checkHomepageErrorBoundaries() {
  console.log("\n🏠 Checking Homepage error boundary usage...\n");

  if (!checkFileExists(HOMEPAGE_FILE, "Homepage component")) {
    return false;
  }

  try {
    const content = readFileSync(HOMEPAGE_FILE, "utf-8");

    const checks = [
      { name: "ErrorBoundary imported", pattern: /import.*ErrorBoundary/ },
      {
        name: "Force error utility declared",
        pattern: /__FELLOWUS_FORCE_SECTION_ERROR/,
      },
      {
        name: "ErrorBoundary used for lazy sections",
        pattern: /<ErrorBoundary/,
      },
      {
        name: "SectionGuard component",
        pattern: /SectionGuard|shouldForceSectionError/,
      },
    ];

    let allPass = true;
    for (const check of checks) {
      if (content.match(check.pattern)) {
        console.log(`  ✅ ${check.name}`);
      } else {
        console.error(`  ❌ ${check.name} missing`);
        allPass = false;
      }
    }

    // Count ErrorBoundary usage
    const matches = content.match(/<ErrorBoundary/g);
    const count = matches ? matches.length : 0;
    console.log(`  📊 ErrorBoundary usage count: ${count}`);

    if (count >= 2) {
      console.log(`  ✅ Multiple error boundaries found (good coverage)`);
    } else {
      console.warn(`  ⚠️  Only ${count} error boundary(ies) found`);
    }

    return allPass;
  } catch (error) {
    console.error(`  ❌ Error reading Homepage: ${error.message}`);
    return false;
  }
}

function checkFailureTests() {
  console.log("\n🧪 Checking failure scenario tests...\n");

  const testFiles = [
    { path: FAILURES_TEST_FILE, name: "UI failures test" },
    { path: API_FAILURES_TEST_FILE, name: "API failures test" },
  ];

  let allExist = true;
  let allValid = true;

  for (const testFile of testFiles) {
    if (!checkFileExists(testFile.path, testFile.name)) {
      allExist = false;
      continue;
    }

    try {
      const content = readFileSync(testFile.path, "utf-8");

      const checks = [
        { name: "Uses Playwright", pattern: /from ['"]@playwright\/test['"]/ },
        { name: "Has test cases", pattern: /test\(/ },
        { name: "Tests error scenarios", pattern: /error|failure|fail/i },
      ];

      let fileValid = true;
      for (const check of checks) {
        if (content.match(check.pattern)) {
          console.log(`  ✅ ${testFile.name}: ${check.name}`);
        } else {
          console.error(`  ❌ ${testFile.name}: ${check.name} missing`);
          fileValid = false;
        }
      }

      if (!fileValid) {
        allValid = false;
      }
    } catch (error) {
      console.error(`  ❌ Error reading ${testFile.name}: ${error.message}`);
      allValid = false;
    }
  }

  return allExist && allValid;
}

function checkAPIFailureScenarios() {
  console.log("\n🌐 Checking API failure scenario coverage...\n");

  if (!existsSync(API_FAILURES_TEST_FILE)) {
    return false;
  }

  try {
    const content = readFileSync(API_FAILURES_TEST_FILE, "utf-8");

    const requiredScenarios = [
      { name: "400 Bad Request", pattern: /400|bad.*request/i },
      { name: "401 Unauthorized", pattern: /401|unauthorized/i },
      { name: "404 Not Found", pattern: /404|not.*found/i },
      { name: "429 Rate Limit", pattern: /429|rate.*limit/i },
      { name: "500 Server Error", pattern: /500|server.*error/i },
      { name: "503 Service Unavailable", pattern: /503|service.*unavailable/i },
      { name: "Timeout", pattern: /timeout/i },
      { name: "Offline", pattern: /offline|network.*error/i },
    ];

    let allCovered = true;
    for (const scenario of requiredScenarios) {
      if (content.match(scenario.pattern)) {
        console.log(`  ✅ ${scenario.name} covered`);
      } else {
        console.warn(`  ⚠️  ${scenario.name} not found`);
        allCovered = false;
      }
    }

    return allCovered;
  } catch (error) {
    console.error(`  ❌ Error reading API failures test: ${error.message}`);
    return false;
  }
}

function generateReport(results) {
  console.log("\n" + "=".repeat(60));
  console.log("📊 Error Boundary Validation Report");
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
      "\n🎉 All checks passed! Error boundaries are properly implemented."
    );
  } else {
    console.log("\n⚠️  Some checks failed. Please review and fix issues.");
  }

  return failed === 0;
}

function main() {
  console.log("🛡️  Error Boundary Validation\n");

  const results = {
    errorBoundaryImpl: checkErrorBoundaryImplementation(),
    homepageUsage: checkHomepageErrorBoundaries(),
    failureTests: checkFailureTests(),
    apiFailureScenarios: checkAPIFailureScenarios(),
  };

  const success = generateReport(results);
  process.exit(success ? 0 : 1);
}

main();
