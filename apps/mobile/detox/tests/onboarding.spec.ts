import { by, device, element, expect } from "detox";

describe("Fellowus Mobile onboarding", () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it("shows chat list and navigates to profile", async () => {
    await expect(element(by.text("Chats"))).toBeVisible();
    await element(by.text("Go to Profile →")).tap();
    await expect(element(by.text("Privacy Controls"))).toBeVisible();
  });
});
