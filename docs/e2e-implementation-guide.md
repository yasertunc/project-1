# E2E Testing Implementation Guide

This document provides a comprehensive implementation guide for E2E testing, covering flow-based tests (11.1) and failure scenarios (11.2).

## Overview

E2E tests validate complete user journeys and error handling scenarios. All tests use Playwright with route mocking to be independent of backend implementation, making them ready to run as soon as UI components are implemented.

## Test Structure

### Test Files

```
e2e/
├── flows.spec.ts              # Core user journey flows
├── failures.spec.ts           # UI failure scenarios
├── api-failures.spec.ts       # API failure scenarios
├── matching-flow.spec.ts      # Matching flow tests
├── profile-setup.spec.ts      # Profile setup tests
├── notification-flow.spec.ts  # Notification flow tests
└── smoke.spec.ts              # Smoke tests
```

### Configuration

- **Playwright Config**: `playwright.e2e.config.ts`
- **Base URL**: `http://localhost:5080` (Storybook)
- **Test Timeout**: 60 seconds
- **Expect Timeout**: 15 seconds

## Flow-Based E2E Tests (11.1)

### Purpose

Validate complete user journeys from start to finish, ensuring all interactions work correctly.

### Test Coverage

#### 1. Hero → CTA Scroll Flow

**File**: `e2e/flows.spec.ts`

**Test**: `should scroll to "How It Works" section when clicking CTA`

**Steps**:

1. Navigate to homepage
2. Click "How It Works" CTA button
3. Verify page scrolls to correct section
4. Verify section is visible

**Implementation**:

```typescript
test("should scroll to 'How It Works' section when clicking CTA", async ({
  page,
}) => {
  await page.goto("/");
  await page.click('text="How It Works"');
  await page.waitForSelector("#how-it-works", { state: "visible" });
  const section = await page.locator("#how-it-works");
  await expect(section).toBeVisible();
});
```

#### 2. Language Switching Flow

**Test**: `should persist language selection`

**Steps**:

1. Navigate to homepage
2. Switch language to Turkish
3. Verify UI updates to Turkish
4. Reload page
5. Verify language persists

**Implementation**:

```typescript
test("should persist language selection", async ({ page }) => {
  await page.goto("/");
  await page.click('button[aria-label="Switch to Turkish"]');
  await expect(page.locator("text=Nasıl Çalışır")).toBeVisible();

  await page.reload();
  await expect(page.locator("text=Nasıl Çalışır")).toBeVisible();
});
```

#### 3. Matching Flow

**File**: `e2e/matching-flow.spec.ts`

**Tests**:

- `should successfully enqueue and match`
- `should handle match cancellation`
- `should handle match timeout`
- `should display queue position`

**Implementation Pattern**:

```typescript
test("should successfully enqueue and match", async ({ page }) => {
  // Mock API responses
  await page.route("**/v1/match/enqueue", async (route) => {
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({
        matchId: "mock-match-123",
        queuePosition: 1,
        estimatedWaitTime: 10,
      }),
    });
  });

  await page.goto("/");
  // ... test UI interactions
});
```

#### 4. Profile Setup Flow

**File**: `e2e/profile-setup.spec.ts`

**Tests**:

- `should allow successful profile setup`
- `should display validation errors for invalid input`
- `should allow profile updates`
- `should persist profile data`

#### 5. Notification Flow

**File**: `e2e/notification-flow.spec.ts`

**Tests**:

- `should request and register notification token`
- `should handle notification permission denied`
- `should allow unregistering notifications`
- `should save notification preferences`

### Running Flow Tests

```bash
# Run all flow tests
npm run test:e2e

# Run specific test file
npx playwright test -c playwright.e2e.config.ts e2e/flows.spec.ts

# Run with UI mode (interactive)
npx playwright test -c playwright.e2e.config.ts --ui

# Run in debug mode
npx playwright test -c playwright.e2e.config.ts --debug
```

## Failure Scenarios (11.2)

### Purpose

Validate error handling, network failures, and API error responses to ensure graceful degradation.

### Test Coverage

#### 1. UI Failure Scenarios

**File**: `e2e/failures.spec.ts`

**Tests**:

- `should display error fallback when section fails to load`
- `should allow retry after error`
- `should handle multiple section failures`

**Implementation**:

```typescript
test("should display error fallback when section fails to load", async ({
  page,
}) => {
  await page.goto("/");

  // Force error in lazy-loaded section
  await page.evaluate(() => {
    window.__FELLOWUS_FORCE_SECTION_ERROR = true;
  });

  // Trigger section load
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Verify error fallback appears
  await expect(page.locator("text=Something went wrong")).toBeVisible();
});
```

#### 2. API Failure Scenarios

**File**: `e2e/api-failures.spec.ts`

**Tests**:

- `should handle 400 Bad Request`
- `should handle 401 Unauthorized`
- `should handle 404 Not Found`
- `should handle 429 Too Many Requests`
- `should handle 500 Internal Server Error`
- `should handle 503 Service Unavailable`
- `should handle network timeout`
- `should handle offline mode`
- `should handle invalid JSON response`
- `should handle CORS errors`

**Implementation Pattern**:

```typescript
test("should handle 400 Bad Request", async ({ page }) => {
  await page.route("**/v1/match/enqueue", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Invalid request",
        errors: { field: "Field is required" },
      }),
    });
  });

  await page.goto("/");
  // ... trigger action that calls API
  // ... verify error message displayed
  // ... verify UI handles error gracefully
});
```

### Running Failure Tests

```bash
# Run all failure tests
npm run test:e2e:failures

# Run specific test file
npx playwright test -c playwright.e2e.config.ts e2e/api-failures.spec.ts

# Run with retries
npx playwright test -c playwright.e2e.config.ts --retries=2
```

## CI/CD Integration

### GitHub Actions Workflow

Tests are integrated into CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Run E2E tests
  run: npm run test:e2e --if-present
  env:
    STORYBOOK_BASE_URL: http://localhost:5080
```

### Pre-commit Hooks

E2E tests are not run on pre-commit (too slow), but can be run manually:

```bash
# Before committing
npm run test:e2e
```

## Best Practices

### 1. Route Mocking

Always use route mocking for API calls:

```typescript
// ✅ Good: Mock API response
await page.route("**/v1/match/enqueue", async (route) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: true }),
  });
});

// ❌ Bad: Rely on real API
// This makes tests flaky and dependent on backend
```

### 2. Test Isolation

Each test should be independent:

```typescript
// ✅ Good: Reset state before each test
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

// ❌ Bad: Tests depend on each other
```

### 3. Wait for Elements

Always wait for elements to be ready:

```typescript
// ✅ Good: Wait for element
await page.waitForSelector("#how-it-works");
await expect(page.locator("#how-it-works")).toBeVisible();

// ❌ Bad: Assume element is ready
await page.locator("#how-it-works").click(); // May fail
```

### 4. Use Data Attributes

Prefer data attributes for test selectors:

```typescript
// ✅ Good: Stable selector
await page.click('[data-testid="how-it-works-cta"]');

// ❌ Bad: Fragile selector
await page.click("button:nth-child(3)"); // Breaks if order changes
```

### 5. Error Assertions

Verify error messages are user-friendly:

```typescript
// ✅ Good: Check error message
await expect(page.locator("text=Something went wrong")).toBeVisible();
await expect(page.locator("text=Please try again")).toBeVisible();

// ❌ Bad: Check technical error
await expect(page.locator("text=Error 500")).toBeVisible();
```

## Debugging

### Playwright Inspector

Run tests with inspector:

```bash
npx playwright test -c playwright.e2e.config.ts --debug
```

### Screenshots and Videos

Screenshots are taken on failure automatically. Videos can be enabled:

```typescript
// playwright.e2e.config.ts
use: {
  video: "retain-on-failure",
  screenshot: "only-on-failure",
  trace: "retain-on-failure",
}
```

### Console Logs

View console logs:

```typescript
page.on("console", (msg) => console.log("Browser console:", msg.text()));
page.on("pageerror", (error) => console.log("Page error:", error));
```

## Test Data Management

### Mock Data

Create reusable mock data:

```typescript
// e2e/fixtures/mockData.ts
export const mockMatchResponse = {
  matchId: "mock-match-123",
  queuePosition: 1,
  estimatedWaitTime: 10,
};

export const mockProfile = {
  name: "Test User",
  age: 25,
  interests: ["travel", "food"],
};
```

### Test Fixtures

Use Playwright fixtures for setup:

```typescript
// e2e/fixtures/testFixtures.ts
import { test as base } from "@playwright/test";

export const test = base.extend({
  pageWithMocks: async ({ page }, use) => {
    // Setup route mocks
    await page.route("**/v1/**", async (route) => {
      // Default mock response
    });
    await use(page);
  },
});
```

## Coverage Goals

### Current Coverage

- ✅ Hero → CTA scroll flow
- ✅ Language switching flow
- ✅ Matching flow (mocked)
- ✅ Profile setup flow (mocked)
- ✅ Notification flow (mocked)
- ✅ UI failure scenarios
- ✅ API failure scenarios (comprehensive)

### Future Coverage

- [ ] Complete matching flow (with real UI)
- [ ] Complete profile setup (with real UI)
- [ ] Complete notification flow (with real UI)
- [ ] Payment flow (if applicable)
- [ ] Settings flow
- [ ] Onboarding flow

## Maintenance

### Regular Updates

- Update tests when UI changes
- Add new tests for new features
- Remove obsolete tests
- Update mock data as API evolves

### Test Review

- Review test failures regularly
- Identify flaky tests
- Optimize slow tests
- Ensure tests reflect user journeys

## Resources

- [E2E Testing Strategy](docs/e2e-testing-strategy.md)
- [Playwright Documentation](https://playwright.dev/)
- [Test Files](../e2e/)
- [CI/CD Workflows](../.github/workflows/)
