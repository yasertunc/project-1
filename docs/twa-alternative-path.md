# TWA (Trusted Web Activity) Alternative Path (TWA.1, TWA.2)

This document outlines the TWA (Trusted Web Activity) alternative path for building the Fellowus mobile app as a Progressive Web App (PWA) wrapped in a native Android shell.

## Overview

TWA allows you to package a PWA as an Android app using Chrome's Trusted Web Activity feature. This approach is ideal for web-first applications that want native app distribution.

## When to Use TWA

Consider TWA if:
- Your app is primarily web-based
- You want minimal native code
- You need Play Store distribution for a PWA
- You want to leverage existing web infrastructure
- You prefer web technologies over native

## Prerequisites

- PWA fully functional and hosted
- Android Studio installed
- Google Play Console account
- Domain with HTTPS enabled

## TWA.1 PWA Compliance

### Step 1: Web App Manifest

Create or update `public/manifest.json`:

```json
{
  "name": "Fellowus",
  "short_name": "Fellowus",
  "description": "Anonymous Event Matching",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot-1.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ],
  "categories": ["social", "lifestyle"],
  "shortcuts": [
    {
      "name": "Get Started",
      "short_name": "Start",
      "description": "Start matching",
      "url": "/#get-started",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    }
  ]
}
```

### Step 2: Service Worker

Create `public/sw.js` (or use a service worker library):

```javascript
const CACHE_NAME = 'fellowus-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

Register service worker in your HTML:

```html
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => console.log('SW registered'))
    .catch((error) => console.log('SW registration failed'));
}
</script>
```

### Step 3: HTTPS Requirement

TWA requires HTTPS. Ensure your domain:
- Has valid SSL certificate
- Redirects HTTP to HTTPS
- Uses HSTS headers (optional but recommended)

### Step 4: Digital Asset Links

Create `.well-known/assetlinks.json` on your domain:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.fellowus.app",
    "sha256_cert_fingerprints": [
      "YOUR_APP_SHA256_FINGERPRINT"
    ]
  }
}]
```

**Place at**: `https://www.fellowus.com/.well-known/assetlinks.json`

**Get SHA256 fingerprint**:
```bash
# After building TWA (see TWA.2)
keytool -list -v -keystore your-keystore.jks -alias your-alias
```

### Step 5: PWA Testing

Test PWA compliance:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Test PWA
lighthouse https://www.fellowus.com --view

# Or use Chrome DevTools
# Application → Manifest → Check all items
```

**PWA Checklist**:
- [ ] Manifest file valid and accessible
- [ ] Service worker registered and working
- [ ] HTTPS enabled
- [ ] Icons provided (192x192, 512x512)
- [ ] Start URL works offline
- [ ] Display mode set to "standalone"
- [ ] Theme color configured
- [ ] Asset links file created

## TWA.2 Android Studio TWA Project

### Step 1: Install TWA Generator

```bash
# Install Bubblewrap CLI
npm install -g @bubblewrap/cli

# Or use Android Studio TWA template
```

### Step 2: Initialize TWA Project

**Option A: Using Bubblewrap (Recommended)**

```bash
# Initialize TWA project
bubblewrap init --manifest https://www.fellowus.com/manifest.json

# Follow prompts:
# - Application ID: com.fellowus.app
# - Application name: Fellowus
# - Launcher name: Fellowus
# - Key store path: (create or use existing)
# - Key store password: (set password)
# - Key name: (set alias)
# - Key password: (set password)
```

**Option B: Using Android Studio**

1. Open Android Studio
2. File → New → New Project
3. Select "Trusted Web Activity"
4. Enter package name: `com.fellowus.app`
5. Enter start URL: `https://www.fellowus.com`

### Step 3: Configure TWA

**Update `AndroidManifest.xml`**:

```xml
<activity
    android:name="com.google.androidbrowserhelper.trusted.TwaLauncherActivity"
    android:label="@string/app_name">
    <meta-data
        android:name="assetStatements"
        android:resource="@string/asset_statements" />
    <meta-data
        android:name="webManifestUrl"
        android:value="https://www.fellowus.com/manifest.json" />
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https"
              android:host="www.fellowus.com" />
    </intent-filter>
</activity>
```

**Update `strings.xml`**:

```xml
<string name="asset_statements">
    [{
        \"relation\": [\"delegate_permission/common.handle_all_urls\"],
        \"target\": {
            \"namespace\": \"web\",
            \"site\": \"https://www.fellowus.com\"
        }
    }]
</string>
```

### Step 4: Generate Signed AAB

1. **Create Keystore** (if not exists):
   ```bash
   keytool -genkey -v -keystore fellowus-release.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias fellowus
   ```

2. **Configure Signing** in `app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file('fellowus-release.jks')
               storePassword 'YOUR_STORE_PASSWORD'
               keyAlias 'fellowus'
               keyPassword 'YOUR_KEY_PASSWORD'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. **Build AAB**:
   ```bash
   ./gradlew bundleRelease
   ```

4. **Locate AAB**: `app/build/outputs/bundle/release/app-release.aab`

### Step 5: Test TWA

1. **Build APK for testing**:
   ```bash
   ./gradlew assembleRelease
   ```

2. **Install on device**:
   ```bash
   adb install app/build/outputs/apk/release/app-release.apk
   ```

3. **Verify**:
   - App opens in fullscreen (no browser UI)
   - Asset links verified (check Chrome DevTools)
   - Offline functionality works
   - Push notifications work (if implemented)

### Step 6: Update Asset Links

After building, get SHA256 fingerprint:

```bash
keytool -list -v -keystore fellowus-release.jks -alias fellowus
```

Update `.well-known/assetlinks.json` with the fingerprint:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.fellowus.app",
    "sha256_cert_fingerprints": [
      "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
    ]
  }
}]
```

Verify asset links:
```bash
# Test asset links
curl https://www.fellowus.com/.well-known/assetlinks.json

# Verify with Google tool
# https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://www.fellowus.com&relation=delegate_permission/common.handle_all_urls
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: TWA Build

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-twa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Build AAB
        run: |
          cd android
          ./gradlew bundleRelease
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-release.aab
          path: android/app/build/outputs/bundle/release/app-release.aab
```

## Comparison: TWA vs Expo vs Capacitor

| Feature | TWA | Expo | Capacitor |
|---------|-----|------|-----------|
| Native Code | ❌ None | ✅ Limited | ✅ Full |
| Web Technologies | ✅ Full web | ⚠️ React Native | ✅ Full web |
| Build Process | ⚠️ Manual | ✅ Cloud | ⚠️ Manual |
| Offline Support | ✅ Service Worker | ⚠️ Limited | ✅ Service Worker |
| Push Notifications | ⚠️ Web Push | ✅ Native | ✅ Native |
| App Store | ⚠️ Android only | ✅ Both | ✅ Both |
| Development Speed | ✅ Fastest | ✅ Fast | ⚠️ Slower |

## Limitations

- **iOS Support**: TWA is Android-only. For iOS, use PWA or Capacitor
- **Native Features**: Limited to web APIs and Chrome features
- **Push Notifications**: Uses Web Push API (less reliable than native)
- **Performance**: Slightly slower than native apps

## Troubleshooting

### Asset Links Not Working

**Error**: "App not verified"
- **Solution**: Verify `assetlinks.json` is accessible and correctly formatted
- **Check**: SHA256 fingerprint matches keystore

### App Opens in Browser

**Error**: App opens in Chrome instead of standalone
- **Solution**: Verify asset links are correctly configured
- **Check**: Manifest has `display: "standalone"`

### Service Worker Not Working

**Error**: Offline functionality not working
- **Solution**: Verify service worker is registered
- **Check**: HTTPS is enabled

## Resources

- [TWA Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Digital Asset Links](https://developers.google.com/digital-asset-links)

## Next Steps

After completing TWA setup:

1. Test on multiple Android devices
2. Submit to Play Store
3. Monitor performance and user feedback
4. Consider iOS PWA or Capacitor for iOS support
5. Implement Web Push for notifications

