# Artifact Management Plan (13.7)

## Goals

Ensure Android AAB/APK and iOS IPA artifacts produced by EAS Build are stored, versioned, and accessible for QA, store submission, and rollback scenarios.

## Storage Strategy

1. **Primary storage:** EAS Build retains artifacts per build job. Use `eas build:list` or the Expo dashboard to obtain download links.
2. **Secondary storage:** After each successful production build, upload artifacts to:
   - GitHub Releases (attach AAB/APK/IPA + checksums).
   - Internal object storage (e.g., Azure Blob, AWS S3) with lifecycle policies (retain at least last 5 releases).
3. **Checksums:** generate SHA256 for each artifact and store alongside the download link.

## Workflow

1. Run builds:
   ```bash
   eas build --platform android --profile production
   eas build --platform ios --profile production
   ```
2. After build completion, use Expo CLI to download:
   ```bash
   eas build:download --build-id <ID> --path artifacts/Fellowus-<version>.aab
   ```
3. Publish release notes + artifact links in GitHub Releases or a dedicated `RELEASES.md`.

## Retention Policy

- Keep all artifacts for released versions (v1.x).
- Retain at least last two RC builds.
- Use CDN links (e.g., CloudFront) for internal testing downloads if distribution at scale is needed.

## Automation Ideas

- GitHub Action job triggered on tags (`v*`) to run EAS Build, download artifacts, compute checksums, and create a release.
- Slack/Teams notification summarizing build status and download URLs.

## Manual Backup

- Store master copies (keystore, IPA export) on encrypted drives owned by release managers.
- Document location/owners in a private runbook.
