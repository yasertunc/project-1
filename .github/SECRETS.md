# Required GitHub Secrets

This repository requires the following secrets to be configured in GitHub Settings → Secrets and variables → Actions:

## Required Secrets

### Expo & EAS

- `EXPO_TOKEN` - Expo access token for EAS builds

### Android Build

- `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` - Base64 encoded Google Play service account JSON
- `ANDROID_KEYSTORE_BASE64` - Base64 encoded Android keystore file (optional)
- `KEY_ALIAS` - Android keystore key alias (optional)
- `KEY_PASSWORD` - Android keystore key password (optional)
- `KEYSTORE_PASSWORD` - Android keystore password (optional)

### iOS Build

- `ASC_API_KEY_ID` - App Store Connect API Key ID
- `ASC_ISSUER_ID` - App Store Connect Issuer ID
- `ASC_API_KEY_P8` - App Store Connect API Key (P8 format)

### Other

- `EAS_PROJECT_ID` - EAS project ID (optional)

## Setting up Secrets

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the appropriate value

## Notes

- Secrets marked as (optional) are not required for basic builds but may be needed for production releases
- All secrets are encrypted and only visible to GitHub Actions runners
- Never commit secrets directly to the repository
