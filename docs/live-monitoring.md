# Live Monitoring & Hotfix Plan (17.2)

## Monitoring Stack

- **Sentry** (web + mobile): error alerts, performance spans.
- **Expo/React Native**: use `expo-updates` logs + Sentry release tags per build.
- **Google Play / App Store**: monitor crash reports & ANR dashboards daily.
- **Analytics**: GA4 (web) + future mobile analytics for funnel metrics.

## Alerting

- Sentry alert rules:
  - P0: crash rate > 5% or >10 errors/min → page on-call.
  - P1: new issue with >50 events in 1h → Slack alert.
- Play Console / App Store email notifications forwarded to release channel.

## Hotfix Workflow

1. Identify issue via monitoring.
2. Triage severity (P0→ immediate fix; P1→ next patch).
3. Prepare hotfix branch → run `health:all`.
4. Build via EAS (android/ios) with hotfix tag.
5. Submit to stores with expedited review if required.

## Postmortem

- Create GitHub issue / retro doc summarizing impact, fix, and prevention steps.
- Update `docs/PROJECT_STATUS.md` or release notes if user-facing impact.
