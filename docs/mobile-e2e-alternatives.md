# Mobile E2E Testing Alternatives (11.4)

This document outlines alternative approaches for mobile E2E testing when Detox is not available or compatible.

## Current Status

- **Detox**: Configured but blocked by Expo 54 plugin compatibility
- **Expo 54**: Lacks compatible `@config-plugins/detox` plugin
- **Workaround**: Manual prebuild + manifest edits required

## Alternative Approaches

### Option 1: Manual Prebuild + Detox (Recommended)

This approach uses Expo's prebuild to generate native projects, then configures Detox manually.

#### Steps

1. **Generate Native Projects**:
   ```bash
   cd apps/mobile
   npx expo prebuild --clean
   ```

2. **Install Detox Dependencies**:
   ```bash
   npm install --save-dev detox jest-circus
   ```

3. **Configure Detox Manually**:
   - Edit `android/app/build.gradle`
   - Edit `ios/Podfile`
   - Add Detox configuration to native projects

4. **Update `detox.config.ts`**:
   ```typescript
   export default {
     testRunner: {
       args: {
         '$0': 'jest',
         config: 'e2e/jest.config.js'
       },
       jest: {
         setupTimeout: 120000
       }
     },
     apps: {
       'android.debug': {
         type: 'android.apk',
         binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
         build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug'
       }
     },
     devices: {
       emulator: {
         type: 'android.emulator',
         device: {
           avdName: 'Pixel_5_API_33'
         }
       }
     },
     configurations: {
       'android.emu.debug': {
         device: 'emulator',
         app: 'android.debug'
       }
     }
   };
   ```

5. **Build and Test**:
   ```bash
   npm run detox:build:android
   npm run detox:test:android
   ```

#### Pros
- Full Detox functionality
- Native app testing
- Fast execution

#### Cons
- Requires native project generation
- Manual configuration needed
- More complex setup

### Option 2: Maestro (Alternative Framework)

Maestro is a modern mobile UI testing framework that works with any app.

#### Installation

```bash
# Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Or via npm
npm install -g @maestro/cli
```

#### Create Test Flow

Create `apps/mobile/e2e/maestro/onboarding.yaml`:

```yaml
appId: com.fellowus.app
---
- launchApp
- assertVisible: "Get Started"
- tapOn: "Get Started"
- assertVisible: "How It Works"
- scroll
- assertVisible: "Download App"
- tapOn: "Download App"
```

#### Run Tests

```bash
cd apps/mobile
maestro test e2e/maestro/
```

#### Pros
- Works with any app (no special setup)
- Simple YAML-based tests
- Cross-platform (Android + iOS)
- No native project needed

#### Cons
- Newer framework (less community)
- Limited advanced features
- Requires app to be installed

### Option 3: Appium (Industry Standard)

Appium is the industry standard for mobile automation.

#### Installation

```bash
npm install --save-dev appium @wdio/cli
npx wdio config
```

#### Configuration

Create `apps/mobile/e2e/appium/wdio.conf.ts`:

```typescript
export const config = {
  runner: 'local',
  port: 4723,
  specs: ['./e2e/appium/**/*.spec.ts'],
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'Android Emulator',
    'appium:app': './android/app/build/outputs/apk/debug/app-debug.apk',
    'appium:automationName': 'UiAutomator2'
  }],
  services: ['appium'],
  framework: 'mocha',
};
```

#### Pros
- Industry standard
- Large community
- Supports many platforms
- Rich ecosystem

#### Cons
- More complex setup
- Slower than Detox
- Requires native builds

### Option 4: Manual Testing + Screenshots

For quick validation, manual testing with screenshot comparison.

#### Setup

1. **Install Screenshot Tools**:
   ```bash
   npm install --save-dev pixelmatch pngjs
   ```

2. **Create Manual Test Script**:
   ```typescript
   // scripts/manual-mobile-test.mjs
   import { execSync } from 'child_process';
   
   // Take screenshots on device
   execSync('adb shell screencap -p /sdcard/screen.png');
   execSync('adb pull /sdcard/screen.png screenshots/');
   
   // Compare with baseline
   // ...
   ```

3. **Test Checklist**:
   - Follow `docs/mobile-debug-device-testing.md`
   - Take screenshots at each step
   - Compare with baseline images

#### Pros
- Simple setup
- Works immediately
- No special tools needed

#### Cons
- Manual effort required
- Not automated
- Time-consuming

### Option 5: Expo Dev Client + Manual Testing

Use Expo Dev Client for development builds and manual testing.

#### Setup

1. **Build Dev Client**:
   ```bash
   cd apps/mobile
   npx eas build --profile development --platform android
   ```

2. **Install on Device**:
   - Download APK from EAS
   - Install on physical device
   - Connect via `npx expo start --dev-client`

3. **Manual Testing**:
   - Follow test checklist
   - Document results
   - Take screenshots

#### Pros
- Uses existing Expo infrastructure
- Fast iteration
- Real device testing

#### Cons
- Manual testing only
- Not automated
- Requires physical device

## Recommendation

### Short Term (Now)
- **Use Option 5**: Expo Dev Client + Manual Testing
- Follow `docs/mobile-debug-device-testing.md`
- Document test results

### Medium Term (When Detox Plugin Available)
- **Use Option 1**: Manual Prebuild + Detox
- Full automated testing
- CI/CD integration

### Long Term (If Detox Remains Blocked)
- **Consider Option 2**: Maestro
- Simpler than Appium
- Works with Expo apps
- Good for E2E flows

## Implementation Plan

### Phase 1: Manual Testing (Immediate)
1. Build dev client APK
2. Install on physical devices
3. Follow test checklist
4. Document results

### Phase 2: Automated Testing (When Possible)
1. Wait for Detox plugin update OR
2. Implement manual prebuild + Detox OR
3. Evaluate Maestro for adoption

### Phase 3: CI/CD Integration
1. Set up device farm or emulator
2. Integrate with GitHub Actions
3. Run tests on every PR

## Test Coverage Goals

### Critical Paths (P0)
- [ ] App launches successfully
- [ ] Tab navigation works
- [ ] Push notification permission
- [ ] Error boundaries catch errors
- [ ] Deep links work (if configured)

### Important Paths (P1)
- [ ] Matching flow (when implemented)
- [ ] Profile setup (when implemented)
- [ ] Notification registration
- [ ] Settings/preferences

### Nice to Have (P2)
- [ ] All screens render correctly
- [ ] Animations work smoothly
- [ ] Offline mode handling
- [ ] Performance metrics

## Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Appium Documentation](https://appium.io/docs/en/latest/)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [Mobile Debug Testing Guide](docs/mobile-debug-device-testing.md)

