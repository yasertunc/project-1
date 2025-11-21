#!/usr/bin/env node

/**
 * iOS Build Debug Script
 *
 * Comprehensive debugging for iOS EAS builds
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const MOBILE_DIR = join(rootDir, "apps/mobile");

function log(message) {
  console.log(`\n${message}`);
}

// Unused function - kept for potential future use
// function checkFile(filePath, description) {
//   if (existsSync(filePath)) {
//     log(`✅ ${description}: ${filePath}`);
//     return true;
//   } else {
//     log(`❌ ${description} missing: ${filePath}`);
//     return false;
//   }
// }

function checkPackageJson() {
  log("📦 Checking package.json...");

  const pkgPath = join(MOBILE_DIR, "package.json");
  if (!existsSync(pkgPath)) {
    log("  ❌ package.json not found!");
    return false;
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

    log(`  ✅ Name: ${pkg.name}`);
    log(`  ✅ Version: ${pkg.version}`);
    log(`  ✅ Expo: ${pkg.dependencies.expo || "not found"}`);
    log(`  ✅ React: ${pkg.dependencies.react || "not found"}`);
    log(
      `  ✅ React Native: ${pkg.dependencies["react-native"] || "not found"}`
    );

    // Check for problematic dependencies
    const problematic = [];
    if (pkg.dependencies.react && !pkg.dependencies.react.startsWith("19.1")) {
      problematic.push(
        `React version: ${pkg.dependencies.react} (should be 19.1.0)`
      );
    }

    if (problematic.length > 0) {
      log(`  ⚠️  Potential issues:`);
      problematic.forEach((issue) => log(`    - ${issue}`));
    }

    return true;
  } catch (error) {
    log(`  ❌ Error reading package.json: ${error.message}`);
    return false;
  }
}

function checkEasJson() {
  log("⚙️  Checking eas.json...");

  const easPath = join(MOBILE_DIR, "eas.json");
  if (!existsSync(easPath)) {
    log("  ❌ eas.json not found!");
    return false;
  }

  try {
    const eas = JSON.parse(readFileSync(easPath, "utf-8"));
    const profiles = eas.build || {};

    if (profiles["production-ios"]) {
      const profile = profiles["production-ios"];
      log(`  ✅ production-ios profile exists`);
      log(`    - Node: ${profile.node || "not specified"}`);
      log(`    - Auto increment: ${profile.autoIncrement || false}`);
      log(`    - Simulator: ${profile.ios?.simulator || false}`);
    } else {
      log(`  ❌ production-ios profile not found!`);
      return false;
    }

    return true;
  } catch (error) {
    log(`  ❌ Error reading eas.json: ${error.message}`);
    return false;
  }
}

function checkAppConfig() {
  log("📱 Checking app.config.ts...");

  const configPath = join(MOBILE_DIR, "app.config.ts");
  if (!existsSync(configPath)) {
    log("  ❌ app.config.ts not found!");
    return false;
  }

  try {
    const content = readFileSync(configPath, "utf-8");

    const checks = [
      { name: "Bundle ID", pattern: /bundleIdentifier.*com\.fellowus\.app/i },
      { name: "App name", pattern: /name.*Fellowus/i },
      { name: "Version", pattern: /version/i },
      { name: "EAS project ID", pattern: /projectId/i },
    ];

    let allPass = true;
    for (const check of checks) {
      if (content.match(check.pattern)) {
        log(`  ✅ ${check.name}`);
      } else {
        log(`  ⚠️  ${check.name} not found`);
        allPass = false;
      }
    }

    return allPass;
  } catch (error) {
    log(`  ❌ Error reading app.config.ts: ${error.message}`);
    return false;
  }
}

function checkNpmrc() {
  log("📝 Checking .npmrc...");

  const npmrcPath = join(MOBILE_DIR, ".npmrc");
  if (!existsSync(npmrcPath)) {
    log("  ⚠️  .npmrc not found (will be created)");
    return false;
  }

  try {
    const content = readFileSync(npmrcPath, "utf-8");
    log(`  ✅ .npmrc exists`);
    log(`  Content: ${content.trim()}`);
    return true;
  } catch (error) {
    log(`  ❌ Error reading .npmrc: ${error.message}`);
    return false;
  }
}

function checkNodeModules() {
  log("📚 Checking node_modules...");

  const nodeModulesPath = join(MOBILE_DIR, "node_modules");
  if (!existsSync(nodeModulesPath)) {
    log("  ❌ node_modules not found!");
    log("  💡 Run: npm install");
    return false;
  }

  log(`  ✅ node_modules exists`);
  return true;
}

function checkExpoInstall() {
  log("🔍 Running expo install --check...");

  try {
    execSync("npx expo install --check", {
      cwd: MOBILE_DIR,
      stdio: "pipe",
    });
    log("  ✅ Dependencies are up to date");
    return true;
  } catch (error) {
    log(`  ⚠️  expo install --check had issues`);
    log(`  Output: ${error.stdout?.toString() || error.message}`);
    return false;
  }
}

function getLatestBuildInfo() {
  log("📊 Getting latest build info...");

  try {
    const output = execSync(
      "npx eas-cli build:list --platform ios --limit 1 --non-interactive",
      {
        cwd: MOBILE_DIR,
        stdio: "pipe",
        encoding: "utf-8",
      }
    );

    log(`  ✅ Latest build info retrieved`);
    log(`  Output:\n${output}`);

    // Try to extract build ID and status
    const lines = output.split("\n");
    for (const line of lines) {
      if (line.includes("id:") || line.includes("status:")) {
        log(`    ${line.trim()}`);
      }
    }

    return true;
  } catch (error) {
    log(`  ⚠️  Could not get build info`);
    log(`  Error: ${error.message}`);
    log(`  💡 Make sure you're logged in: npx eas-cli login`);
    return false;
  }
}

function generateReport(results) {
  console.log("\n" + "=".repeat(60));
  console.log("📊 iOS Build Debug Report");
  console.log("=".repeat(60));

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter((r) => r).length;
  const failed = total - passed;

  console.log(`\nTotal Checks: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nProgress: ${Math.round((passed / total) * 100)}%`);

  if (failed > 0) {
    console.log("\n⚠️  Some checks failed. Please review and fix issues.");
    console.log("\n💡 Common Solutions:");
    console.log("  1. Run: npm install --legacy-peer-deps");
    console.log("  2. Run: npx expo install --fix");
    console.log(
      "  3. Check build logs: npx eas-cli build:list --platform ios --limit 1"
    );
    console.log(
      "  4. Try: npx eas-cli build --platform ios --profile production-ios --clear-cache"
    );
  } else {
    console.log("\n✅ All checks passed!");
    console.log("\n💡 If build still fails:");
    console.log("  1. Check build logs in Expo Dashboard");
    console.log(
      "  2. Try: npx eas-cli build --platform ios --profile production-ios --clear-cache"
    );
    console.log("  3. Check for specific error messages in build logs");
  }

  return failed === 0;
}

function main() {
  console.log("🔍 iOS Build Debug Script\n");
  console.log("=".repeat(60));

  const results = {
    packageJson: checkPackageJson(),
    easJson: checkEasJson(),
    appConfig: checkAppConfig(),
    npmrc: checkNpmrc(),
    nodeModules: checkNodeModules(),
    expoInstall: checkExpoInstall(),
    buildInfo: getLatestBuildInfo(),
  };

  const success = generateReport(results);
  process.exit(success ? 0 : 1);
}

main();
