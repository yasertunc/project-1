# v1.0 Release Preparation (17.1)

## Checklist

1. **Artifacts**
   - Android AAB (production profile) + checksum.
   - iOS IPA (production profile) + checksum.
   - Stored per `docs/artifact-management.md`.

2. **Store Metadata**
   - Google Play: title, short/long description, screenshots (phone/tablet), privacy policy URL.
   - App Store: keywords, promotional text, App Privacy, screenshots, marketing icon.

3. **Testing Reports**
   - QA sweep (16.2) sign-off.
   - Accessibility audit (16.1) sign-off.
   - Internal testing (16.4/16.5) results.

4. **Communication**
   - Release notes draft (web page + store listing).
   - Email/Slack announcement plan.

5. **Monitoring Setup**
   - Sentry alerts configured for production.
   - Play/App Store crash monitors enabled.

6. **Go/No-Go Meeting**
   - Stakeholders review KPIs and sign-off before submission.

## Post-Release

1. Monitor metrics for 48h (KPIs + error rates).
2. Prepare hotfix plan if critical issues appear.
3. Update roadmap (17.2+, 17.3) based on learnings.
