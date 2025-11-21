#!/usr/bin/env node

/**
 * iOS Build Dependencies Fix Script
 *
 * Fixes common dependency issues for iOS EAS builds
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const MOBILE_DIR = join(rootDir, "apps/mobile");

const PACKAGE_JSON = join(MOBILE_DIR, "package.json");
const PACKAGE_LOCK = join(MOBILE_DIR, "package-lock.json");
const NPMRC = join(MOBILE_DIR, ".npmrc");

function log(message) {
  console.log(`\n${message}`);
}

function fixPackageJson() {
  log("📦 Fixing package.json...");

  if (!existsSync(PACKAGE_JSON)) {
    console.error("❌ package.json not found!");
    return false;
  }

  try {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf-8"));

    // Ensure React versions match Expo SDK 54
    if (pkg.dependencies.react !== "19.1.0") {
      log(`  ⚠️  React version: ${pkg.dependencies.react} → 19.1.0`);
      pkg.dependencies.react = "19.1.0";
    }

    if (pkg.dependencies["react-dom"] !== "19.1.0") {
      log(`  ⚠️  React DOM version: ${pkg.dependencies["react-dom"]} → 19.1.0`);
      pkg.dependencies["react-dom"] = "19.1.0";
    }

    // Ensure @types/react matches
    if (
      pkg.devDependencies["@types/react"] &&
      pkg.devDependencies["@types/react"] !== "19.1.10"
    ) {
      log(
        `  ⚠️  @types/react version: ${pkg.devDependencies["@types/react"]} → 19.1.10`
      );
      pkg.devDependencies["@types/react"] = "19.1.10";
    }

    writeFileSync(PACKAGE_JSON, JSON.stringify(pkg, null, 2) + "\n");
    log("  ✅ package.json fixed");
    return true;
  } catch (error) {
    console.error(`  ❌ Error fixing package.json: ${error.message}`);
    return false;
  }
}

function createNpmrc() {
  log("📝 Creating .npmrc...");

  const npmrcContent = `legacy-peer-deps=true
engine-strict=false
`;

  try {
    writeFileSync(NPMRC, npmrcContent);
    log("  ✅ .npmrc created");
    return true;
  } catch (error) {
    console.error(`  ❌ Error creating .npmrc: ${error.message}`);
    return false;
  }
}

function cleanDependencies() {
  log("🧹 Cleaning dependencies...");

  try {
    // Remove package-lock.json
    if (existsSync(PACKAGE_LOCK)) {
      unlinkSync(PACKAGE_LOCK);
      log("  ✅ package-lock.json removed");
    }

    // Remove node_modules (optional, commented out for safety)
    // if (existsSync(NODE_MODULES)) {
    //   execSync(`rm -rf "${NODE_MODULES}"`, { cwd: MOBILE_DIR });
    //   log('  ✅ node_modules removed');
    // }

    return true;
  } catch (error) {
    console.error(`  ❌ Error cleaning: ${error.message}`);
    return false;
  }
}

function installDependencies() {
  log("📥 Installing dependencies...");

  try {
    execSync("npm install --legacy-peer-deps", {
      cwd: MOBILE_DIR,
      stdio: "inherit",
    });
    log("  ✅ Dependencies installed");
    return true;
  } catch (error) {
    console.error(`  ❌ Error installing dependencies: ${error.message}`);
    return false;
  }
}

function verifyExpoInstall() {
  log("🔍 Verifying Expo dependencies...");

  try {
    execSync("npx expo install --check", {
      cwd: MOBILE_DIR,
      stdio: "inherit",
    });
    log("  ✅ Expo dependencies verified");
    return true;
  } catch (error) {
    console.warn(`  ⚠️  Expo install check had issues: ${error.message}`);
    return false;
  }
}

function main() {
  console.log("🔧 iOS Build Dependencies Fix Script\n");
  console.log("=".repeat(60));

  const results = {
    packageJson: fixPackageJson(),
    npmrc: createNpmrc(),
    clean: cleanDependencies(),
    install: installDependencies(),
    verify: verifyExpoInstall(),
  };

  console.log("\n" + "=".repeat(60));
  console.log("📊 Fix Summary");
  console.log("=".repeat(60));

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter((r) => r).length;

  console.log(`\nTotal Steps: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${total - passed}`);

  if (passed === total) {
    console.log("\n🎉 All fixes applied successfully!");
    console.log("\n📋 Next Steps:");
    console.log("  1. Try building again:");
    console.log(
      "     npx eas-cli build --platform ios --profile production-ios --clear-cache"
    );
    console.log("  2. If it still fails, check build logs:");
    console.log("     npx eas-cli build:list --platform ios --limit 1");
    return 0;
  } else {
    console.log("\n⚠️  Some fixes failed. Please review errors above.");
    return 1;
  }
}

main();
