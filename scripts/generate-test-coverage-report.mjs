#!/usr/bin/env node

/**
 * E2E Test Coverage Report Generator
 * 
 * Analyzes E2E test files and generates a coverage report
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const E2E_DIR = join(rootDir, 'e2e');

const TEST_CATEGORIES = {
  flow: 'Flow-based Tests',
  failure: 'Failure Scenario Tests',
  smoke: 'Smoke Tests',
  accessibility: 'Accessibility Tests',
  performance: 'Performance Tests',
};

function getAllTestFiles() {
  if (!existsSync(E2E_DIR)) {
    return [];
  }
  
  return readdirSync(E2E_DIR)
    .filter(file => file.endsWith('.spec.ts'))
    .map(file => join(E2E_DIR, file));
}

function analyzeTestFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const fileName = filePath.split(/[/\\]/).pop();
    
    // Count test cases
    const testMatches = content.match(/test\(/g);
    const testCount = testMatches ? testMatches.length : 0;
    
    // Count describe blocks
    const describeMatches = content.match(/test\.describe\(/g);
    const describeCount = describeMatches ? describeMatches.length : 0;
    
    // Detect test category
    let category = 'Other';
    for (const [key, value] of Object.entries(TEST_CATEGORIES)) {
      if (fileName.includes(key) || content.includes(`@${key}`)) {
        category = value;
        break;
      }
    }
    
    // Check for route mocking
    const hasRouteMocking = content.includes('route') || content.includes('intercept');
    
    // Check for assertions
    const hasAssertions = content.includes('expect(') || content.includes('toHave');
    
    // Check for error handling
    const hasErrorHandling = content.includes('error') || content.includes('catch');
    
    return {
      file: fileName,
      path: filePath,
      testCount,
      describeCount,
      category,
      hasRouteMocking,
      hasAssertions,
      hasErrorHandling,
      lines: content.split('\n').length,
    };
  } catch (error) {
    return {
      file: filePath.split(/[/\\]/).pop(),
      error: error.message,
    };
  }
}

function generateReport(analyses) {
  const totalTests = analyses.reduce((sum, a) => sum + (a.testCount || 0), 0);
  const totalDescribes = analyses.reduce((sum, a) => sum + (a.describeCount || 0), 0);
  const totalLines = analyses.reduce((sum, a) => sum + (a.lines || 0), 0);
  
  // Group by category
  const byCategory = {};
  for (const analysis of analyses) {
    if (!analysis.error) {
      const cat = analysis.category;
      if (!byCategory[cat]) {
        byCategory[cat] = [];
      }
      byCategory[cat].push(analysis);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 E2E Test Coverage Report');
  console.log('='.repeat(70));
  
  console.log(`\n📁 Total Test Files: ${analyses.length}`);
  console.log(`🧪 Total Test Cases: ${totalTests}`);
  console.log(`📦 Total Describe Blocks: ${totalDescribes}`);
  console.log(`📝 Total Lines of Code: ${totalLines}`);
  
  console.log('\n📋 Coverage by Category:');
  for (const [category, files] of Object.entries(byCategory)) {
    const categoryTests = files.reduce((sum, f) => sum + f.testCount, 0);
    console.log(`\n  ${category}:`);
    console.log(`    Files: ${files.length}`);
    console.log(`    Test Cases: ${categoryTests}`);
    for (const file of files) {
      console.log(`      - ${file.file}: ${file.testCount} tests`);
    }
  }
  
  console.log('\n✅ Test Quality Metrics:');
  const withRouteMocking = analyses.filter(a => a.hasRouteMocking).length;
  const withAssertions = analyses.filter(a => a.hasAssertions).length;
  const withErrorHandling = analyses.filter(a => a.hasErrorHandling).length;
  
  console.log(`  Route Mocking: ${withRouteMocking}/${analyses.length} files (${Math.round(withRouteMocking/analyses.length*100)}%)`);
  console.log(`  Assertions: ${withAssertions}/${analyses.length} files (${Math.round(withAssertions/analyses.length*100)}%)`);
  console.log(`  Error Handling: ${withErrorHandling}/${analyses.length} files (${Math.round(withErrorHandling/analyses.length*100)}%)`);
  
  if (analyses.some(a => a.error)) {
    console.log('\n❌ Files with Errors:');
    for (const analysis of analyses) {
      if (analysis.error) {
        console.log(`  - ${analysis.file}: ${analysis.error}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(70));
  
  return {
    totalFiles: analyses.length,
    totalTests,
    totalDescribes,
    totalLines,
    byCategory,
    quality: {
      routeMocking: withRouteMocking,
      assertions: withAssertions,
      errorHandling: withErrorHandling,
    },
  };
}

function main() {
  console.log('🔍 Analyzing E2E Test Coverage...\n');
  
  const testFiles = getAllTestFiles();
  
  if (testFiles.length === 0) {
    console.error('❌ No test files found in e2e/ directory');
    process.exit(1);
  }
  
  const analyses = testFiles.map(analyzeTestFile);
  const report = generateReport(analyses);
  
  // Save report to file
  const reportPath = join(rootDir, 'e2e-coverage-report.json');
  try {
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);
  } catch (error) {
    console.warn(`\n⚠️  Could not save report: ${error.message}`);
  }
  
  process.exit(0);
}

main();

