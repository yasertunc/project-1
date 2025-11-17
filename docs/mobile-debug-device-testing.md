# Mobile Debug Device Testing Guide

This guide covers how to test the Fellowus mobile app on physical devices using Expo Dev Client.

## Prerequisites

- Expo CLI installed: `npm install -g expo-cli`
- EAS CLI installed: `npm install -g eas-cli`
- Physical Android or iOS device
- USB cable for Android, or same WiFi network for iOS
- Developer mode enabled on device

## Android Setup

### 1. Enable Developer Options

1. Go to **Settings** → **About phone**
2. Tap **Build number** 7 times
3. Go back to **Settings** → **Developer options**
4. Enable **USB debugging**
5. Enable **Install via USB** (if available)

### 2. Build Development Client

```bash
cd apps/mobile
eas build --profile development --platform android
```

This creates a development build with debugging capabilities. Download the APK from the EAS build page and install it on your device.

### 3. Connect Device

**Option A: USB Connection**
```bash
# Connect device via USB
adb devices  # Verify device is connected

# Start Expo dev server
npm run start

# Press 'a' to open on Android device
```

**Option B: WiFi Connection**
```bash
# Start Expo dev server
npm run start

# Scan QR code with Expo Go app (if using Expo Go)
# Or use the development client and enter the URL manually
```

### 4. Run on Device

```bash
# From apps/mobile directory
npm run android
```

Or use Expo CLI:
```bash
npx expo run:android
```

## iOS Setup

### 1. Apple Developer Account

- Apple Developer Program membership required
- Device must be registered in Apple Developer Portal

### 2. Build Development Client

```bash
cd apps/mobile
eas build --profile development --platform ios
```

Download the IPA and install via TestFlight or Xcode.

### 3. Connect Device

**Option A: USB Connection**
1. Connect iPhone/iPad via USB
2. Trust the computer on the device
3. Open Xcode → Window → Devices and Simulators
4. Verify device is connected

**Option B: WiFi Connection**
1. Ensure device and computer are on same WiFi network
2. In Xcode → Devices, enable "Connect via network"

### 4. Run on Device

```bash
# From apps/mobile directory
npm run ios
```

Or use Expo CLI:
```bash
npx expo run:ios --device
```

## Testing Checklist

### Basic Functionality

- [ ] App launches without crashes
- [ ] Navigation between tabs works
- [ ] Push notifications permission prompt appears
- [ ] Push token registration succeeds
- [ ] Error boundaries catch and display errors gracefully
- [ ] Theme switching (light/dark) works
- [ ] Safe area insets are respected

### Navigation Flows

- [ ] Home tab displays correctly
- [ ] Discover tab loads and displays content
- [ ] Messages tab shows conversation list
- [ ] Opening a message opens detail screen
- [ ] Profile tab displays user settings
- [ ] Safety tab displays safety information
- [ ] Back navigation works correctly

### Notifications

- [ ] Permission request appears on first launch
- [ ] Push token is registered with backend
- [ ] Notifications are received when app is in foreground
- [ ] Notifications are received when app is in background
- [ ] Tapping notification opens correct screen
- [ ] Notification badge updates correctly

### Error Handling

- [ ] Network errors are handled gracefully
- [ ] ErrorBoundary displays error screen
- [ ] "Try Again" button works in ErrorBoundary
- [ ] Sentry errors are reported (check Sentry dashboard)

### Performance

- [ ] App loads quickly (< 3 seconds)
- [ ] Navigation is smooth (60 FPS)
- [ ] No memory leaks (test with long session)
- [ ] Images load correctly
- [ ] No console errors or warnings

### Device-Specific

**Android:**
- [ ] Back button works correctly
- [ ] Hardware menu button (if available) works
- [ ] Notch/safe area handled correctly
- [ ] Different screen sizes tested (phone, tablet)

**iOS:**
- [ ] Home indicator respected
- [ ] Notch/safe area handled correctly
- [ ] Swipe gestures work correctly
- [ ] Different screen sizes tested (iPhone, iPad)

## Debugging Tools

### React Native Debugger

1. Install React Native Debugger: https://github.com/jhen0409/react-native-debugger
2. Start the app on device
3. Shake device → "Debug" (or Cmd+D on iOS, Cmd+M on Android)
4. Select "Debug" to open React Native Debugger

### Flipper

1. Install Flipper: https://fbflipper.com/
2. Install Flipper plugins:
   - React DevTools
   - Network Inspector
   - Layout Inspector
3. Start the app on device
4. Flipper will automatically connect

### Expo Dev Tools

When running `npm run start`, Expo Dev Tools opens in browser:
- View logs
- Reload app
- Open developer menu
- View device info

### Console Logs

```bash
# Android
adb logcat | grep -i "ReactNativeJS"

# iOS
# Use Xcode console or:
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "Expo"'
```

## Common Issues

### Android: "Unable to connect to Metro"

**Solution:**
1. Ensure device and computer are on same network
2. Check firewall settings
3. Try `adb reverse tcp:8081 tcp:8081`

### iOS: "Unable to connect to Metro"

**Solution:**
1. Ensure device and computer are on same network
2. Check that Metro bundler is running
3. Verify URL in development client settings

### Build Errors

**Solution:**
```bash
# Clear cache
npm run start -- --clear

# Rebuild
cd apps/mobile
rm -rf node_modules
npm install
```

### Push Notifications Not Working

**Solution:**
1. Verify `google-services.json` is present (Android)
2. Check notification permissions in device settings
3. Verify backend endpoint is configured
4. Check Expo push token in logs

## Testing on Multiple Devices

### Android Device Matrix

Test on:
- **P0 (Critical)**: Samsung Galaxy S21, Google Pixel 6
- **P1 (Important)**: Xiaomi Redmi Note, OnePlus 9
- **P2 (Nice to have)**: Various budget devices

### iOS Device Matrix

Test on:
- **P0 (Critical)**: iPhone 13, iPhone 14
- **P1 (Important)**: iPhone 12, iPhone SE (2022)
- **P2 (Nice to have)**: iPad, older iPhone models

## Continuous Testing

### Detox E2E Tests

```bash
# Build for testing
npm run detox:build:android

# Run tests
npm run detox:test:android
```

### Manual Testing Script

Create a checklist document and test each release:
- [ ] Smoke test (app launches, basic navigation)
- [ ] Critical user flows
- [ ] Error scenarios
- [ ] Performance benchmarks

## Reporting Issues

When reporting issues, include:
1. Device model and OS version
2. App version (from `app.config.ts`)
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots/videos if applicable
6. Logs from React Native Debugger or console

## Next Steps

- [ ] Set up automated device testing (Detox)
- [ ] Create device testing matrix document
- [ ] Set up CI/CD for device testing
- [ ] Implement performance monitoring
- [ ] Create test user accounts for backend testing

