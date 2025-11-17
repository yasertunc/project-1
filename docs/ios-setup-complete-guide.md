# iOS Setup Complete Guide (iOS.1-9)

This comprehensive guide covers all iOS setup steps for the Fellowus mobile app, from initial configuration to App Store submission.

## Prerequisites

- Apple Developer Program membership (active)
- Apple ID with admin access
- Mac computer (for local testing, optional)
- Xcode (for local builds, optional - EAS Build handles cloud builds)

## iOS.1 Bundle ID & Apple Developer App ID

### Step 1: Verify Bundle ID in App Config

The bundle ID is already configured in `app.config.ts`:

```typescript
ios: {
  bundleIdentifier: "com.fellowus.app",
}
```

### Step 2: Create App ID in Apple Developer Portal

1. **Go to Apple Developer Portal**:
   - Visit [Apple Developer](https://developer.apple.com/account/)
   - Sign in with your Apple ID

2. **Navigate to Certificates, Identifiers & Profiles**:
   - Click "Certificates, Identifiers & Profiles"
   - Select "Identifiers" from the left sidebar

3. **Create New App ID**:
   - Click the "+" button
   - Select "App IDs" → Continue
   - Select "App" → Continue
   - **Description**: "Fellowus Mobile"
   - **Bundle ID**: Select "Explicit" → Enter `com.fellowus.app`
   - **Capabilities**: Enable the following:
     - ✅ Push Notifications
     - ✅ Associated Domains (for future Universal Links)
     - ✅ Background Modes (for notifications)
   - Click "Continue" → "Register"

### Step 3: Verify in App Store Connect

1. **Go to App Store Connect**:
   - Visit [App Store Connect](https://appstoreconnect.apple.com/)
   - Sign in with your Apple ID

2. **Create App** (if not already created):
   - Click "My Apps" → "+" → "New App"
   - **Platform**: iOS
   - **Name**: "Fellowus"
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select `com.fellowus.app`
   - **SKU**: `fellowus-ios-001` (unique identifier)
   - **User Access**: Full Access
   - Click "Create"

## iOS.2 EAS iOS Profiles

✅ **Already Configured**: `preview-ios` and `production-ios` profiles exist in `eas.json`

**Preview Profile** (for simulator builds):
```json
"preview-ios": {
  "ios": {
    "simulator": true
  }
}
```

**Production Profile** (for device builds):
```json
"production-ios": {
  "ios": {
    "buildConfiguration": "Release",
    "autoIncrement": true
  }
}
```

## iOS.3 Signing: Apple Developer Team ID & App Store Connect API Key

✅ **Already Configured**: App Store Connect API keys are in GitHub Secrets

### Verify API Key Setup

1. **Check GitHub Secrets**:
   - `ASC_API_KEY_ID` - Key ID from App Store Connect
   - `ASC_ISSUER_ID` - Issuer ID from App Store Connect
   - `ASC_API_KEY_P8` - Private key (.p8 file content)

2. **Verify in App Store Connect**:
   - Go to App Store Connect → Users and Access → Keys
   - Verify API key exists and is active
   - Note the Key ID and Issuer ID

### Get Team ID

1. **Find Team ID**:
   - Go to [Apple Developer](https://developer.apple.com/account/)
   - Click "Membership" in the left sidebar
   - Note the "Team ID" (format: `XXXXXXXXXX`)

2. **Add to EAS** (if needed):
   ```bash
   npx eas credentials -p ios
   # Select "production-ios" profile
   # Enter Team ID when prompted
   ```

## iOS.4 Icons & Splash: iOS Asset Catalog

### Step 1: Prepare Icon Assets

Create icon files in the following sizes:
- **1024x1024** (App Store icon, required)
- **180x180** (iPhone 6 Plus and later)
- **120x120** (iPhone 6 and earlier)
- **152x152** (iPad Pro)
- **76x76** (iPad)

### Step 2: Prepare Splash Screen

Create splash screen assets:
- **1242x2688** (iPhone XS Max, 11 Pro Max)
- **828x1792** (iPhone XR, 11)
- **1242x2208** (iPhone 6 Plus, 7 Plus, 8 Plus)
- **750x1334** (iPhone 6, 7, 8)
- **2048x2732** (iPad Pro 12.9")
- **1668x2224** (iPad Pro 10.5")

### Step 3: Configure in app.config.ts

Icons and splash are already configured:

```typescript
ios: {
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
}
```

### Step 4: Validate with EAS

```bash
npx eas build:configure -p ios
# EAS will validate icon and splash assets
```

### Step 5: Test Safe Area

After first build, test on physical device to ensure:
- Icons display correctly on all device sizes
- Splash screen respects safe area (notch, home indicator)
- No content is cut off

## iOS.5 Push Notifications: APNs Setup

### Step 1: Enable Push Notifications Capability

✅ **Already configured in app.config.ts**:
```typescript
ios: {
  infoPlist: {
    // Push notification permission description
  },
}
```

### Step 2: Create APNs Key

1. **Go to Apple Developer Portal**:
   - Certificates, Identifiers & Profiles → Keys
   - Click "+" to create new key

2. **Configure Key**:
   - **Key Name**: "Fellowus Push Notifications"
   - ✅ Enable "Apple Push Notifications service (APNs)"
   - Click "Continue" → "Register"

3. **Download Key**:
   - Download the `.p8` file (only available once!)
   - Note the Key ID

4. **Upload to EAS**:
   ```bash
   npx eas credentials -p ios
   # Select "production-ios" profile
   # Select "Push Notifications"
   # Upload .p8 file or paste content
   ```

### Step 3: Configure Expo Push Notifications

Expo handles APNs automatically when:
- Push Notifications capability is enabled
- APNs key is uploaded to EAS
- `expo-notifications` is installed (✅ already installed)

### Step 4: Test Push Notifications

1. **Build with EAS**:
   ```bash
   npx eas build -p ios --profile production-ios
   ```

2. **Install on Device**:
   - Download .ipa from EAS
   - Install via TestFlight or direct install

3. **Test Notification**:
   - Grant notification permission
   - Send test notification from Expo dashboard or backend

## iOS.6 Capabilities: Associated Domains & Background Modes

### Associated Domains (for Universal Links)

1. **Enable in App ID**:
   - Apple Developer Portal → Identifiers → `com.fellowus.app`
   - Enable "Associated Domains"
   - Click "Save"

2. **Configure in app.config.ts**:
   ```typescript
   ios: {
     associatedDomains: [
       "applinks:www.fellowus.com",
       "applinks:fellowus.com",
     ],
   },
   ```

3. **Create apple-app-site-association File**:
   - Create `public/.well-known/apple-app-site-association`
   - Content:
     ```json
     {
       "applinks": {
         "apps": [],
         "details": [
           {
             "appID": "TEAM_ID.com.fellowus.app",
             "paths": ["*"]
           }
         ]
       }
     }
     ```
   - Replace `TEAM_ID` with your Apple Developer Team ID

### Background Modes (for Notifications)

1. **Enable in App ID**:
   - Apple Developer Portal → Identifiers → `com.fellowus.app`
   - Enable "Background Modes"
   - Enable "Remote notifications"
   - Click "Save"

2. **Configure in app.config.ts**:
   ```typescript
   ios: {
     infoPlist: {
       UIBackgroundModes: ["remote-notification"],
     },
   },
   ```

## iOS.7 Device Testing: Expo Dev Client

### Step 1: Build Dev Client

```bash
cd apps/mobile
npx eas build -p ios --profile development
```

### Step 2: Install on Device

1. **Download .ipa** from EAS build page
2. **Install via TestFlight** (recommended):
   - Upload to App Store Connect
   - Add device to TestFlight internal testing
   - Install via TestFlight app

3. **Or Install Directly** (requires Apple Developer account):
   - Use Xcode → Window → Devices and Simulators
   - Drag .ipa to device

### Step 3: Run Development Build

```bash
npx expo start --dev-client
# Scan QR code with device camera
# Or enter URL manually in Expo Go (if compatible)
```

### Step 4: Test Critical Flows

- [ ] App launches successfully
- [ ] Tab navigation works
- [ ] Push notification permission prompt appears
- [ ] Notifications are received
- [ ] Error boundaries catch and display errors
- [ ] Deep links work (if configured)
- [ ] Safe area respected (notch, home indicator)

## iOS.8 Artifact: EAS Build → .ipa + TestFlight

### Step 1: Build Production .ipa

```bash
npx eas build -p ios --profile production-ios
```

### Step 2: Wait for Build to Complete

- Monitor build status in EAS dashboard
- Build typically takes 15-30 minutes
- You'll receive email notification when complete

### Step 3: Submit to TestFlight

**Option A: Automatic via EAS Submit** (Recommended):

```bash
npx eas submit -p ios --latest --non-interactive
```

**Option B: Manual via App Store Connect**:

1. **Download .ipa** from EAS build page
2. **Go to App Store Connect**:
   - My Apps → Fellowus → TestFlight
   - Click "+" to add build
   - Upload .ipa file
   - Wait for processing (10-30 minutes)

### Step 4: Configure TestFlight

1. **Add Internal Testers**:
   - TestFlight → Internal Testing
   - Add email addresses of testers
   - They'll receive invitation email

2. **Add External Testers** (for open beta):
   - TestFlight → External Testing
   - Create group (e.g., "Beta Testers")
   - Add build to group
   - Submit for Beta App Review (required for external testing)

### Step 5: Test on TestFlight

- Install TestFlight app on device
- Accept invitation email
- Install Fellowus app from TestFlight
- Test all critical flows

## iOS.9 App Store Connect: Internal Testing, Privacy Links, App Privacy

### Internal Testing Groups

1. **Create Internal Testing Group**:
   - App Store Connect → TestFlight → Internal Testing
   - Click "+" to create group
   - Name: "Internal Testers"
   - Add team members' email addresses

2. **Add Build to Group**:
   - Select build from list
   - Click "Add to Internal Testing"
   - Select group
   - Testers receive invitation

### Privacy Links

1. **Add Privacy Policy URL**:
   - App Store Connect → App Information
   - Privacy Policy URL: `https://www.fellowus.com/privacy`
   - ✅ Already configured in `app.config.ts`

2. **Add Terms of Service URL** (if required):
   - Terms of Service URL: `https://www.fellowus.com/terms`
   - ✅ Already configured in `app.config.ts`

### App Privacy

1. **Complete App Privacy Questionnaire**:
   - App Store Connect → App Privacy
   - Answer questions about data collection:
     - ✅ We collect push notification tokens (Device ID)
     - ✅ We collect analytics data (Product Interaction)
     - ❌ We do NOT collect location, contacts, photos, etc.

2. **Privacy Practices**:
   - Data Linked to User: Yes (for matching functionality)
   - Data Used to Track: No (unless using advertising)
   - Data Collected: Minimal (only what's necessary)

### App Store Listing (for Production)

1. **App Information**:
   - Name: "Fellowus"
   - Subtitle: "Anonymous Event Matching"
   - Category: Social Networking
   - Age Rating: Complete questionnaire

2. **Pricing and Availability**:
   - Price: Free
   - Availability: All countries (or select specific)

3. **App Preview and Screenshots**:
   - Upload screenshots for all required device sizes
   - Create app preview video (optional but recommended)

4. **Description**:
   - Write compelling app description
   - Include keywords for App Store search
   - Highlight privacy-first approach

5. **Keywords**:
   - Enter relevant keywords (100 characters max)
   - Example: "events, matching, anonymous, social, meetup"

6. **Support URL**:
   - Support URL: `https://www.fellowus.com/support` (or contact email)

7. **Marketing URL** (optional):
   - Marketing URL: `https://www.fellowus.com`

## Verification Checklist

### iOS.1 Bundle ID
- [ ] App ID created in Apple Developer Portal
- [ ] Bundle ID matches `com.fellowus.app`
- [ ] App created in App Store Connect

### iOS.2 EAS Profiles
- [ ] `preview-ios` profile configured
- [ ] `production-ios` profile configured

### iOS.3 Signing
- [ ] App Store Connect API key created
- [ ] API key added to GitHub Secrets
- [ ] Team ID noted

### iOS.4 Icons/Splash
- [ ] Icon assets prepared (all sizes)
- [ ] Splash screen assets prepared
- [ ] Assets validated with EAS
- [ ] Safe area tested on physical device

### iOS.5 Push Notifications
- [ ] Push Notifications capability enabled
- [ ] APNs key created and uploaded to EAS
- [ ] Test notification sent successfully

### iOS.6 Capabilities
- [ ] Associated Domains enabled (if using Universal Links)
- [ ] Background Modes enabled
- [ ] `apple-app-site-association` file created (if using Universal Links)

### iOS.7 Device Testing
- [ ] Dev client built and installed
- [ ] Critical flows tested on physical device
- [ ] Safe area validated

### iOS.8 Artifact
- [ ] Production .ipa built successfully
- [ ] Build submitted to TestFlight
- [ ] Internal testers added
- [ ] TestFlight installation successful

### iOS.9 App Store Connect
- [ ] Internal testing group created
- [ ] Privacy Policy URL added
- [ ] App Privacy questionnaire completed
- [ ] App Store listing prepared (for production)

## Troubleshooting

### Build Fails

**Error**: "No provisioning profile found"
- **Solution**: Ensure App Store Connect API key is configured correctly

**Error**: "Invalid bundle identifier"
- **Solution**: Verify bundle ID matches App ID in Apple Developer Portal

### Push Notifications Not Working

**Check**:
- APNs key is uploaded to EAS
- Push Notifications capability is enabled
- App has notification permission
- APNs key is not expired

### TestFlight Upload Fails

**Error**: "Invalid .ipa"
- **Solution**: Ensure build is for device (not simulator), and signing is correct

**Error**: "Missing compliance"
- **Solution**: Complete App Privacy questionnaire in App Store Connect

## Next Steps

After completing all iOS setup steps:

1. Begin internal testing with TestFlight
2. Gather feedback from testers
3. Fix any critical issues
4. Prepare for App Store submission
5. Submit for App Review (when ready for production)

## Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Expo iOS Build Guide](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)

