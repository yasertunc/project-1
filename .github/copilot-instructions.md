Repository-specific Copilot / AI agent instructions

Quick goal
- Produce Android APKs for the mobile app and help human devs build/debug mobile locally or via EAS.

Project structure & big picture
- Monorepo: top-level contains `apps/` and `backend/`.
- Mobile app lives in `apps/mobile` — an Expo (React Native) app using `expo-router`, `expo-updates`, and native modules.
- Mobile native Android project is under `apps/mobile/android` after prebuild (this repo uses Expo + managed/bare hybrid flows).

Key files to inspect
- `apps/mobile/package.json` — scripts and dependencies (useful scripts: `android`, `build:dev-client:android`).
- `eas.json` — build profiles. Profiles available: `development`, `preview`, `production`, `production-apk`.
  - EAS builds are configured to set `EAS_PROJECT_ROOT` to `apps/mobile` for CI or root-level runs.
- `apps/mobile/scripts/build-dev-client.mjs` — builds a local dev-client APK and copies it to `apps/mobile/artifacts/android`.
- `.eas/android-service-account.json` (referenced in `eas.json` under `submit`) — used for Play Store submit; secure this file.

How this repo builds Android APKs (recommended flows)

1) Quick local dev-client APK (developer machine with Android SDK/JDK)
- This repo provides a script that builds a release dev-client APK and places artifacts in `apps/mobile/artifacts/android`.
- Steps (PowerShell):
```
cd .\apps\mobile; npm ci; npm run build:dev-client:android
```
- What the script does: runs `npx expo run:android --variant release --no-install`, then attempts to copy
  `android/app/build/outputs/apk/release/app-release.apk` to `apps/mobile/artifacts/android/FellowusMobile-dev-client.apk`.
- Requirements: installed Android SDK, proper `ANDROID_HOME`/`JAVA_HOME`, and `npx`/Node environment.

2) EAS cloud build (recommended for reproducible artifact and signing)
- EAS profiles are defined in repository `eas.json`. Common choices:
  - `preview` — internal APK (gradleCommand `:app:assembleRelease`).
  - `production-apk` — release APK with auto incrementing version.
- Typical steps (PowerShell):
```
cd .\apps\mobile
npm ci
npm i -g eas-cli   # install once per machine / CI image
eas login          # ensure you're authorized with Expo account
eas build -p android --profile preview
```
- After the build completes, download the APK from the EAS build page or CLI output.
- If you need to submit to Play Store, `eas submit` is configured in `eas.json` and expects a service account JSON at `.eas/android-service-account.json`.

3) Local Gradle assemble (bare/native path)
- If you prefer to build with Gradle directly (requires Android native files present):
```
cd .\apps\mobile
npx expo prebuild --no-install   # only if native android folder is missing and you want to generate it
cd android
./gradlew assembleRelease        # on Windows use gradlew.bat assembleRelease
```
- Resulting APK path: `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`.

Project-specific conventions & gotchas
- EAS_PROJECT_ROOT: `eas.json` sets `EAS_PROJECT_ROOT` to `apps/mobile`. CI tools may run at repo root; ensure EAS is called with correct working directory or set `EAS_PROJECT_ROOT` env.
- Dev-client script uses `--no-install` variant; it expects native build tooling already available on the runner.
- Artifacts: `apps/mobile/artifacts/android` is the repo location used by the dev-client script — check this path for locally produced APKs.
- Expo CLI vs EAS: repository prefers EAS for reproducible cloud builds (see `eas.json`), but `expo run:android` and `npx expo` are used in local scripts.
- Signing: production releases use Play Store signing via `.eas/android-service-account.json` and the EAS submit workflow.

Testing & automation hooks
- Detox: `apps/mobile/package.json` contains `detox:build:android` and `detox:test:android` scripts. Detox builds use configuration `detox.config.ts`.
- CI: look for workflows in `.github/workflows/` (not present by default) — CI should use `eas build` for release artifacts.

When to ask the human
- If you need Play Store access or service account JSON — request secure file and do not commit it into repo.
- If you lack Android SDK/JDK on the runner — ask for a hosted EAS build instead.

Useful file references (examples to open quickly)
- `apps/mobile/package.json` — npm scripts and deps
- `eas.json` — build profiles and submit settings
- `apps/mobile/scripts/build-dev-client.mjs` — dev-client APK creation
- `apps/mobile/artifacts/android` — where local script copies APK

If anything is unclear or you'd like me to add CI job example for EAS builds, tell me which profile you want automated (`preview` or `production-apk`) and I will add a GitHub Actions workflow snippet.
