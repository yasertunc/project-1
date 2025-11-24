# FellowUs Deployment Guide

## 🌐 Web Deployment (Current Project)

### Option 1: Deploy to Vercel (Recommended)

1. **Push to GitHub:**

```bash
# Remote repository ekle
git remote add origin https://github.com/YOUR_USERNAME/fellowus.git

# Push to GitHub
git push -u origin feat/mobile-mvp
```

2. **Vercel'e Deploy:**

- [Vercel.com](https://vercel.com) hesabı oluşturun
- GitHub repo'nuzu bağlayın
- Otomatik deploy olacaktır

### Option 2: Deploy to Netlify

1. **Build the project:**

```bash
npm run build
```

2. **Deploy:**

- [Netlify.com](https://netlify.com) hesabı oluşturun
- `dist` klasörünü drag & drop yapın

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## 📱 Mobile App Conversion (React Native/Expo)

### Why Convert?

Bu proje şu anda bir **React Web Uygulaması**. Mobil APK oluşturmak için **React Native**'e dönüştürülmesi gerekiyor.

### Option 1: Expo React Native Projesi Oluşturma

```bash
# Yeni Expo projesi oluştur
npx create-expo-app FellowUsMobile --template

cd FellowUsMobile

# Gerekli paketleri yükle
npx expo install react-native-maps react-native-gesture-handler react-native-reanimated
```

### Option 2: Capacitor ile Hybrid App (Önerilen)

Mevcut React web projenizi mobil uygulamaya dönüştürür:

```bash
# Capacitor yükle
npm install @capacitor/core @capacitor/android @capacitor/ios

# Capacitor'ı initialize et
npx cap init

# Android platform ekle
npx cap add android

# Build et
npm run build

# Capacitor'a kopyala
npx cap copy

# Android Studio'da aç
npx cap open android
```

### Option 3: PWA (Progressive Web App) - En Hızlı

```bash
# PWA desteği ekle
npm install -D vite-plugin-pwa

# vite.config.ts'e ekle:
import { VitePWA } from 'vite-plugin-pwa'

// plugins içine:
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'FellowUs',
    short_name: 'FellowUs',
    theme_color: '#667eea',
    icons: [...]
  }
})
```

## 🚀 Quick Start - Web to APK with Capacitor

1. **Install Dependencies:**

```bash
npm install @capacitor/core @capacitor/android @capacitor/cli
```

2. **Initialize Capacitor:**

```bash
npx cap init "FellowUs" "com.fellowus.app"
```

3. **Add Android Platform:**

```bash
npx cap add android
```

4. **Build Web Assets:**

```bash
npm run build
```

5. **Sync with Capacitor:**

```bash
npx cap sync
```

6. **Open in Android Studio:**

```bash
npx cap open android
```

7. **Generate APK in Android Studio:**

- Build → Build Bundle(s) / APK(s) → Build APK(s)

## 📝 Notes

- **Current Status:** React Web App (Vite + React + TypeScript)
- **Mobile Options:** Capacitor (Hybrid), React Native (Native), PWA (Web-based)
- **Recommended:** Capacitor for quick conversion, React Native for best performance
