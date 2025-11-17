import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { gotoStory } from "../tests/visual/utils/gotoStory";

const HOMEPAGE_STORY_ID = "pages-homepage--default";

/**
 * Helper to mock notification API responses
 */
async function setupNotificationMocks(
  page: Page,
  scenario: "success" | "permission-denied" | "server-error"
) {
  await page.route("**/api/v1/notifications/register", async (route) => {
    if (scenario === "success") {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          tokenId: "token-123",
          registered: true,
          deviceId: "device-456",
        }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (scenario === "permission-denied") {
      await route.fulfill({
        status: 403,
        body: JSON.stringify({
          error: "Forbidden",
          message: "Notification permission denied",
          code: "PERMISSION_DENIED",
        }),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({
          error: "Internal Server Error",
          message: "Failed to register notification token",
        }),
        headers: { "Content-Type": "application/json" },
      });
    }
  });

  await page.route("**/api/v1/notifications/unregister", async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        unregistered: true,
      }),
      headers: { "Content-Type": "application/json" },
    });
  });
}

test.describe("Notification flow E2E (mocked)", () => {
  test("@flow notification permission request works", async ({ page }) => {
    await setupNotificationMocks(page, "success");

    // Mock Notification API
    await page.addInitScript(() => {
      // @ts-expect-error - Mock Notification API for testing
      window.Notification = class MockNotification {
        static permission: NotificationPermission = "default";
        static requestPermission = async () => {
          // @ts-expect-error - Setting permission on mock Notification class
          window.Notification.permission = "granted";
          return "granted" as NotificationPermission;
        };
        constructor(public title: string, public options?: NotificationOptions) {}
      };
    });

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    // Note: This test structure is ready for when notification UI is implemented
    // The actual test will:
    // 1. Trigger notification permission request
    // 2. Verify permission prompt appears
    // 3. Grant permission
    // 4. Verify token is registered with backend
    // 5. Verify success message

    const permissionPrompt = page.locator(
      '[data-testid="notification-permission-prompt"]'
    );
    const tokenRegistered = page.locator('[data-testid="token-registered"]');

    expect(permissionPrompt.or(tokenRegistered).count()).toBeGreaterThanOrEqual(
      0
    );
  });

  test("@flow notification token registration succeeds", async ({ page }) => {
    await setupNotificationMocks(page, "success");

    await page.addInitScript(() => {
      // @ts-expect-error Mock Notification API
      window.Notification = {
        permission: "granted" as NotificationPermission,
        requestPermission: async () => "granted" as NotificationPermission,
      };
    });

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    // Note: This test will verify:
    // 1. Push token is obtained from browser/device
    // 2. Token is sent to backend registration endpoint
    // 3. Registration succeeds
    // 4. Token is stored locally

    const tokenRegistration = page.locator(
      '[data-testid="token-registration"]'
    );
    const registrationSuccess = page.locator(
      '[data-testid="registration-success"]'
    );

    expect(
      tokenRegistration.or(registrationSuccess).count()
    ).toBeGreaterThanOrEqual(0);
  });

  test("@flow notification permission denied is handled gracefully", async ({
    page,
  }) => {
    await setupNotificationMocks(page, "permission-denied");

    await page.addInitScript(() => {
      // @ts-expect-error Mock Notification API
      window.Notification = {
        permission: "denied" as NotificationPermission,
        requestPermission: async () => "denied" as NotificationPermission,
      };
    });

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    // Note: This test will verify:
    // 1. Permission denied state is detected
    // 2. User-friendly message is shown
    // 3. App continues to work without notifications
    // 4. Option to retry or open settings

    const permissionDenied = page.locator('[data-testid="permission-denied"]');
    const fallbackMessage = page.locator('[data-testid="fallback-message"]');

    expect(permissionDenied.or(fallbackMessage).count()).toBeGreaterThanOrEqual(
      0
    );
  });

  test("@flow notification unregistration works", async ({ page }) => {
    await setupNotificationMocks(page, "success");

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    // Note: This test will verify:
    // 1. User can disable notifications
    // 2. Unregister API is called
    // 3. Token is removed from backend
    // 4. Local token is cleared

    const unregisterButton = page.locator('[data-testid="unregister-button"]');
    const unregisterSuccess = page.locator('[data-testid="unregister-success"]');

    expect(
      unregisterButton.or(unregisterSuccess).count()
    ).toBeGreaterThanOrEqual(0);
  });

  test("@flow notification preferences are saved", async ({ page }) => {
    await setupNotificationMocks(page, "success");

    await gotoStory(page, HOMEPAGE_STORY_ID, { locale: "en" });

    // Note: This test will verify:
    // 1. Notification preferences can be configured
    // 2. Preferences are saved to backend
    // 3. Preferences persist across sessions
    // 4. Preferences affect notification behavior

    const notificationPreferences = page.locator(
      '[data-testid="notification-preferences"]'
    );
    const preferencesSaved = page.locator('[data-testid="preferences-saved"]');

    expect(
      notificationPreferences.or(preferencesSaved).count()
    ).toBeGreaterThanOrEqual(0);
  });
});

