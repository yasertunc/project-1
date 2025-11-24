# 🚀 FellowUs APK Oluşturma Rehberi

## Öngereksinimler

1. **Android Studio** veya **Android SDK** kurulu olmalı
2. **Java JDK 11+** kurulu olmalı

## APK Oluşturma Yöntemleri

### Yöntem 1: Android Studio (Kolay)

```bash
npx cap open android
```

- Android Studio açılınca: **Build → Build APK(s)**
- APK konumu: `android/app/build/outputs/apk/debug/app-debug.apk`

### Yöntem 2: Komut Satırı

```bash
cd android
./gradlew assembleDebug
```

### Yöntem 3: Online APK Builder (En Hızlı)

1. GitHub'a push yapın
2. [Appetize.io](https://appetize.io) veya [Expo Snack](https://snack.expo.dev) kullanın
3. Veya GitHub Actions ile otomatik APK build:

```yaml
# .github/workflows/build-apk.yml
name: Build APK
on:
  push:
    branches: [main, feat/mobile-mvp]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build web assets
        run: npm run build

      - name: Setup JDK
        uses: actions/setup-java@v3
        with:
          java-version: "11"
          distribution: "temurin"

      - name: Build APK
        run: |
          npx cap sync android
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

## 📱 Test Etme

### Fiziksel Cihazda:

1. APK'yı telefona kopyala
2. **Ayarlar → Güvenlik → Bilinmeyen Kaynaklardan Yükleme**'yi aç
3. APK'ya tıkla ve yükle

### Emülatörde:

```bash
npx cap run android
```

## 🎯 Production APK

Signed APK için:

```bash
cd android
./gradlew assembleRelease
```

**Not:** Keystore dosyası gerekli. [Detaylı bilgi](https://developer.android.com/studio/publish/app-signing)

## 📌 Hızlı İpuçları

- APK boyutunu küçültmek için: `npm run build -- --minify`
- İkon eklemek: `android/app/src/main/res/` klasörüne
- Splash screen: Capacitor Splash Screen plugin kullan
- Push notifications: Capacitor Push Notifications plugin

## 🌐 Alternatif: PWA Olarak Yayınla

APK yerine PWA olarak da yayınlayabilirsiniz:

- Vercel/Netlify'a deploy et
- Kullanıcılar "Ana Ekrana Ekle" ile uygulama gibi kullanabilir
- App Store/Play Store gerektirmez
