# EAS Submit Automation Plan (13.8)

## Overview

Automate distribution to:

- **Google Play Console** – Internal testing track.
- **App Store Connect** – TestFlight.

## Prerequisites

| Platform | Requirements                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------- |
| Android  | `ANDROID_KEYSTORE_BASE64`, `KEY_ALIAS`, `KEY_PASSWORD`, Play Console service account JSON (Base64). |
| iOS      | ASC API Key (`ASC_API_KEY_ID`, `ASC_API_KEY_ISSUER`, `.p8`), App Store Connect App ID registered.   |

Store credentials in Expo/EAS secrets (`eas secret:create`) and GitHub Actions Secrets.

## CLI Workflow

```bash
# Android
eas submit --platform android \
  --path artifacts/FellowusMobile-release.aab \
  --track internal \
  --service-account-path ./play-console-service-account.json

# iOS
eas submit --platform ios \
  --path artifacts/FellowusMobile-release.ipa \
  --apple-id <APPLE_ID_EMAIL> \
  --asc-app-id <APP_ID> \
  --asc-api-key-path ./asc-key.p8
```

Exports (`.aab`, `.ipa`) are produced by `eas build`.

## Automation via GitHub Actions

1. Trigger on tags (`v*`) or manual dispatch.
2. Jobs:
   - `build-android`: `eas build --platform android --profile production`.
   - `submit-android`: depends on build, downloads artifact, runs `eas submit --platform android`.
   - `build-ios` / `submit-ios` similarly.
3. Use the `expo/expo-github-action` to authenticate with `EXPO_TOKEN`.

## Rollback Strategy

- Keep previous submission IDs. If new build fails review, resubmit prior artifact via `eas submit --id <submissionId> --resign`.

## Next Steps

- Prepare GitHub Action workflow file (`.github/workflows/eas-submit.yml`) referencing this plan.
- Ensure Play Console internal testers + TestFlight groups exist (roadmap 16.4 / 16.5).
