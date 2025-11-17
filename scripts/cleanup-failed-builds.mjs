#!/usr/bin/env node

/**
 * Cleanup Failed Builds Script
 * 
 * Lists and optionally deletes failed/errored builds from EAS
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const MOBILE_DIR = join(rootDir, 'apps/mobile');

function log(message) {
  console.log(`\n${message}`);
}

function getBuilds(platform, limit = 50) {
  try {
    const output = execSync(
      `npx eas-cli build:list --platform ${platform} --limit ${limit} --non-interactive --json`,
      {
        cwd: MOBILE_DIR,
        stdio: 'pipe',
        encoding: 'utf-8',
      }
    );
    
    try {
      return JSON.parse(output.trim());
    } catch {
      // If JSON parsing fails, try to extract from text output
      log(`⚠️  Could not parse JSON output for ${platform}`);
      return [];
    }
  } catch (error) {
    log(`❌ Error getting builds for ${platform}: ${error.message}`);
    return [];
  }
}

// Unused function - kept for potential future use
// function deleteBuild(buildId, platform) {
//   try {
//     execSync(
//       `npx eas-cli build:delete ${buildId} --non-interactive`,
//       {
//         cwd: MOBILE_DIR,
//         stdio: 'inherit',
//       }
//     );
//     log(`  ✅ Deleted ${platform} build: ${buildId}`);
//     return true;
//   } catch (error) {
//     log(`  ❌ Failed to delete ${platform} build ${buildId}: ${error.message}`);
//     return false;
//   }
// }

function main() {
  console.log('🧹 EAS Build Cleanup Script\n');
  console.log('='.repeat(60));
  
  const platforms = ['ios', 'android'];
  const failedStatuses = ['errored', 'canceled', 'failed'];
  let totalFailed = 0;
  
  for (const platform of platforms) {
    log(`\n📱 Checking ${platform.toUpperCase()} builds...`);
    
    const builds = getBuilds(platform, 50);
    
    if (!Array.isArray(builds) || builds.length === 0) {
      log(`  ⚠️  No builds found or could not parse output`);
      continue;
    }
    
    const failedBuilds = builds.filter(build => 
      failedStatuses.includes(build.status?.toLowerCase())
    );
    
    totalFailed += failedBuilds.length;
    
    if (failedBuilds.length === 0) {
      log(`  ✅ No failed builds found`);
      continue;
    }
    
    log(`  📊 Found ${failedBuilds.length} failed build(s):`);
    
    for (const build of failedBuilds) {
      const buildId = build.id || build.ID;
      const status = build.status || 'unknown';
      const createdAt = build.createdAt || build['Started at'] || 'unknown';
      
      log(`    - ${buildId} (${status}) - ${createdAt}`);
    }
    
    // Ask for confirmation (in non-interactive mode, we'll just list)
    log(`\n  💡 To delete these builds, run:`);
    for (const build of failedBuilds) {
      const buildId = build.id || build.ID;
      log(`    npx eas-cli build:delete ${buildId} --non-interactive`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Cleanup Summary');
  console.log('='.repeat(60));
  console.log(`\nTotal Failed Builds: ${totalFailed}`);
  console.log(`\n💡 To delete all failed builds, use the commands above.`);
  console.log(`\n⚠️  Note: Build deletion is permanent and cannot be undone.`);
}

main();
