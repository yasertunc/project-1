# Google Play Console & Apple App Store Connect Status Checklist

## Google Play Console Status ✅

### Configuration Verified:

- ✅ **Package Name**: `com.fellowus.app` (confirmed in `app.config.ts` and `eas.json`)
- ✅ **Service Account**: Configured in GitHub Secrets (`GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`)
- ✅ **Keystore**: Uploaded to EAS, passwords in GitHub Secrets
- ✅ **Submit Automation**: Workflow configured in `.github/workflows/eas-build.yml`
- ✅ **Privacy Policy**: `https://fellowus.app/privacy` (configured in `app.config.ts`)
- ✅ **Terms of Service**: `https://fellowus.app/terms` (configured in `app.config.ts`)

### Build Status:

- ✅ **Production AAB**: Build profile configured (`production`)
- ✅ **Production APK**: Build profile configured (`production-apk`)
- ✅ **Auto Submit**: Configured for internal track
- ✅ **Artifact Management**: SHA256 checksums and GitHub Releases configured

### Required Actions:

- ⚠️ **App Listing**: Complete store listing (description, screenshots, graphics)
- ⚠️ **Content Rating**: Complete content rating questionnaire
- ⚠️ **App Signing**: Verify app signing by Google Play (if enabled)
- ⚠️ **Internal Testing**: Verify testers can access builds

## Apple App Store Connect Status ✅

### Configuration Verified:

- ✅ **Bundle ID**: `com.fellowus.app` (confirmed in `app.config.ts`)
- ✅ **API Keys**: Configured in GitHub Secrets (`ASC_API_KEY_ID`, `ASC_ISSUER_ID`, `ASC_API_KEY_P8`)
- ✅ **Submit Automation**: Workflow configured in `.github/workflows/eas-build.yml`
- ✅ **Privacy Policy**: `https://fellowus.app/privacy` (configured in `app.config.ts`)
- ✅ **Terms of Service**: `https://fellowus.app/terms` (configured in `app.config.ts`)

### Build Status:

- ✅ **Production iOS**: Build profile configured (`production-ios`)
- ✅ **Deployment Target**: iOS 13.0 (configured in `eas.json`)
- ✅ **Auto Submit**: Configured for TestFlight
- ✅ **TestFlight Group**: "Team (Expo)" created (from previous builds)

### Required Actions:

- ⚠️ **App Store Listing**: Complete App Store Connect listing (description, screenshots, keywords)
- ⚠️ **App Privacy**: Complete App Privacy questionnaire
- ⚠️ **Export Compliance**: Verify export compliance information
- ⚠️ **TestFlight Testing**: Verify internal testers can access builds

## Verification Commands

### Google Play Console:

```bash
# Check latest build
eas build:list --platform android --limit 1

# Check submission status
eas submit:list --platform android

# Verify service account
# Check GitHub Secrets: GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
```

### Apple App Store Connect:

```bash
# Check latest build
eas build:list --platform ios --limit 1

# Check submission status
eas submit:list --platform ios

# Verify API keys
# Check GitHub Secrets: ASC_API_KEY_ID, ASC_ISSUER_ID, ASC_API_KEY_P8
```

## Next Steps

1. **Complete Store Listings**: Add app descriptions, screenshots, and graphics
2. **Content Rating**: Complete Google Play content rating and App Store age rating
3. **Test Builds**: Verify builds are accessible to internal testers
4. **Monitor Metrics**: Set up monitoring for crash reports and user feedback
5. **Prepare for Release**: Complete all required metadata before public release
