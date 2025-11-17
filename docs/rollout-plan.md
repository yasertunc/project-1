# Rollout Plan (16.3)

## Phases

1. **Dark Launch / Internal Only**
   - Deploy web Storybook + download page behind feature flag (no public links).
   - Mobile: distribute Dev Client via Expo QR to internal testers.
   - Collect telemetry (Sentry) silently.

2. **Closed Beta**
   - Android: Play Console “Internal Testing” (track `internal`), 20–50 testers.
   - iOS: TestFlight Internal group.
   - Weekly release cadence; gather feedback via shared form/Slack channel.

3. **Open Beta / Public TestFlight (Optional)**
   - Expand to `Open testing` on Play + Public TestFlight after key metrics stable.
   - Marketing landing updates go live.

4. **Production Launch**
   - Tag `v1.0`, run EAS production builds, submit to stores.
   - Monitor metrics and Sentry alerts closely for 48 hours.

## Gates

- ✅ All 9.x–14.x items closed.
- ✅ QA sweep (docs/qa-sweep.md) signed off.
- ✅ A11y audit issues resolved.
- ✅ Secrets/CI configured (12.4/12.5).

## Communication

- Send pre-launch brief to stakeholders (email/Slack).
- Maintain changelog for each beta drop.
- Publish post-launch summary with adoption metrics.

## Rollback

- Keep previous artifacts (see docs/artifact-management.md).
- Use `eas submit --resign` with prior build if production rollout must be reverted.
