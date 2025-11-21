# E2E Testing Strategy (11.x)

This document outlines the end-to-end testing strategy for the Fellowus project, covering web, mobile, and integration tests.

## Overview

E2E tests validate complete user journeys from start to finish, ensuring the application works correctly in real-world scenarios.

## Testing Pyramid

```
        /\
       /  \  E2E Tests (Few, Critical Paths)
      /____\
     /      \  Integration Tests (More, Feature-Level)
    /________\
   /          \  Unit Tests (Many, Component-Level)
  /____________\
```

## Test Categories

### 11.1 Flow-based E2E

**Purpose**: Validate complete user journeys

**Tools**: Playwright (web), Detox (mobile)

**Coverage**:

- ✅ Hero → CTA scroll and language persistence (English ⇄ Turkish)
- ⚠️ Matching flow (enqueue → match → chat)
- ⚠️ Profile setup and preferences
- ⚠️ Notification flow (permission → token → registration)
- ⚠️ Download flow (platform detection → redirect)

**Status**: Partial - Basic flows covered, matching flow pending backend

### 11.2 Failure Scenarios

**Purpose**: Ensure graceful error handling

**Tools**: Playwright with network interception

**Coverage**:

- ✅ Error boundaries display correctly
- ✅ Network failures handled gracefully
- ⚠️ 4xx/5xx API errors
- ⚠️ Timeout scenarios
- ⚠️ Offline mode handling

**Status**: Partial - Error boundaries tested, API failures pending backend

### 11.3 Smoke Matrix

**Purpose**: Quick validation of critical paths

**Tools**: Playwright

**Coverage**:

- ✅ Hash navigation
- ✅ Download CTA
- ✅ 404 flows
- ✅ Language switching
- ⚠️ Mobile-specific flows

**Status**: Complete for web, pending for mobile

### 11.4 Mobile E2E (Detox/Expo)

**Purpose**: Validate mobile app flows on real devices

**Tools**: Detox, Expo Dev Client

**Coverage**:

- ⚠️ Onboarding flow
- ⚠️ Tab navigation
- ⚠️ Push notification permission
- ⚠️ Error boundary recovery
- ⚠️ Deep linking

**Status**: Scaffolded, blocked by Expo 54 Detox plugin compatibility

**Blockers**:

- Expo 54 lacks compatible `@config-plugins/detox`
- Requires manual prebuild + manifest edits
- Dev client APK needed for testing

### 11.5 Device Matrix

**Purpose**: Ensure compatibility across devices

**Coverage Plan**:

- **P0 (Critical)**: Samsung Galaxy S21, Google Pixel 6, iPhone 13
- **P1 (Important)**: Xiaomi Redmi Note, OnePlus 9, iPhone 12
- **P2 (Nice to have)**: Budget devices, tablets, older models

**Status**: Plan documented, pending physical device inventory

## Test Implementation

### Web E2E (Playwright)

**Location**: `e2e/`

**Files**:

- `flows.spec.ts` - User journey flows
- `failures.spec.ts` - Error scenarios
- `smoke.spec.ts` - Smoke tests

**Running Tests**:

```bash
# Run all E2E tests
npm run test:smoke

# Run specific test file
npx playwright test e2e/flows.spec.ts

# Run in UI mode
npx playwright test --ui
```

### Mobile E2E (Detox)

**Location**: `apps/mobile/detox/`

**Files**:

- `detox.config.ts` - Detox configuration
- `jest.config.js` - Jest configuration
- `tests/onboarding.spec.ts` - Sample test

**Running Tests**:

```bash
# Build for testing
npm run detox:build:android

# Run tests
npm run detox:test:android
```

## Test Data Management

### Mock Data

- Use MSW (Mock Service Worker) for API mocking
- Mock data in `src/mocks/`
- Storybook stories use same mocks

### Test Users

- Create test accounts for E2E scenarios
- Use separate test environment
- Clean up test data after runs

## CI/CD Integration

### GitHub Actions

**Workflow**: `.github/workflows/ci.yml`

**Test Execution**:

- Runs on every PR
- Runs on push to main
- Fails build if tests fail

**Parallel Execution**:

- Web E2E tests run in parallel
- Mobile E2E tests run separately (requires device/emulator)

## Coverage Goals

### Current Coverage

- **Web E2E**: ~40% of critical paths
- **Mobile E2E**: ~10% (scaffolded only)
- **Failure Scenarios**: ~30%

### Target Coverage

- **Web E2E**: 80% of critical paths
- **Mobile E2E**: 70% of critical paths
- **Failure Scenarios**: 90% of error cases

## Test Maintenance

### Best Practices

1. **Keep tests independent**: Each test should run standalone
2. **Use data attributes**: Prefer `data-testid` over CSS selectors
3. **Page Object Model**: Organize selectors in page objects
4. **Clear test data**: Clean up after each test
5. **Stable selectors**: Avoid brittle selectors (class names, etc.)

### Flaky Test Handling

- Identify and fix flaky tests immediately
- Use retries for network-dependent tests
- Add waits for async operations
- Use deterministic test data

## Future Improvements

### Short Term (v1.1)

- [ ] Complete matching flow E2E tests
- [ ] Add API failure scenario tests
- [ ] Expand mobile E2E coverage
- [ ] Add visual regression tests for critical flows

### Medium Term (v1.2)

- [ ] Set up device farm for mobile testing
- [ ] Add performance testing (Lighthouse CI)
- [ ] Implement cross-browser testing
- [ ] Add accessibility E2E tests

### Long Term (v2.0)

- [ ] Automated device matrix testing
- [ ] Load testing for backend
- [ ] Security testing automation
- [ ] Chaos engineering tests

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Testing Best Practices](https://testingjavascript.com/)
- [E2E Testing Guide](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
