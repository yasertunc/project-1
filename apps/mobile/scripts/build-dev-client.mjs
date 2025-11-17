#!/usr/bin/env node
/**
 * Build Expo Dev Client for testing
 * Usage: node scripts/build-dev-client.mjs [android|ios]
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const platform = process.argv[2] || 'android';

if (!['android', 'ios'].includes(platform)) {
  console.error('❌ Invalid platform. Use "android" or "ios"');
  process.exit(1);
}

console.log(`Building Expo Dev Client for ${platform}...`);

try {
  if (platform === 'android') {
    console.log('Building Android Dev Client APK...');
    execSync('npx expo run:android --variant release --no-install', {
      cwd: rootDir,
      stdio: 'inherit',
    });

    // Copy APK to artifacts directory
    const artifactsDir = join(rootDir, 'artifacts', 'android');
    if (!existsSync(artifactsDir)) {
      mkdirSync(artifactsDir, { recursive: true });
    }

    const apkPath = join(rootDir, 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
    const destPath = join(artifactsDir, 'FellowusMobile-dev-client.apk');

    if (existsSync(apkPath)) {
      copyFileSync(apkPath, destPath);
      console.log(`✅ Dev Client APK copied to ${destPath}`);
    } else {
      console.error('❌ APK not found. Build may have failed.');
      process.exit(1);
    }
  } else if (platform === 'ios') {
    console.log('Building iOS Dev Client...');
    execSync('npx expo run:ios --configuration Release --no-install', {
      cwd: rootDir,
      stdio: 'inherit',
    });
    console.log('✅ iOS Dev Client built. Use Xcode to export IPA if needed.');
  }

  console.log('✅ Dev Client build complete!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

