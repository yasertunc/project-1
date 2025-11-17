# Performance Budgets & Alerts (14.3)

## Web (Storybook / future SPA)

- **Lighthouse CI**: already runs via `npm run lh:ci`. Extend config to enforce:
  - Performance score ≥ 90
  - LCP ≤ 2.5s
  - TBT ≤ 150ms
  - CLS ≤ 0.1
- **Automated alerts**:
  - Fail CI when LH thresholds unmet.
  - Send Slack/Teams notification via Lighthouse CI report (future enhancement).

## Mobile (Expo)

- Focus on bundle size and startup time.
- Use `expo bundle:analyze` or `npx react-native-bundle-visualizer`.
- Set target: JS bundle < 1.5 MB (minified) and first render < 2s on mid-tier device.

## Monitoring / Alerts

- Integrate Sentry Performance metrics (traces) to watch LCP and app start spans.
- Add budget summary to release checklist (docs/QA_CHECKLIST.md).
