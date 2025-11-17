# Fellowus Mobile – Notifications Setup

This guide explains how to finish configuring push notifications for the Expo (managed) mobile app once the Firebase resources are ready.

## 1. Dependencies

Already installed in `apps/mobile/package.json`:

- `expo-notifications`
- `expo-device`

No extra action needed unless you run `npm install` from a clean clone.

## 2. Firebase (FCM) project

1. Create (or reuse) a Firebase project that matches `com.fellowus.app`.
2. Add an **Android** app with the same package name.
3. Download the generated `google-services.json`.
4. Place the file at `apps/mobile/google-services.json` (git-ignored).  
   The Expo config already references this path via `android.googleServicesFile`.

## 3. Service credentials

| Secret                           | Where to store                                                            | Notes                                                                |
| -------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `google-services.json`           | Local dev machines + secure secret storage (e.g., Expo/Secrets, CI vault) | Required for Android builds.                                         |
| FCM Server Key (`Server key`)    | Backend / notification service or Expo server                             | Needed if you bypass the Expo Push Service and talk to FCM directly. |
| Expo Access Token (`EXPO_TOKEN`) | Expo project secrets                                                      | Enables CI to talk to Expo services.                                 |

For the managed workflow we can rely on the **Expo Push Service**. It still needs the Firebase project to deliver Android notifications.

## 4. Expo configuration recap

`apps/mobile/app.config.ts` now contains:

- `android.googleServicesFile`: points to `./google-services.json`.
- `android.permissions`: includes `NOTIFICATIONS`.
- `expo-notifications` plugin with default color/icon.

If you want a monochrome notification icon, add a new asset (e.g. `./assets/notification-icon.png`) and update the plugin config.

## 5. Environment variables

All Expo config values can be supplied via `apps/mobile/.env` (see `apps/mobile/env.example`). The most relevant keys for notifications are:

| Variable                                 | Description                                                                                                               | Required |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| `EXPO_PUBLIC_NOTIFICATIONS_REGISTER_URL` | Backend endpoint that stores Expo push tokens. When omitted, the app skips registration but still logs the token locally. | Optional |
| `EXPO_PUBLIC_DOWNLOAD_URL`               | Shared download link injected into Expo config (parity with web).                                                         | Optional |
| `EXPO_NOTIFICATIONS_ICON`                | Path to a monochrome notification icon (Android).                                                                         | Optional |
| `EXPO_NOTIFICATIONS_COLOR`               | Hex color for the notification icon background.                                                                           | Optional |
| `EAS_PROJECT_ID`                         | Expo EAS project ID; already defaulted in config but override if the project is forked.                                   | Optional |

Inject the variables via `.env`, CI secret store, or `eas secret`. When running locally, copy `apps/mobile/env.example` to `.env` and tweak the values as needed.

## 6. Automatic token registration

The `registerPushToken` service (`apps/mobile/src/services/registerPushToken.ts`) POSTs to `EXPO_PUBLIC_NOTIFICATIONS_REGISTER_URL` with:

```json
{
  "token": "<ExpoPushToken>",
  "platform": "android|ios",
  "appVersion": "1.0.0",
  "deviceName": "Pixel 8",
  "channel": "expo",
  "registeredAt": "2025-11-15T10:00:00.000Z"
}
```

Whenever the app bootstraps (`app/_layout.tsx`), the `useNotifications` hook requests permissions, obtains the Expo push token, and triggers the registration call. If the endpoint is missing, the registration step is skipped with a console info log so devs know why nothing was sent.

## 7. Runtime behaviour

- `useNotifications` hook (bootstrapped in `app/_layout.tsx`) registers the device, requests permission, and logs the Expo push token.
- Android notification channel `"default"` is created with Fellowus colors.
- When debugging in Expo Go, remember that real push delivery still requires running on a physical device.

## 8. Testing checklist

1. Launch the app on a physical Android device via Expo Go (or Dev Client).
2. Accept the notification permission prompt.
3. Verify the console log for `Expo push token:` (Metro or native logs).
4. From your workstation, send a test push via [Expo Push Tool](https://expo.dev/notifications) using the token.
5. Confirm the notification arrives while the app is foreground/background.
6. Repeat on iOS once APNs credentials are connected (future task).

## 9. Next steps

- Add the Firebase project ID, API keys, and service account secrets to the secure CI/EAS environment.
- Implement backend or serverless endpoint that stores Expo tokens per user and triggers pushes.
- Extend QA checklist with push notification smoke cases (foreground, background, killed app).
