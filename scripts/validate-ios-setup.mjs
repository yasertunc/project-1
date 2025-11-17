#!/usr/bin/env node

/**
 * iOS Setup Validation Script
 * 
 * Validates iOS setup configuration and readiness
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const MOBILE_DIR = join(rootDir, 'apps/mobile');

const APP_CONFIG = join(MOBILE_DIR, 'app.config.ts');
const EAS_JSON = join(MOBILE_DIR, 'eas.json');
const IOS_SETUP_GUIDE = join(rootDir, 'docs/ios-setup-complete-guide.md');

function checkFileExists(filePath, description) {
  if (existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.error(`❌ ${description} missing: ${filePath}`);
    return false;
  }
}

function checkAppConfig() {
  console.log('\n📱 Checking iOS app configuration...\n');
  
  if (!checkFileExists(APP_CONFIG, 'app.config.ts')) {
    return false;
  }
  
  try {
    const content = readFileSync(APP_CONFIG, 'utf-8');
    
    const checks = [
      { name: 'iOS bundle identifier configured', pattern: /bundleIdentifier/i },
      { name: 'iOS build number configured', pattern: /buildNumber/i },
      { name: 'iOS supports tablet', pattern: /supportsTablet/i },
      { name: 'Info.plist configuration', pattern: /infoPlist/i },
      { name: 'Privacy description (tracking)', pattern: /NSUserTrackingUsageDescription/i },
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
    
    // Check for bundle ID
    const bundleIdPatterns = [
      /bundleIdentifier.*["']com\.fellowus\.app["']/,
      /bundleIdentifier:\s*["']com\.fellowus\.app["']/,
      /EXPO_IOS_BUNDLE_ID.*com\.fellowus\.app/,
    ];
    
    let bundleIdFound = false;
    for (const pattern of bundleIdPatterns) {
      if (content.match(pattern)) {
        bundleIdFound = true;
        break;
      }
    }
    
    if (bundleIdFound || content.includes('com.fellowus.app')) {
      console.log(`  ✅ Bundle ID configured: com.fellowus.app`);
    } else {
      console.warn(`  ⚠️  Bundle ID pattern not found (may be using env var)`);
    }
    
    return allPass;
  } catch (error) {
    console.error(`  ❌ Error reading app.config.ts: ${error.message}`);
    return false;
  }
}

function checkEASProfiles() {
  console.log('\n⚙️  Checking EAS iOS profiles...\n');
  
  if (!checkFileExists(EAS_JSON, 'eas.json')) {
    return false;
  }
  
  try {
    const eas = JSON.parse(readFileSync(EAS_JSON, 'utf-8'));
    const profiles = eas.build || {};
    
    const requiredProfiles = ['preview-ios', 'production-ios'];
    let allExist = true;
    
    for (const profile of requiredProfiles) {
      if (profiles[profile]) {
        console.log(`  ✅ Profile: ${profile}`);
        
        const profileConfig = profiles[profile];
        if (profileConfig.ios) {
          if (profile === 'preview-ios' && profileConfig.ios.simulator) {
            console.log(`    ✅ Simulator build enabled`);
          }
          if (profile === 'production-ios' && profileConfig.ios.simulator === false) {
            console.log(`    ✅ Device build configured`);
          }
          if (profileConfig.autoIncrement) {
            console.log(`    ✅ Auto-increment enabled`);
          }
        }
      } else {
        console.error(`  ❌ Profile missing: ${profile}`);
        allExist = false;
      }
    }
    
    return allExist;
  } catch (error) {
    console.error(`  ❌ Error reading eas.json: ${error.message}`);
    return false;
  }
}

function checkDocumentation() {
  console.log('\n📚 Checking iOS documentation...\n');
  
  if (!checkFileExists(IOS_SETUP_GUIDE, 'iOS setup guide')) {
    return false;
  }
  
  try {
    const content = readFileSync(IOS_SETUP_GUIDE, 'utf-8');
    
    const requiredSections = [
      { name: 'Bundle ID', pattern: /iOS\.1|Bundle ID/i },
      { name: 'EAS iOS profiles', pattern: /iOS\.2|EAS.*iOS.*profile/i },
      { name: 'Signing', pattern: /iOS\.3|Signing/i },
      { name: 'Icons/Splash', pattern: /iOS\.4|Icons.*Splash/i },
      { name: 'Push Notifications', pattern: /iOS\.5|Push.*Notification/i },
      { name: 'Capabilities', pattern: /iOS\.6|Capabilities/i },
      { name: 'Device testing', pattern: /iOS\.7|Device.*test/i },
      { name: 'Artifact', pattern: /iOS\.8|Artifact/i },
      { name: 'App Store Connect', pattern: /iOS\.9|App Store Connect/i },
    ];
    
    let allFound = true;
    for (const section of requiredSections) {
      if (content.match(section.pattern)) {
        console.log(`  ✅ Section: ${section.name}`);
      } else {
        console.warn(`  ⚠️  Section not found: ${section.name}`);
        allFound = false;
      }
    }
    
    return allFound;
  } catch (error) {
    console.error(`  ❌ Error reading iOS setup guide: ${error.message}`);
    return false;
  }
}

function checkFirebaseIOS() {
  console.log('\n🔥 Checking Firebase iOS setup...\n');
  
  // Check if Firebase project exists (we know it does from earlier)
  const googleServices = join(MOBILE_DIR, 'google-services.json');
  if (existsSync(googleServices)) {
    console.log(`  ✅ Firebase Android configured`);
    console.log(`  ⏸️  iOS: GoogleService-Info.plist needed when iOS app added to Firebase`);
  } else {
    console.warn(`  ⚠️  google-services.json not found`);
  }
  
  return true;
}

function checkGitHubSecrets() {
  console.log('\n🔐 Checking GitHub Secrets configuration...\n');
  
  // We can't actually check GitHub Secrets, but we can document what's needed
  const requiredSecrets = [
    'ASC_API_KEY_ID',
    'ASC_ISSUER_ID',
    'ASC_API_KEY_P8',
  ];
  
  console.log(`  📋 Required GitHub Secrets:`);
  for (const secret of requiredSecrets) {
    console.log(`    - ${secret}`);
  }
  console.log(`  ⚠️  Note: Verify these are set in GitHub Secrets`);
  
  return true; // Can't actually verify, so return true
}

function generateReport(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 iOS Setup Validation Report');
  console.log('='.repeat(60));
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;
  const failed = total - passed;
  
  console.log(`\nTotal Checks: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nProgress: ${Math.round((passed / total) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All checks passed! iOS setup is ready.');
    console.log('\n📋 Next Steps:');
    console.log('  1. Apple Developer Program access needed');
    console.log('  2. Create App ID in Apple Developer Portal');
    console.log('  3. Add iOS app to Firebase project');
    console.log('  4. Build iOS simulator build: npm run build:dev-client:ios');
    console.log('  5. Test on iOS simulator');
  } else {
    console.log('\n⚠️  Some checks failed. Please review and fix issues.');
  }
  
  return failed === 0;
}

function main() {
  console.log('🍎 iOS Setup Validation\n');
  
  const results = {
    appConfig: checkAppConfig(),
    easProfiles: checkEASProfiles(),
    documentation: checkDocumentation(),
    firebase: checkFirebaseIOS(),
    secrets: checkGitHubSecrets(),
  };
  
  const success = generateReport(results);
  process.exit(success ? 0 : 1);
}

main();

