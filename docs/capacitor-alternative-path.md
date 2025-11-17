# Capacitor Alternative Path (C.1, C.2)

This document outlines the Capacitor alternative path for building the Fellowus mobile app, using a web shell approach instead of Expo.

## Overview

Capacitor is an alternative to Expo that wraps a web app in a native container, allowing access to native device features through plugins.

## When to Use Capacitor

Consider Capacitor if:
- You need more control over native code
- You want to use web technologies exclusively
- You need specific native plugins not available in Expo
- You prefer managing native projects directly

## Prerequisites

- Web app built and working
- Node.js and npm installed
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

## C.1 Web Build → Capacitor Android Setup

### Step 1: Build Web App

First, ensure your web app is built and ready:

```bash
# Build the web app
npm run build

# Or if using a specific build command
npm run build:web
```

### Step 2: Install Capacitor

```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Or install locally
npm install @capacitor/core @capacitor/cli --save-dev
```

### Step 3: Initialize Capacitor

```bash
# Initialize Capacitor in your project
npx cap init

# Follow prompts:
# - App name: Fellowus
# - App ID: com.fellowus.app
# - Web dir: dist (or your build output directory)
```

### Step 4: Add Android Platform

```bash
# Add Android platform
npx cap add android
```

This creates an `android/` directory with a native Android project.

### Step 5: Configure Android Project

1. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

2. **Configure build.gradle**:
   - Set `minSdkVersion` to 22 (or your target)
   - Set `targetSdkVersion` to latest
   - Configure signing configs

3. **Configure app/build.gradle**:
   - Set `applicationId` to `com.fellowus.app`
   - Set `versionCode` and `versionName`

### Step 6: Build Release AAB/APK

**For AAB (Play Store)**:
1. In Android Studio: Build → Generate Signed Bundle / APK
2. Select "Android App Bundle"
3. Choose keystore and enter passwords
4. Select release build variant
5. Build and locate the `.aab` file

**For APK (Sideload/Test)**:
1. In Android Studio: Build → Generate Signed Bundle / APK
2. Select "APK"
3. Choose keystore and enter passwords
4. Select release build variant
5. Build and locate the `.apk` file

**Or via command line**:
```bash
cd android
./gradlew bundleRelease  # For AAB
./gradlew assembleRelease  # For APK
```

### Step 7: Sync Web Assets

After building web app, sync to native projects:

```bash
# Build web app first
npm run build

# Sync to Android
npx cap sync android
```

## C.2 Native Plugin Requirements

### Required Plugins

#### Push Notifications

**Option 1: Firebase Cloud Messaging (FCM)**
```bash
npm install @capacitor-community/fcm
npx cap sync android
```

**Option 2: Capacitor Push Notifications**
```bash
npm install @capacitor/push-notifications
npx cap sync android
```

**Configuration**:
- Add `google-services.json` to `android/app/`
- Configure in `android/app/build.gradle`
- Request permissions in app code

#### File Sharing

```bash
npm install @capacitor/share
npx cap sync android
```

#### File System

```bash
npm install @capacitor/filesystem
npx cap sync android
```

#### Camera (if needed)

```bash
npm install @capacitor/camera
npx cap sync android
```

#### Device Info

```bash
npm install @capacitor/device
npx cap sync android
```

### Plugin Evaluation Checklist

- [ ] **Push Notifications**: FCM or Capacitor Push?
- [ ] **File Sharing**: Native share sheet needed?
- [ ] **File System**: Local file storage needed?
- [ ] **Camera**: Photo capture needed?
- [ ] **Geolocation**: Location services needed?
- [ ] **Network**: Network status monitoring needed?
- [ ] **Storage**: Local storage beyond localStorage?
- [ ] **Biometrics**: Fingerprint/Face ID needed?

### Plugin Implementation Example

```typescript
// Example: Push Notifications
import { PushNotifications } from '@capacitor/push-notifications';

// Request permission
const requestPermission = async () => {
  const result = await PushNotifications.requestPermissions();
  if (result.receive === 'granted') {
    await PushNotifications.register();
  }
};

// Listen for registration
PushNotifications.addListener('registration', (token) => {
  console.log('Push registration success, token: ' + token.value);
  // Send token to backend
});

// Listen for notifications
PushNotifications.addListener('pushNotificationReceived', (notification) => {
  console.log('Push notification received: ', notification);
});
```

## iOS Setup (When Ready)

### Add iOS Platform

```bash
npx cap add ios
npx cap sync ios
```

### Open in Xcode

```bash
npx cap open ios
```

### Build and Sign

1. Configure signing in Xcode
2. Select development team
3. Build for device or simulator
4. Archive for App Store distribution

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Capacitor Build

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build web app
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync android
      
      - name: Build AAB
        run: |
          cd android
          ./gradlew bundleRelease
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-release.aab
          path: android/app/build/outputs/bundle/release/app-release.aab
```

## Comparison: Capacitor vs Expo

| Feature | Capacitor | Expo |
|---------|-----------|------|
| Native Code Access | ✅ Full access | ⚠️ Limited (eject required) |
| Web Technologies | ✅ Full web stack | ✅ React Native |
| Build Process | ⚠️ Manual (Android Studio/Xcode) | ✅ Cloud (EAS Build) |
| Plugin Ecosystem | ✅ Large | ✅ Large |
| Development Speed | ⚠️ Slower (native builds) | ✅ Faster (cloud builds) |
| Learning Curve | ⚠️ Steeper | ✅ Gentler |

## Migration from Expo

If migrating from Expo to Capacitor:

1. **Build web version** of your Expo app
2. **Initialize Capacitor** in your project
3. **Replace Expo plugins** with Capacitor equivalents
4. **Update native code** as needed
5. **Test thoroughly** on both platforms

## Troubleshooting

### Build Errors

**Error**: "SDK location not found"
- **Solution**: Set `ANDROID_HOME` environment variable

**Error**: "Gradle sync failed"
- **Solution**: Update Gradle and Android Gradle Plugin versions

### Plugin Issues

**Error**: "Plugin not found"
- **Solution**: Run `npx cap sync` after installing plugins

**Error**: "Permission denied"
- **Solution**: Check `AndroidManifest.xml` for required permissions

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Android Studio Guide](https://developer.android.com/studio)
- [Capacitor Community Plugins](https://github.com/capacitor-community)

## Next Steps

After completing Capacitor setup:

1. Test on physical devices
2. Configure push notifications
3. Set up CI/CD pipeline
4. Prepare for Play Store submission
5. Consider iOS setup when ready

