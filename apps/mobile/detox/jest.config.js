/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/detox/tests/**/*.test.(ts|tsx|js)"],
  setupFilesAfterEnv: ["./setup.ts"],
  testTimeout: 120000,
  reporters: ["detox/runners/jest/streamlineReporter"],
};
