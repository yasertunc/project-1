# Sentry Error Reporting Plan (14.2)

## Web (Storybook / future SPA)

- **SDK**: `@sentry/react` + `@sentry/vite-plugin`.
- **Setup**:

  ```ts
  import * as Sentry from "@sentry/react";

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.2, // adjust per env
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
  ```

- **Source maps**: use `sentry-cli` upload in CI after `npm run build-storybook`.
- **PII**: set `sendDefaultPii: false` and sanitize breadcrumbs via `sanitizeLogMessage`.

## Mobile (Expo/React Native)

- **SDK**: `sentry-expo` (added via `npx expo install sentry-expo`).
- **Config**: `apps/mobile/app.config.ts` now conditionally enables the `sentry-expo` plugin when `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` env vars exist. Public DSN + sampling are exposed via `EXPO_PUBLIC_SENTRY_*`.
- **Runtime init**: `apps/mobile/src/lib/sentry.ts` boots Sentry when `EXPO_PUBLIC_SENTRY_DSN` is present and is imported from `app/_layout.tsx`.
- **Source maps**: When the plugin is enabled, provide `SENTRY_AUTH_TOKEN` during EAS Build so source maps upload automatically.

## Environments

| Env          | DSN                          | Sampling                               |
| ------------ | ---------------------------- | -------------------------------------- |
| Production   | Real DSN                     | `tracesSampleRate` 0.2, `replays` 0.05 |
| Preview / QA | Same DSN or separate project | Higher sampling for debugging          |
| Development  | Optional                     | Only if `enableInExpoDevelopment=true` |

## Required Secrets

- `VITE_SENTRY_DSN` (web).
- `EXPO_PUBLIC_SENTRY_DSN` (mobile).
- `SENTRY_AUTH_TOKEN` for uploading source maps.

## Next Steps

1. Create Sentry organization/projects (`fellowus-web`, `fellowus-mobile`).
2. Add DSNs to `.env.example` with placeholders.
3. Implement integration in codebase + CI (build steps).
