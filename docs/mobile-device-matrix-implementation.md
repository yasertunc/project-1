# Mobile Device Matrix Implementation Guide

This document provides a practical implementation guide for the device matrix testing strategy outlined in `docs/mobile-device-matrix.md`.

## Overview

The device matrix ensures compatibility across different Android and iOS devices, covering various screen sizes, OS versions, and hardware configurations. This guide covers setup, automation, and manual testing procedures.

## Android Device Matrix

### P0 (Critical) - Automated Testing

#### Pixel 6 Emulator (API 34)

**Setup**:

```bash
# Create AVD
avdmanager create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;x86_64" -d "pixel_6"

# Start emulator
emulator -avd Pixel_6_API_34 -no-snapshot-load
```

**Detox Configuration**:
Already configured in `apps/mobile/detox.config.ts`:

```typescript
devices: {
  "pixel-6": {
    type: "android.emulator",
    device: {
      avdName: "Pixel_6_API_34",
    },
  },
}
```

**CI/CD Integration**:

```yaml
# .github/workflows/device-matrix.yml
name: Device Matrix Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 2 * * *" # Daily at 2 AM

jobs:
  pixel6-smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - uses: android-actions/setup-android@v3
      - name: Create AVD
        run: |
          echo "y" | sdkmanager "system-images;android-34;google_apis;x86_64"
          echo "no" | avdmanager create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;x86_64"
      - name: Start Emulator
        run: |
          emulator -avd Pixel_6_API_34 -no-window -no-audio -no-snapshot-save &
          adb wait-for-device
          adb shell input keyevent 82
      - name: Build APK
        run: |
          cd apps/mobile
          npm ci
          npx expo prebuild --platform android
          npx expo run:android --variant release --no-install
      - name: Run Detox Tests
        run: |
          cd apps/mobile
          npm run detox:build:android
          npm run detox:test:android
```

**Test Coverage**:

- App launch
- Tab navigation
- Push notification permission
- Error boundary recovery
- Deep linking (if configured)

#### Samsung Galaxy S21 (Physical Device)

**Setup**:

1. Enable Developer Options:
   - Settings → About Phone → Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging
3. Connect via ADB:
   ```bash
   adb devices
   # Should show: <device-id>    device
   ```

**Manual Testing Checklist**:

- [ ] App launches successfully
- [ ] Tab navigation works smoothly
- [ ] Push notifications received
- [ ] Animations are smooth (60fps)
- [ ] No crashes during normal use
- [ ] Background/foreground transitions work
- [ ] Language switching works
- [ ] Download CTA redirects correctly

**Testing Script**:

```bash
# scripts/test-samsung-s21.sh
#!/bin/bash
DEVICE_ID=$(adb devices | grep -v "List" | awk '{print $1}' | head -1)

if [ -z "$DEVICE_ID" ]; then
  echo "No device connected"
  exit 1
fi

echo "Testing on device: $DEVICE_ID"

# Install APK
adb -s $DEVICE_ID install -r apps/mobile/artifacts/android/FellowusMobile-release.apk

# Launch app
adb -s $DEVICE_ID shell am start -n com.fellowus.app/.MainActivity

# Take screenshots
adb -s $DEVICE_ID shell screencap -p /sdcard/test-screenshot.png
adb -s $DEVICE_ID pull /sdcard/test-screenshot.png screenshots/samsung-s21/

# Check logs
adb -s $DEVICE_ID logcat -d > logs/samsung-s21.log
```

### P1 (Important) - Weekly Manual Verification

#### Xiaomi Redmi Note 11

**Special Considerations**:

- MIUI battery optimization may kill background processes
- Test push notifications with app in background
- Verify notification channels work correctly

**Testing Focus**:

- Background restrictions
- Notification delivery
- Battery optimization impact
- MIUI-specific UI quirks

#### Pixel 5 Emulator (API 32)

**Setup**:

```bash
avdmanager create avd -n Pixel_5_API_32 -k "system-images;android-32;google_apis;x86_64" -d "pixel_5"
```

**Performance Testing**:

- Monitor frame rate during animations
- Check memory usage
- Verify smooth scrolling
- Test on slower hardware simulation

### P2 (Nice to Have) - Pre-Beta Testing

#### Budget Devices (Android 11+)

**Target Devices**:

- Oppo A77
- Realme variants
- Older Samsung models

**Testing Focus**:

- Minimum SDK compatibility
- Performance on low-end hardware
- Memory constraints
- Storage limitations

## iOS Device Matrix

### P0 (Critical) - Automated Testing

#### iPhone 15 Pro Simulator (iOS 18)

**Setup** (when Detox plugin available):

```bash
# Install Xcode Command Line Tools
xcode-select --install

# List available simulators
xcrun simctl list devices available

# Boot simulator
xcrun simctl boot "iPhone 15 Pro"
```

**Detox Configuration** (future):

```typescript
devices: {
  "iphone-15-pro": {
    type: "ios.simulator",
    device: {
      name: "iPhone 15 Pro",
      os: "iOS 18.0",
    },
  },
}
```

### P1 (Important) - Manual Testing

#### iPhone 13 mini (Physical Device)

**Testing Focus**:

- Smaller screen layout
- Notch handling
- Safe area insets
- Touch target sizes

#### iPhone SE (2022) (Physical Device)

**Testing Focus**:

- Home button layout
- Performance constraints
- Smaller screen size
- Legacy iOS features

## Test Flows

### Standard Test Suite

Each device should run through these flows:

#### Flow 1: Basic Navigation

1. Launch app
2. Navigate to Chats tab
3. Navigate to Discover tab
4. Navigate to Safety tab
5. Navigate to Profile tab
6. Verify all tabs load correctly

#### Flow 2: Language & Download

1. Switch language (English ⇄ Turkish)
2. Verify UI updates
3. Tap download CTA
4. Verify redirect to Play Store/App Store

#### Flow 3: Push Notifications (Android Physical Only)

1. Request notification permission
2. Verify permission dialog
3. Grant permission
4. Send test notification
5. Verify notification received
6. Tap notification
7. Verify app opens to correct screen

#### Flow 4: Error Handling

1. Trigger error boundary (if test mode available)
2. Verify error UI displays
3. Tap "Try Again"
4. Verify app recovers

#### Flow 5: Background/Foreground

1. Launch app
2. Put app in background
3. Wait 30 seconds
4. Return to app
5. Verify app resumes correctly
6. Verify no crashes

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/device-matrix.yml`:

```yaml
name: Device Matrix Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 2 * * *" # Daily at 2 AM

jobs:
  android-p0:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        device: [pixel-6]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - uses: android-actions/setup-android@v3
      - name: Setup Emulator
        run: |
          echo "y" | sdkmanager "system-images;android-34;google_apis;x86_64"
          echo "no" | avdmanager create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;x86_64"
      - name: Start Emulator
        run: |
          emulator -avd Pixel_6_API_34 -no-window -no-audio -no-snapshot-save &
          adb wait-for-device
          timeout 60 bash -c 'until adb shell getprop sys.boot_completed | grep -q 1; do sleep 1; done'
      - name: Build and Test
        run: |
          cd apps/mobile
          npm ci
          npx expo prebuild --platform android
          npx expo run:android --variant release --no-install
          npm run detox:build:android
          npm run detox:test:android
      - name: Upload Artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: detox-artifacts-${{ matrix.device }}
          path: apps/mobile/detox/artifacts/
```

### Manual Testing Schedule

**Weekly (P1 devices)**:

- Monday: Xiaomi Redmi Note 11
- Wednesday: Pixel 5 Emulator
- Friday: iPhone 13 mini (if available)

**Pre-Release (P2 devices)**:

- Run full test suite on all P2 devices
- Document any issues
- Create tickets for blockers

## Device Provisioning

### Physical Device Inventory

**Required**:

- Samsung Galaxy S21 (P0)
- iPhone 13 mini (P1, if iOS testing needed)

**Optional**:

- Xiaomi Redmi Note 11 (P1)
- iPhone SE 2022 (P2)
- Budget Android device (P2)

### Remote Device Farm (Future)

Consider using:

- Firebase Test Lab
- AWS Device Farm
- BrowserStack App Automate
- Sauce Labs

## Reporting

### Test Results Format

```markdown
## Device Matrix Test Results - [Date]

### P0 Devices

- [ ] Pixel 6 Emulator (API 34) - ✅ Pass / ❌ Fail
  - Flow 1: ✅
  - Flow 2: ✅
  - Flow 3: N/A (emulator)
  - Flow 4: ✅
  - Flow 5: ✅

- [ ] Samsung Galaxy S21 - ✅ Pass / ❌ Fail
  - Flow 1: ✅
  - Flow 2: ✅
  - Flow 3: ✅
  - Flow 4: ✅
  - Flow 5: ✅

### P1 Devices

- [ ] Xiaomi Redmi Note 11 - ✅ Pass / ❌ Fail
  - Notes: [Any issues found]

### Issues Found

- [Issue description]
- [Device/OS version]
- [Steps to reproduce]
- [Severity: P0/P1/P2]
```

## Troubleshooting

### Emulator Issues

**Emulator won't start**:

```bash
# Kill existing emulator processes
pkill -f emulator

# Clear emulator cache
rm -rf ~/.android/avd/Pixel_6_API_34.avd/*.lock

# Restart emulator
emulator -avd Pixel_6_API_34 -wipe-data
```

**ADB connection issues**:

```bash
# Restart ADB server
adb kill-server
adb start-server

# Check devices
adb devices
```

### Physical Device Issues

**Device not recognized**:

- Install device drivers (Samsung, Xiaomi, etc.)
- Enable USB debugging
- Trust computer on device

**Permission denied**:

```bash
# Check USB debugging authorization
adb devices
# If "unauthorized", check device for authorization prompt
```

## Next Steps

1. **Immediate**:
   - Set up Pixel 6 emulator in CI
   - Create manual testing checklist
   - Document device provisioning process

2. **Short Term**:
   - Acquire physical Samsung Galaxy S21
   - Set up weekly testing schedule
   - Create test results reporting template

3. **Long Term**:
   - Integrate remote device farm
   - Automate P1 device testing
   - Expand to iOS simulators when Detox plugin available

## Resources

- [Device Matrix Plan](docs/mobile-device-matrix.md)
- [Mobile Debug Testing Guide](docs/mobile-debug-device-testing.md)
- [Mobile E2E Alternatives](docs/mobile-e2e-alternatives.md)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Android Emulator Guide](https://developer.android.com/studio/run/emulator)
