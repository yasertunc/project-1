# Fellowus Mobile – Device Matrix & Coverage Plan

## Goals

Provide a prioritized list of Android and iOS devices that represent the user base and technical edge cases (different SoCs, screen sizes, Android API levels). This matrix feeds roadmap items 11.4 (Detox/Expo E2E), 11.5 (device coverage), 9.10 (debug device testing), and 16.x rollout milestones.

## Android Targets

| Priority | Device                        | API / OS             | Notes                                                                     |
| -------- | ----------------------------- | -------------------- | ------------------------------------------------------------------------- |
| P0       | Pixel 6 (Emulator)            | Android 14 (API 34)  | Default Detox config (`Pixel_6_API_34`). Baseline smoke on each PR merge. |
| P0       | Samsung Galaxy S21 (physical) | Android 13 (API 33)  | Popular Samsung skin, verifies push notifications + animations.           |
| P1       | Xiaomi Redmi Note 11          | Android 12 (API 31)  | Mid-tier hardware, MIUI quirks (background restrictions).                 |
| P1       | Pixel 5 (Emulator)            | Android 12L (API 32) | Smaller screen + old SoC to catch perf regressions.                       |
| P2       | Oppo A77 / Realme variants    | Android 11 (API 30)  | Ensures compatibility down to minSdk once defined (target 30+).           |

### Cadence

- P0: every release branch + nightly Detox run.
- P1: weekly manual verification (Expo Dev Client builds).
- P2: before beta / Play internal testing (16.4).

## iOS Targets (future)

| Priority | Device                    | iOS Version | Notes                                        |
| -------- | ------------------------- | ----------- | -------------------------------------------- |
| P0       | iPhone 15 Pro (simulator) | iOS 18      | Detox iOS config once Expo 54 plugin ready.  |
| P1       | iPhone 13 mini (physical) | iOS 17      | Smaller screen, notch layout.                |
| P2       | iPhone SE (2022)          | iOS 17      | Home button layout, performance constraints. |

## Test Flows

Each device run should cover:

1. Launch → Chats list → Profile toggles.
2. Language switch + download CTA (web view fallback).
3. Push notification permission + background resume (Android physical only).

## Blockers

- iOS Detox config pending Expo 54 `@config-plugins/detox` compatibility.
- Physical device inventory / remote farm still TBD; ties into roadmap items 11.5, 16.5, and 18.x (accounts).

## Next Steps

- Provision Samsung Galaxy S21 and Xiaomi Redmi Note 11 test devices (can be QA-owned).
- Document adb/emulator startup scripts in CI once hardware access settled.
- Expand matrix with accessibility-specific devices (e.g., TalkBack-enabled tablet) during 16.1 accessibility audit.
