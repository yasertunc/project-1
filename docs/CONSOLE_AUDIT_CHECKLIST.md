# Google Play Console & Apple App Store Connect Audit Checklist

**Date:** 2025-01-17  
**Purpose:** Comprehensive audit of console configurations and pending actions

---

## Google Play Console Audit

### Configuration Verification ✅

- [x] **Package Name**: `com.fellowus.app` verified in `app.config.ts` and `eas.json`
- [x] **Service Account**: Configured in GitHub Secrets (`GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`)
- [x] **Keystore**: Uploaded to EAS, passwords in GitHub Secrets
- [x] **Submit Automation**: Workflow configured in `.github/workflows/eas-build.yml`
- [x] **Privacy Policy URL**: `https://www.fellowus.com/privacy` (configured in `app.config.ts`)
- [x] **Terms of Service URL**: `https://www.fellowus.com/terms` (configured in `app.config.ts`)
- [x] **Production AAB Profile**: Configured (`production` in `eas.json`)
- [x] **Production APK Profile**: Configured (`production-apk` in `eas.json`)
- [x] **Auto Submit**: Configured for internal track
- [x] **Artifact Management**: SHA256 checksums and GitHub Releases configured

### Console Actions Required ⚠️

1. **App Listing**
   - [ ] Complete app description (short and full)
   - [ ] Add app screenshots (phone, tablet, TV)
   - [ ] Add feature graphic (1024x500)
   - [ ] Add app icon (512x512)
   - [ ] Set app category
   - [ ] Add content rating questionnaire

2. **Store Presence**
   - [ ] Complete store listing in all supported languages
   - [ ] Add promotional text
   - [ ] Configure app updates description
   - [ ] Set up promotional graphics

3. **Content Rating**
   - [ ] Complete content rating questionnaire
   - [ ] Submit for rating approval
   - [ ] Verify rating certificate

4. **App Signing**
   - [ ] Verify Google Play App Signing is enabled (if applicable)
   - [ ] Confirm signing certificate
   - [ ] Verify upload certificate

5. **Internal Testing**
   - [ ] Create internal testing track
   - [ ] Add test users/email list
   - [ ] Configure release notes template
   - [ ] Upload first build to internal track
   - [ ] Verify testers can access builds

6. **Privacy & Security**
   - [ ] Verify privacy policy URL is accessible
   - [ ] Verify terms of service URL is accessible
   - [ ] Complete data safety section
   - [ ] Configure app access restrictions (if needed)

### Verification Commands

```bash
# Check latest Android build
eas build:list --platform android --limit 1

# Check submission status
eas submit:list --platform android

# Verify service account (check GitHub Secrets)
# GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
```

---

## Apple App Store Connect Audit

### Configuration Verification ✅

- [x] **Bundle ID**: `com.fellowus.app` verified in `app.config.ts`
- [x] **API Keys**: Configured in GitHub Secrets (`ASC_API_KEY_ID`, `ASC_ISSUER_ID`, `ASC_API_KEY_P8`)
- [x] **Key ID**: `2DQCA36FNR` (created 2025-11-15)
- [x] **Submit Automation**: Workflow configured in `.github/workflows/eas-build.yml`
- [x] **Privacy Policy URL**: `https://www.fellowus.com/privacy` (configured in `app.config.ts`)
- [x] **Terms of Service URL**: `https://www.fellowus.com/terms` (configured in `app.config.ts`)
- [x] **Production iOS Profile**: Configured (`production-ios` in `eas.json`)
- [x] **Deployment Target**: iOS 13.0 (configured in `eas.json`)
- [x] **Auto Submit**: Configured for TestFlight
- [x] **TestFlight Group**: "Team (Expo)" created

### Previous Builds ✅

- [x] **First iOS Build**: `54bba577-a8fc-4e13-b07d-add06eee493c` (build number 1.0.4)
- [x] **TestFlight Submission**: `d08f72b1-0957-4111-a081-d4650bfa6b8e`
- [x] **Binary Status**: Processed by Apple

### Console Actions Required ⚠️

1. **Apple Developer Program**
   - [ ] Verify active Apple Developer Program membership
   - [ ] Confirm Team ID access
   - [ ] Verify App Store Connect organization access
   - [ ] Check membership expiration date

2. **App Store Listing**
   - [ ] Complete app description (short and full)
   - [ ] Add app screenshots (all required device sizes)
   - [ ] Add app preview videos (optional)
   - [ ] Add app icon (1024x1024)
   - [ ] Set app category and subcategory
   - [ ] Add keywords
   - [ ] Set support URL
   - [ ] Set marketing URL (optional)

3. **App Privacy**
   - [ ] Complete App Privacy questionnaire
   - [ ] Declare data collection practices
   - [ ] Configure privacy policy URL
   - [ ] Verify privacy policy accessibility

4. **TestFlight**
   - [ ] Verify internal testing group access
   - [ ] Add internal testers
   - [ ] Configure external testing groups (if needed)
   - [ ] Add external testers (if needed)
   - [ ] Verify builds are accessible to testers
   - [ ] Test TestFlight installation process

5. **Export Compliance**
   - [ ] Complete export compliance information
   - [ ] Verify encryption usage declaration
   - [ ] Submit compliance documentation (if required)

6. **App Review Information**
   - [ ] Add contact information
   - [ ] Add demo account credentials (if required)
   - [ ] Add review notes
   - [ ] Configure review attachments (if needed)

### Verification Commands

```bash
# Check latest iOS build
eas build:list --platform ios --limit 1

# Check submission status
eas submit:list --platform ios

# Verify API keys (check GitHub Secrets)
# ASC_API_KEY_ID, ASC_ISSUER_ID, ASC_API_KEY_P8
```

---

## Common Actions for Both Consoles

### Domain Verification

- [x] **Privacy Policy**: `https://www.fellowus.com/privacy` configured
- [x] **Terms of Service**: `https://www.fellowus.com/terms` configured
- [ ] Verify both URLs are accessible and return 200 OK
- [ ] Verify both URLs have valid SSL certificates
- [ ] Test URLs on mobile devices

### Build & Release Process

- [x] **EAS Build**: Configured for both platforms
- [x] **GitHub Actions**: Workflows configured
- [x] **Auto Submit**: Configured for both platforms
- [ ] Test build trigger from GitHub Actions
- [ ] Verify automatic submission works
- [ ] Test manual build and submission process

### Monitoring & Analytics

- [ ] Set up Google Play Console analytics
- [ ] Set up App Store Connect analytics
- [ ] Configure crash reporting (Sentry)
- [ ] Set up performance monitoring
- [ ] Configure user feedback collection

---

## Next Steps Priority

1. **High Priority** (Required for first release):
   - Complete app listings (descriptions, screenshots, icons)
   - Complete content rating / App Privacy
   - Set up internal testing groups
   - Upload first production builds

2. **Medium Priority** (Before public release):
   - Complete store presence details
   - Set up analytics and monitoring
   - Configure external testing (if needed)
   - Prepare marketing materials

3. **Low Priority** (Post-launch):
   - Optimize store listings based on analytics
   - Expand to additional markets
   - Add promotional content
   - Set up A/B testing for store listings

---

## Notes

- All technical configurations are complete ✅
- Console access and manual actions are pending ⚠️
- First iOS build already submitted to TestFlight ✅
- Android build ready for first submission ✅
- Domain URLs updated to `www.fellowus.com` ✅
