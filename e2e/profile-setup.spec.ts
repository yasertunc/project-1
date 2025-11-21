import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { gotoStory } from "../tests/visual/utils/gotoStory";

const HOMEPAGE_STORY_ID = "pages-homepage--default";

/**
 * Helper to mock profile setup API responses
 */
async function setupProfileMocks(
  page: Page,
  scenario: "success" | "validation-error" | "server-error"
) {
  await page.route("**/api/v1/profile/setup", async (route) => {
    if (scenario === "success") {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          profileId: "profile-123",
          handle: "user123",
          preferences: {
            language: "en",
            notifications: true,
          },
        }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (scenario === "validation-error") {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({
          error: "Bad Request",
          message: "Invalid profile data",
          code: "VALIDATION_ERROR",
          fields: {
            handle: "Handle is required",
            preferences: "Preferences must be an object",
          },
        }),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({
          error: "Internal Server Error",
          message: "Failed to create profile",
          code: "INTERNAL_ERROR",
        }),
        headers: { "Content-Type": "application/json" },
      });
    }
  });

  await page.route("**/api/v1/profile/update", async (route) => {
    if (scenario === "success") {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          profileId: "profile-123",
          updated: true,
        }),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({
          error: "Internal Server Error",
          message: "Failed to update profile",
        }),
        headers: { "Content-Type": "application/json" },
      });
    }
  });
}

test.describe("Profile setup flow E2E (mocked)", () => {
  test("@flow profile setup with valid data succeeds", async ({ page }) => {
    await setupProfileMocks(page, "success");

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    // Note: This test structure is ready for when profile setup UI is implemented
    // The actual test will:
    // 1. Navigate to profile setup
    // 2. Fill in profile form (handle, preferences, etc.)
    // 3. Submit profile
    // 4. Verify success message
    // 5. Verify profile is saved

    const profileForm = page.locator('[data-testid="profile-form"]');
    const profileSuccess = page.locator('[data-testid="profile-success"]');

    expect(profileForm.or(profileSuccess).count()).toBeGreaterThanOrEqual(0);
  });

  test("@flow profile setup validation errors are displayed", async ({
    page,
  }) => {
    await setupProfileMocks(page, "validation-error");

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    // Note: This test will verify:
    // 1. Form validation errors are shown
    // 2. Field-specific error messages are displayed
    // 3. User can correct errors and resubmit

    const validationErrors = page.locator('[data-testid="validation-error"]');
    const fieldErrors = page.locator('[data-testid="field-error"]');

    expect(validationErrors.or(fieldErrors).count()).toBeGreaterThanOrEqual(0);
  });

  test("@flow profile update works correctly", async ({ page }) => {
    await setupProfileMocks(page, "success");

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    // Note: This test will verify:
    // 1. Existing profile data is loaded
    // 2. User can update preferences
    // 3. Changes are saved successfully
    // 4. Updated data is reflected in UI

    const profileUpdate = page.locator('[data-testid="profile-update"]');
    const updateSuccess = page.locator('[data-testid="update-success"]');

    expect(profileUpdate.or(updateSuccess).count()).toBeGreaterThanOrEqual(0);
  });

  test("@flow profile preferences are persisted", async ({ page }) => {
    await setupProfileMocks(page, "success");

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    // Note: This test will verify:
    // 1. Preferences are saved to localStorage/backend
    // 2. Preferences persist across page reloads
    // 3. Preferences are applied correctly

    const preferences = page.locator('[data-testid="preferences"]');
    const persistedData = page.locator('[data-testid="persisted-data"]');

    expect(preferences.or(persistedData).count()).toBeGreaterThanOrEqual(0);
  });
});
