# TestFlight Internal Testing Plan (16.5)

## Prerequisites

- Apple Developer Program membership.
- App Store Connect app entry (`com.fellowus.app`) with bundle identifiers set.
- ASC API Key (already listed in `docs/secrets-management.md`).

## Steps

1. **Create TestFlight Groups**
   - Internal Testers (max 25, requires App Store Connect access).
   - Optionally, External Testers (requires Apple review).

2. **Upload Build**
   - Run `eas build --platform ios --profile production`.
   - Submit via `eas submit --platform ios --asc-app-id <ID> --apple-id <email>`.
   - Wait for Apple processing (~10–30 min).

3. **Distribute**
   - Assign build to “Internal Testers” group.
   - Send invitation email.

4. **Feedback**
   - Use TestFlight’s built-in feedback or shared Slack channel.
   - Track crash reports in App Store Connect + Sentry.

5. **Compliance**
   - Ensure export compliance and privacy policy URLs are filled.
   - Provide contact info and testing instructions.

## Exit Criteria

- All P0 bugs resolved.
- At least one successful build cycle validated by internal testers.

## Next Steps

- Once stable, move to External TestFlight group or production submission per rollout plan.
