import { device } from "detox";

beforeAll(async () => {
  await device.launchApp({
    delete: true,
    permissions: { notifications: "YES" },
  });
});

afterAll(async () => {
  await device.terminateApp();
});
