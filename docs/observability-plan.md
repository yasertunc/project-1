# Observability Plan (14.1)

## Web (Storybook / Future Web App)

- **Sentry (browser SDK)** for error tracking.
  - Configure DSN via environment variables (`VITE_SENTRY_DSN`).
  - Automatically capture performance spans (LCP, CLS) with Sentry Performance.
- **Google Analytics 4 (optional)** for aggregate usage metrics (CTA clicks, language selection).
- **Logging**: use `sanitizeLogMessage` when sending console logs to external systems.

## Mobile (Expo/React Native)

- **Sentry React Native** SDK via `sentry-expo`.
  - `EXPO_PUBLIC_SENTRY_DSN` + `EXPO_PUBLIC_SENTRY_TRACES_RATE` control runtime sampling.
  - `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` (optional `SENTRY_ENV`/`SENTRY_URL`) enable the Expo plugin to upload source maps during `eas build`.
- **Expo Updates / Logs**: use `expo-updates` runtime logs + `expo-doctor` for health checks.

## Backend / APIs (future)

- Target stack: OpenTelemetry (OTLP) + managed backend (e.g., Datadog, New Relic, or self-hosted Grafana Loki + Tempo).
- Ensure any future API gateway redacts PII by default (reuse `pii.ts` logic).

## Action Items

- Provision Sentry org/project for web + mobile.
- Add feature toggles in config (enable/disable telemetry depending on environment).
- Document dashboards + alert thresholds before launch.
