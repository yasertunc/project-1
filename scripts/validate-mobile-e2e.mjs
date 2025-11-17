#!/usr/bin/env node

/**
 * Mobile E2E Validation Script
 * 
 * Validates mobile E2E testing setup (Detox, build scripts, manual testing)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const MOBILE_DIR = join(rootDir, 'apps/mobile');

const DETOX_CONFIG = join(MOBILE_DIR, 'detox.config.ts');
const BUILD_SCRIPTS = [
  join(MOBILE_DIR, 'scripts/build-dev-client.mjs'),
  join(MOBILE_DIR, 'scripts/build-dev-client.sh'),
  join(MOBILE_DIR, 'scripts/build-dev-client.ps1'),
];
const MANUAL_TESTING_CHECKLIST = join(rootDir, 'docs/mobile-e2e-manual-testing-checklist.md');
const MOBILE_E2E_ALTERNATIVES = join(rootDir, 'docs/mobile-e2e-alternatives.md');

function checkFileExists(filePath, description) {
  if (existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.error(`❌ ${description} missing: ${filePath}`);
    return false;
  }
}

function checkDetoxConfig() {
  console.log('\n🧪 Checking Detox configuration...\n');
  
  if (!checkFileExists(DETOX_CONFIG, 'Detox config')) {
    return false;
  }
  
  try {
    const content = readFileSync(DETOX_CONFIG, 'utf-8');
    
    const checks = [
      { name: 'Detox configuration present', pattern: /detox|config/i },
      { name: 'Test runner configured', pattern: /jest|mocha/i },
      { name: 'Device configuration', pattern: /device|emulator/i },
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
    
    return allPass;
  } catch (error) {
    console.error(`  ❌ Error reading Detox config: ${error.message}`);
    return false;
  }
}

function checkBuildScripts() {
  console.log('\n🔨 Checking build scripts...\n');
  
  let allExist = true;
  for (const script of BUILD_SCRIPTS) {
    const fileName = script.split(/[/\\]/).pop();
    if (!checkFileExists(script, `Build script: ${fileName}`)) {
      allExist = false;
    }
  }
  
  return allExist;
}

function checkPackageJsonScripts() {
  console.log('\n📦 Checking package.json scripts...\n');
  
  const packageJsonPath = join(MOBILE_DIR, 'package.json');
  if (!existsSync(packageJsonPath)) {
    console.error(`  ❌ package.json not found: ${packageJsonPath}`);
    return false;
  }
  
  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const scripts = pkg.scripts || {};
    
    const requiredScripts = [
      'build:dev-client:android',
      'build:dev-client:ios',
    ];
    
    let allExist = true;
    for (const script of requiredScripts) {
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

function checkDocumentation() {
  console.log('\n📚 Checking documentation...\n');
  
  const docs = [
    { path: MANUAL_TESTING_CHECKLIST, name: 'Manual testing checklist' },
    { path: MOBILE_E2E_ALTERNATIVES, name: 'Mobile E2E alternatives guide' },
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
  console.log('\n' + '='.repeat(60));
  console.log('📊 Mobile E2E Validation Report');
  console.log('='.repeat(60));
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;
  const failed = total - passed;
  
  console.log(`\nTotal Checks: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nProgress: ${Math.round((passed / total) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All checks passed! Mobile E2E setup is ready.');
  } else {
    console.log('\n⚠️  Some checks failed. Please review and fix issues.');
  }
  
  return failed === 0;
}

function main() {
  console.log('📱 Mobile E2E Validation\n');
  
  const results = {
    detoxConfig: checkDetoxConfig(),
    buildScripts: checkBuildScripts(),
    packageScripts: checkPackageJsonScripts(),
    documentation: checkDocumentation(),
  };
  
  const success = generateReport(results);
  process.exit(success ? 0 : 1);
}

main();

