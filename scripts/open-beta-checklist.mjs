#!/usr/bin/env node

/**
 * Open Beta Launch Checklist
 * Validates prerequisites and readiness for open beta launch
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CHECKLIST_ITEMS = [
  {
    category: 'Prerequisites',
    items: [
      { id: 'internal-testing', label: 'Internal testing track validated', check: () => true }, // Manual check
      { id: 'no-p0-bugs', label: 'No P0/P1 bugs in internal testing', check: () => true }, // Manual check
      { id: 'privacy-policy', label: 'Privacy policy published', check: () => existsSync('public/privacy/index.html') },
      { id: 'terms-of-service', label: 'Terms of service published', check: () => existsSync('public/terms/index.html') },
      { id: 'store-listing', label: 'Store listing content ready', check: () => true }, // Manual check
      { id: 'support-channels', label: 'Support channels established', check: () => true }, // Manual check
    ],
  },
  {
    category: 'Android Play Console',
    items: [
      { id: 'open-testing-track', label: 'Open testing track created', check: () => true }, // Manual check
      { id: 'release-notes', label: 'Release notes prepared', check: () => true }, // Manual check
      { id: 'store-listing-beta', label: 'Store listing with beta disclaimer', check: () => true }, // Manual check
      { id: 'content-rating', label: 'Content rating completed', check: () => true }, // Manual check
      { id: 'rollout-percentage', label: 'Initial rollout percentage set (10-20%)', check: () => true }, // Manual check
    ],
  },
  {
    category: 'iOS TestFlight',
    items: [
      { id: 'public-link', label: 'Public TestFlight link created', check: () => true }, // Manual check
      { id: 'beta-app-review', label: 'Beta App Review passed', check: () => true }, // Manual check
      { id: 'test-information', label: 'Test information provided', check: () => true }, // Manual check
      { id: 'capacity-set', label: 'Tester capacity set', check: () => true }, // Manual check
    ],
  },
  {
    category: 'Monitoring & Metrics',
    items: [
      { id: 'sentry-alerts', label: 'Sentry alerts configured for beta', check: () => true }, // Manual check
      { id: 'analytics-setup', label: 'Analytics tracking configured', check: () => true }, // Manual check
      { id: 'crash-reporting', label: 'Crash reporting active', check: () => true }, // Manual check
      { id: 'feedback-mechanism', label: 'Feedback collection mechanism ready', check: () => true }, // Manual check
    ],
  },
  {
    category: 'Communication',
    items: [
      { id: 'announcement-ready', label: 'Beta announcement prepared', check: () => true }, // Manual check
      { id: 'support-email', label: 'Support email configured', check: () => true }, // Manual check
      { id: 'community-channels', label: 'Community channels ready', check: () => true }, // Manual check
    ],
  },
];

function checkItem(item) {
  try {
    return item.check();
  } catch (error) {
    console.error(`Error checking ${item.id}:`, error.message);
    return false;
  }
}

function runChecklist() {
  console.log('🔍 Open Beta Launch Checklist\n');
  console.log('=' .repeat(60));
  
  let totalItems = 0;
  let passedItems = 0;
  let failedItems = 0;
  let manualItems = 0;

  for (const category of CHECKLIST_ITEMS) {
    console.log(`\n📋 ${category.category}`);
    console.log('-'.repeat(60));
    
    for (const item of category.items) {
      totalItems++;
      const passed = checkItem(item);
      const isManual = item.check.toString().includes('Manual check') || item.check.toString().includes('true');
      
      if (isManual) {
        manualItems++;
        console.log(`  ⚠️  ${item.label} (manual check required)`);
      } else if (passed) {
        passedItems++;
        console.log(`  ✅ ${item.label}`);
      } else {
        failedItems++;
        console.log(`  ❌ ${item.label}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`  Total items: ${totalItems}`);
  console.log(`  ✅ Passed: ${passedItems}`);
  console.log(`  ❌ Failed: ${failedItems}`);
  console.log(`  ⚠️  Manual: ${manualItems}`);
  
  const automatedPassed = passedItems;
  const automatedTotal = totalItems - manualItems;
  const automatedPercentage = automatedTotal > 0 
    ? Math.round((automatedPassed / automatedTotal) * 100) 
    : 0;
  
  console.log(`\n  Automated checks: ${automatedPassed}/${automatedTotal} (${automatedPercentage}%)`);
  
  if (failedItems > 0) {
    console.log('\n⚠️  Some checks failed. Please review and fix before proceeding.');
    process.exit(1);
  } else if (manualItems > 0) {
    console.log('\n⚠️  Some items require manual verification. Please review the checklist.');
    process.exit(0);
  } else {
    console.log('\n✅ All automated checks passed!');
    process.exit(0);
  }
}

runChecklist();

