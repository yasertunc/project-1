# Google Play Internal Testing Plan (16.4)

## Prerequisites

- Google Play Console account with app `com.fellowus.app`.
- Service account JSON (for EAS submit) with `Release Manager` role.
- Internal tester email list (CSV or manual entry).

## Steps

1. **Create Internal Testing Track**
   - Play Console → Testing → Internal testing.
   - Provide app details, release notes.

2. **Upload Artifact**
   - Use `eas submit --platform android --track internal`.
   - Alternatively, upload AAB manually (from `docs/artifact-management.md` workflow).

3. **Add Testers**
   - Create email list (Google Group recommended).
   - Invite testers; ensure they opt in via generated Play link.

4. **Rollout**
   - Start with 100% of internal testers.
   - If issues arise, halt rollout and push patched build.

5. **Feedback Loop**
   - Central Slack/Teams channel for testers.
   - Use Play Console feedback reports + in-app forms.

## Metrics

- Crash-free sessions (via Play Console / Sentry).
- Install/activation count.
- Notification delivery success.

## Next Steps

- After internal testing sign-off, proceed to Closed Testing or Production as per rollout plan (`docs/rollout-plan.md`).
