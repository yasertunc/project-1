#!/usr/bin/env node
/**
 * E2E Test Report Generator
 *
 * Generates a comprehensive test report from Playwright test results
 * and provides summary statistics for CI/CD integration.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PLAYWRIGHT_REPORT_DIR = join(process.cwd(), "playwright-report");

function readJSONFile(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.warn(`Failed to read ${filePath}:`, error.message);
    return null;
  }
}

function generateReport() {
  console.log("📊 E2E Test Report Generator\n");

  // Try to read Playwright report
  const reportPath = join(PLAYWRIGHT_REPORT_DIR, "index.json");
  const report = readJSONFile(reportPath);

  if (!report) {
    console.log("⚠️  No test results found. Run tests first:");
    console.log("   npm run test:e2e:all\n");
    return;
  }

  const stats = {
    total: report.stats?.total || 0,
    passed: report.stats?.passed || 0,
    failed: report.stats?.failed || 0,
    skipped: report.stats?.skipped || 0,
    flaky: report.stats?.flaky || 0,
    duration: report.stats?.duration || 0,
  };

  const passRate =
    stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : 0;

  console.log("📈 Test Summary");
  console.log("─".repeat(50));
  console.log(`Total Tests:     ${stats.total}`);
  console.log(`✅ Passed:       ${stats.passed} (${passRate}%)`);
  console.log(`❌ Failed:       ${stats.failed}`);
  console.log(`⏭️  Skipped:      ${stats.skipped}`);
  console.log(`🔄 Flaky:        ${stats.flaky}`);
  console.log(`⏱️  Duration:     ${(stats.duration / 1000).toFixed(2)}s`);
  console.log("─".repeat(50));

  // Test file breakdown
  if (report.files && report.files.length > 0) {
    console.log("\n📁 Test Files Breakdown");
    console.log("─".repeat(50));

    report.files.forEach((file) => {
      const fileStats = {
        total: file.tests?.length || 0,
        passed: file.tests?.filter((t) => t.outcome === "expected").length || 0,
        failed:
          file.tests?.filter((t) => t.outcome === "unexpected").length || 0,
        skipped: file.tests?.filter((t) => t.outcome === "skipped").length || 0,
      };

      const status =
        fileStats.failed > 0 ? "❌" : fileStats.passed > 0 ? "✅" : "⏭️";
      const fileName = file.file.replace(process.cwd(), "").replace(/\\/g, "/");

      console.log(`${status} ${fileName}`);
      console.log(
        `   Total: ${fileStats.total} | Passed: ${fileStats.passed} | Failed: ${fileStats.failed} | Skipped: ${fileStats.skipped}`
      );
    });
  }

  // Failed tests details
  const failedTests = [];
  if (report.files) {
    report.files.forEach((file) => {
      if (file.tests) {
        file.tests.forEach((test) => {
          if (test.outcome === "unexpected") {
            failedTests.push({
              file: file.file.replace(process.cwd(), "").replace(/\\/g, "/"),
              title: test.title,
              duration: test.duration,
              errors:
                test.results?.map((r) => r.error?.message).filter(Boolean) ||
                [],
            });
          }
        });
      }
    });
  }

  if (failedTests.length > 0) {
    console.log("\n❌ Failed Tests");
    console.log("─".repeat(50));
    failedTests.forEach((test, index) => {
      console.log(`\n${index + 1}. ${test.title}`);
      console.log(`   File: ${test.file}`);
      console.log(`   Duration: ${(test.duration / 1000).toFixed(2)}s`);
      if (test.errors.length > 0) {
        console.log(`   Error: ${test.errors[0]}`);
      }
    });
  }

  // Coverage by test category
  const categories = {
    flow: 0,
    failure: 0,
    api: 0,
    matching: 0,
    profile: 0,
    notification: 0,
    accessibility: 0,
    download: 0,
    performance: 0,
    smoke: 0,
  };

  if (report.files) {
    report.files.forEach((file) => {
      const fileName = file.file.toLowerCase();
      if (
        fileName.includes("flow") &&
        !fileName.includes("api") &&
        !fileName.includes("failure")
      ) {
        categories.flow += file.tests?.length || 0;
      } else if (
        fileName.includes("failure") ||
        fileName.includes("api-failures")
      ) {
        categories.failure += file.tests?.length || 0;
      } else if (fileName.includes("matching")) {
        categories.matching += file.tests?.length || 0;
      } else if (fileName.includes("profile")) {
        categories.profile += file.tests?.length || 0;
      } else if (fileName.includes("notification")) {
        categories.notification += file.tests?.length || 0;
      } else if (fileName.includes("accessibility")) {
        categories.accessibility += file.tests?.length || 0;
      } else if (fileName.includes("download")) {
        categories.download += file.tests?.length || 0;
      } else if (fileName.includes("performance")) {
        categories.performance += file.tests?.length || 0;
      } else if (fileName.includes("smoke")) {
        categories.smoke += file.tests?.length || 0;
      }
    });
  }

  console.log("\n📊 Coverage by Category");
  console.log("─".repeat(50));
  Object.entries(categories)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`${category.padEnd(15)} ${count} tests`);
    });

  // Recommendations
  console.log("\n💡 Recommendations");
  console.log("─".repeat(50));

  if (stats.failed > 0) {
    console.log("⚠️  Some tests failed. Review failed tests above.");
  }

  if (stats.flaky > 0) {
    console.log(
      "🔄 Some tests are flaky. Consider adding retries or fixing timing issues."
    );
  }

  if (passRate < 80) {
    console.log(
      "📉 Pass rate is below 80%. Review test failures and fix issues."
    );
  } else if (passRate === 100) {
    console.log("🎉 All tests passed! Great job!");
  }

  if (stats.skipped > 0) {
    console.log(
      `⏭️  ${stats.skipped} tests were skipped. Consider running them when UI is ready.`
    );
  }

  // Exit with appropriate code
  process.exit(stats.failed > 0 ? 1 : 0);
}

generateReport();
