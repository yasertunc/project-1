# Fellowus Mobile – Detox/Expo E2E Scaffolding

## Overview

Detox is prepared for the Expo-managed app so we can automate smoke flows on Android emulators (and later iOS simulators). Because the managed workflow still needs a development client or prebuild output, running these tests requires a locally built APK (Dev Client) and an emulator via Android Studio.

## Prerequisites

- Node 18+ and npm 10+
- Android Studio with an emulator (Pixel 6 / API 34 recommended)
- Expo CLI (`npx expo --version`)
- JDK 17 (for Gradle builds)
- Physical device optional for on-device debugging

## Installing dependencies

All Detox dependencies are already added:

```bash
cd apps/mobile
npm install
```

> Note: `@config-plugins/detox` could not be installed because the current release only supports Expo 53. Once Expo 54 compatibility ships we can add the plugin for automatic config editing; for now, follow the manual steps below.

## Building a Dev Client APK

1. Ensure `android/` directory exists (run `npx expo prebuild --platform android` if not already generated; be mindful of git changes).
2. Generate a release dev client:

```bash
npx expo run:android --variant release --no-install
```

This produces an APK under `android/app/build/outputs/apk/release/`. Copy it to `apps/mobile/artifacts/android/FellowusMobile-release.apk` so Detox can pick it up.

## Running the tests

```bash
cd apps/mobile
npx detox build --config detox.config.ts --configuration android.emu.release   # optional: rebuild
npx detox test --config detox.config.ts --configuration android.emu.release
```

The default configuration launches the `Pixel_6_API_34` emulator. Update `detox.config.ts` if you use a different AVD.

## Test locations

- Config: `apps/mobile/detox.config.ts`
- Jest runner config: `apps/mobile/detox/jest.config.js`
- Setup hooks: `apps/mobile/detox/setup.ts`
- Specs: `apps/mobile/detox/tests/*.spec.ts`

Example spec (`onboarding.spec.ts`) opens the app, verifies the Chats list, and navigates to the profile screen.

## iOS support (future work)

- Add a dev client build via `npx expo run:ios --configuration Release`.
- Extend `detox.config.ts` with an `ios.sim.release` app + device entry (e.g., `iPhone 15 Pro` simulator).
- Ensure Apple Silicon / Intel prerequisites per Detox docs.

## CI considerations

- Use EAS Build or GitHub Actions runner with Android SDK installed.
- Store the built APK as an artifact so `detox test` can download it.
- Emulator boot time can be significant; budget 10–15 min per job.

## Blockers

- Expo 54 compatibility for `@config-plugins/detox`. Until then, manual edits to `android/app/src/main/AndroidManifest.xml` (adding `android:testOnly="true"` etc.) may be required each time `prebuild` runs.
- Secure storage of signing keys and APK artifacts still TBD (ties into roadmap items 9.11 and 13.7).
