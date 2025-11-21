# Kalan İşler - Komut ve Denetim Planı

**Oluşturulma Tarihi:** 2025-01-17

Bu dokümanda, kalan 6 başlıktaki işlerin hangi komutlarla yapılacağı ve PowerShell dışında nasıl denetim yapılacağı detaylandırılmıştır.

---

## Özet: Komutlar ve PowerShell Dışı Denetim

### 1. Güvenlik Kontrolleri

**Komutlar:**
- `npm run audit` - npm audit (yüksek seviye)
- `npm run scan:secrets` - Gitleaks secret scanning
- `npx @google/osv-scanner --lockfile=package-lock.json` - OSV scanner

**PowerShell dışı denetim:**
- GitHub Actions: `.github/workflows/osv.yml` (haftalık otomatik)
- GitHub Actions: `.github/workflows/secret-scanning.yml` (her push/PR)
- Node.js scripts: `scripts/npm-audit.mjs`, `scripts/secure-server.mjs`

### 2. External Dependencies

**Komutlar:**
- `npx eas-cli whoami` - EAS authentication kontrolü
- `npx eas-cli build:list --platform android` - Android build durumu
- `npx eas-cli build:list --platform ios` - iOS build durumu
- `npm run test:ios:validate` - iOS setup validation

**PowerShell dışı denetim:**
- EAS CLI: Komut satırı araçları
- GitHub Actions: `.github/workflows/eas-build.yml` (otomatik build/submit)
- Validation scripts: `scripts/validate-ios-setup.mjs`
- Web arayüzleri: Play Console, App Store Connect

### 3. UI Implementation

**Komutlar:**
- `npm run test-storybook` - Storybook testleri
- `npm run vr` - Visual regression testleri
- `npm run a11y:stories` - Accessibility testleri
- `npm run test:e2e:all` - E2E testleri
- `npm run test:coverage:report` - Test coverage raporu

**PowerShell dışı denetim:**
- Playwright: E2E ve visual regression testleri
- Storybook: Component testleri ve accessibility
- Vitest: Unit testler ve coverage
- GitHub Actions: `.github/workflows/ci.yml` (otomatik)

### 4. Backend Deployment

**Komutlar:**
- `npm run openapi:validate` - OpenAPI validation
- `npm run types:api` - TypeScript type generation
- `firebase projects:list` - Firebase project kontrolü

**PowerShell dışı denetim:**
- OpenAPI validation: Otomatik spec kontrolü
- Firebase CLI: Firebase project/app kontrolü
- Manuel: Firebase Console, deployment platform arayüzleri

### 5. Physical Device Testing

**Komutlar:**
- `adb devices` - Android cihaz kontrolü
- `npx eas-cli device:list` - EAS device listesi
- `npm run detox:test:android` - Detox testleri (eğer yapılandırılmışsa)
- `npm run test:device-matrix:validate` - Device matrix validation

**PowerShell dışı denetim:**
- ADB: Android Debug Bridge (komut satırı)
- EAS CLI: Device ve build kontrolü
- Xcode CLI: iOS simulator/device kontrolü
- Validation scripts: `scripts/validate-device-matrix.mjs`

### 6. İleri Seviye Kontroller

**Komutlar:**
- `npm run deadcode` - Dead code analizi
- `npm run perf:budget` - Bundle size analizi
- `npm run sb:analyze` - Storybook bundle analizi
- `npm run lh:ci` - Lighthouse CI (performance, a11y, SEO)
- `npx complexity-report src/` - Code complexity analizi

**PowerShell dışı denetim:**
- Lighthouse CI: `.github/workflows/lhci.yml` (otomatik)
- Bundle Analyzer: Rollup visualizer
- TypeScript tools: Dead code, type checking
- Chrome DevTools: Performance profiling (manuel)
- React DevTools: Component profiling (manuel)

---

## 1. Güvenlik Kontrolleri

### Komutlar ve Araçlar

#### A. Dependency Güvenlik Taraması
```bash
# npm audit (yüksek seviye)
npm run audit
# veya
npm audit --audit-level=high

# Otomatik düzeltme (dikkatli kullan)
npm run audit:fix

# OSV Scanner (Google'ın açık kaynak güvenlik veritabanı)
npx @google/osv-scanner --lockfile=package-lock.json --format json
npx @google/osv-scanner --lockfile=apps/mobile/package-lock.json --format json
npx @google/osv-scanner --lockfile=backend/package-lock.json --format json
```

#### B. Secret Scanning
```bash
# Gitleaks (secret taraması)
npm run scan:secrets
# veya
npx gitleaks detect --redact --no-banner --log-level warn

# Manuel tarama
npx gitleaks detect --verbose --report-format json --report-path gitleaks-report.json
```

#### C. Malware/Trojan Kontrolü
```bash
# Node.js paketlerinde şüpheli dosyalar
find node_modules -name "*.exe" -o -name "*.bat" -o -name "*.sh" | grep -v ".bin"

# Şüpheli bağımlılıklar kontrolü
npm ls --depth=0 | grep -E "(miner|crypto|bitcoin|malware)"

# Package.json'da şüpheli scriptler
grep -r "eval\|exec\|spawn\|child_process" package.json apps/mobile/package.json
```

#### D. Gizlilik Kontrolleri
```bash
# PII (Personally Identifiable Information) taraması
grep -r -i "password\|secret\|key\|token\|api_key" --include="*.ts" --include="*.tsx" --include="*.js" src/ apps/mobile/app/ | grep -v "node_modules" | grep -v ".test." | grep -v ".spec."

# Hardcoded credentials kontrolü
grep -r -E "(api[_-]?key|secret[_-]?key|password|token)\s*[:=]\s*['\"][^'\"]+['\"]" --include="*.ts" --include="*.tsx" --include="*.js" src/ apps/mobile/app/

# Environment variable kullanımı kontrolü
grep -r "process\.env\." --include="*.ts" --include="*.tsx" src/ apps/mobile/app/ | grep -v "process.env.NODE_ENV"
```

### PowerShell Dışı Denetim Yöntemleri

1. **GitHub Actions Workflows** (Otomatik)
   - `.github/workflows/osv.yml` - OSV scanner (haftalık)
   - `.github/workflows/secret-scanning.yml` - Gitleaks (her push/PR)
   - `.github/workflows/ci.yml` - npm audit (her CI run)

2. **Node.js Scripts** (Manuel)
   - `scripts/npm-audit.mjs` - npm audit wrapper
   - `scripts/secure-server.mjs` - Güvenli server testi

3. **External Tools** (Manuel)
   - Snyk: `npx snyk test` (ücretsiz tier)
   - Dependabot: GitHub'da otomatik (yapılandırılabilir)
   - npm-check-updates: `npx npm-check-updates` (güncellemeleri kontrol)

---

## 2. External Dependencies (Kullanıcı Aksiyonu)

### Komutlar ve Araçlar

#### A. Apple Developer Program Kontrolü
```bash
# EAS CLI ile kontrol
cd apps/mobile
npx eas-cli whoami
npx eas-cli device:list

# iOS build durumu
npx eas-cli build:list --platform ios --limit 5

# App Store Connect API testi
npx eas-cli submit:list --platform ios
```

#### B. Google Play Console Kontrolü
```bash
# Android build durumu
cd apps/mobile
npx eas-cli build:list --platform android --limit 5

# Play Console submit durumu
npx eas-cli submit:list --platform android

# Service account testi
npx eas-cli submit --platform android --latest --non-interactive --dry-run
```

#### C. Store Listing Kontrolü
```bash
# Play Console API ile listing kontrolü (script gerekli)
# Manuel: Google Play Console web arayüzü

# App Store Connect API ile listing kontrolü (script gerekli)
# Manuel: App Store Connect web arayüzü
```

### PowerShell Dışı Denetim Yöntemleri

1. **EAS CLI** (Komut satırı)
   - Build durumu kontrolü
   - Submit durumu kontrolü
   - Device listesi kontrolü

2. **Validation Scripts** (Node.js)
   - `npm run test:ios:validate` - iOS setup validation
   - `scripts/validate-ios-setup.mjs` - iOS konfigürasyon kontrolü

3. **GitHub Actions** (Otomatik)
   - `.github/workflows/eas-build.yml` - Build ve submit otomasyonu

4. **Manuel Kontroller** (Web arayüzü)
   - Google Play Console web arayüzü
   - App Store Connect web arayüzü
   - GitHub Secrets kontrolü

---

## 3. UI Implementation

### Komutlar ve Araçlar

#### A. Component Testleri
```bash
# Storybook testleri
npm run test-storybook

# Visual regression testleri
npm run vr:update  # Snapshot güncelleme
npm run vr         # Snapshot karşılaştırma

# Accessibility testleri
npm run a11y:stories
```

#### B. E2E Testleri
```bash
# E2E testleri (UI implementasyonu sonrası)
npm run test:e2e:all

# Smoke testleri
npm run test:smoke

# Test coverage raporu
npm run test:coverage:report
```

#### C. Component Validation
```bash
# TypeScript type checking
npm run typecheck

# Lint kontrolleri
npm run lint

# Dead code analizi
npm run deadcode
```

### PowerShell Dışı Denetim Yöntemleri

1. **Playwright** (E2E Testing)
   - `playwright.e2e.config.ts` - E2E test config
   - `playwright.smoke.config.ts` - Smoke test config
   - `playwright.vr.config.ts` - Visual regression config

2. **Storybook** (Component Testing)
   - Storybook test runner
   - Accessibility addon
   - Visual regression snapshots

3. **Vitest** (Unit Testing)
   - `vitest.config.ts` - Test config
   - Coverage raporları

4. **GitHub Actions** (CI/CD)
   - `.github/workflows/ci.yml` - Tüm testler
   - `.github/workflows/e2e-smoke.yml` - E2E smoke testleri

---

## 4. Backend Deployment

### Komutlar ve Araçlar

#### A. Firebase FCM Kontrolü
```bash
# Firebase CLI ile kontrol
cd backend
firebase projects:list
firebase apps:list

# FCM server key kontrolü (manuel - Firebase Console)
# Backend'de environment variable kontrolü
grep -r "FCM_SERVER_KEY\|FIREBASE_SERVER_KEY" backend/
```

#### B. API Endpoint Testleri
```bash
# OpenAPI validation
npm run openapi:validate

# API client type generation
npm run types:api

# Backend testleri (backend klasöründe)
cd backend
npm test
```

#### C. Deployment Kontrolü
```bash
# Backend deployment durumu (Firebase/Cloud Run/etc.)
# Manuel: Deployment platform web arayüzü

# Environment variables kontrolü
grep -r "process\.env\." backend/src/ | grep -v "NODE_ENV"
```

### PowerShell Dışı Denetim Yöntemleri

1. **OpenAPI Validation** (Otomatik)
   - `npm run openapi:validate` - OpenAPI spec validation
   - `npm run openapi:bundle` - OpenAPI bundle oluşturma

2. **TypeScript Type Generation** (Otomatik)
   - `npm run types:api` - OpenAPI'dan TypeScript type'ları

3. **Firebase CLI** (Manuel)
   - Firebase project kontrolü
   - Firebase apps kontrolü

4. **Manuel Kontroller**
   - Firebase Console - FCM server key
   - Deployment platform - Deployment durumu

---

## 5. Physical Device Testing

### Komutlar ve Araçlar

#### A. Android Device Testing
```bash
# ADB ile cihaz kontrolü
adb devices
adb shell getprop ro.build.version.release
adb shell getprop ro.product.model

# APK yükleme ve test
cd apps/mobile
npx eas-cli build:list --platform android --limit 1
# APK indirme ve yükleme
adb install -r path/to/app.apk

# Detox testleri (eğer yapılandırılmışsa)
cd apps/mobile
npm run detox:build:android
npm run detox:test:android
```

#### B. iOS Device Testing
```bash
# iOS cihaz kontrolü
xcrun simctl list devices
xcrun simctl list devices available

# EAS ile device listesi
cd apps/mobile
npx eas-cli device:list

# TestFlight build kontrolü
npx eas-cli build:list --platform ios --limit 5
```

#### C. E2E Testleri (Device'ta)
```bash
# Playwright mobile testleri (eğer yapılandırılmışsa)
npx playwright test --config=playwright.mobile.config.ts

# Device matrix validation
npm run test:device-matrix:validate
```

### PowerShell Dışı Denetim Yöntemleri

1. **EAS CLI** (Komut satırı)
   - Device listesi
   - Build durumu
   - TestFlight durumu

2. **ADB (Android Debug Bridge)** (Komut satırı)
   - Android cihaz kontrolü
   - APK yükleme
   - Log kontrolü

3. **Xcode Command Line Tools** (macOS)
   - iOS simulator kontrolü
   - Device kontrolü

4. **Validation Scripts** (Node.js)
   - `npm run test:device-matrix:validate` - Device matrix validation
   - `scripts/validate-device-matrix.mjs` - Device matrix kontrolü

5. **Manuel Testler**
   - Fiziksel cihazlarda manuel test
   - TestFlight beta testleri

---

## 6. İleri Seviye Kontroller

### Komutlar ve Araçlar

#### A. Derin Kod Analizi
```bash
# Dead code analizi
npm run deadcode
# veya
npx ts-prune

# Code complexity analizi
npx complexity-report src/
npx jscpd src/ --min-lines 5 --min-tokens 50

# Dependency analizi
npm ls --depth=0
npm outdated
```

#### B. Performance Profiling
```bash
# Bundle size analizi
npm run perf:budget
npm run sb:analyze  # Storybook bundle analizi

# Lighthouse CI (performance)
npm run lh:ci

# Web vitals kontrolü
npx web-vitals --json > web-vitals.json
```

#### C. Memory Leak Kontrolleri
```bash
# Node.js memory profiling
node --inspect scripts/memory-profile.mjs

# Chrome DevTools memory profiling
# Manuel: Chrome DevTools > Memory > Heap Snapshot

# React DevTools Profiler
# Manuel: React DevTools > Profiler
```

#### D. Accessibility Derin Taraması
```bash
# Axe accessibility testleri
npm run a11y:stories

# Lighthouse accessibility
npm run lh:ci  # Accessibility score dahil

# Pa11y (accessibility CLI)
npx pa11y http://localhost:6006 --standard WCAG2AA
```

#### E. SEO Optimizasyon Kontrolleri
```bash
# Meta tag kontrolü
grep -r "meta name=\"description\"" public/
grep -r "og:title\|og:description\|og:image" public/

# Structured data kontrolü
grep -r "application/ld+json" public/

# Sitemap kontrolü
cat public/sitemap.xml | xmllint --format -

# Robots.txt kontrolü
cat public/robots.txt
```

#### F. Cross-Browser Testleri
```bash
# Playwright cross-browser testleri
npx playwright test --project=chromium --project=firefox --project=webkit

# BrowserStack/Sauce Labs (eğer yapılandırılmışsa)
# Manuel: BrowserStack/Sauce Labs web arayüzü
```

### PowerShell Dışı Denetim Yöntemleri

1. **Lighthouse CI** (Otomatik)
   - `.github/workflows/lhci.yml` - Lighthouse CI workflow
   - Performance, Accessibility, SEO, Best Practices

2. **Bundle Analyzer** (Manuel)
   - `npm run sb:analyze` - Storybook bundle analizi
   - Rollup visualizer

3. **TypeScript Tools** (Otomatik)
   - `npm run deadcode` - Dead code analizi
   - `npm run typecheck` - Type checking

4. **Playwright** (E2E Testing)
   - Cross-browser testleri
   - Visual regression testleri

5. **External Tools** (Manuel)
   - Chrome DevTools - Performance profiling
   - React DevTools - Component profiling
   - WebPageTest - Performance testing

---

## Özet: Komut ve Araç Matrisi

| Başlık | Komutlar | PowerShell Dışı Denetim | Otomatik |
|--------|----------|------------------------|----------|
| **1. Güvenlik** | `npm run audit`, `npm run scan:secrets`, `npx @google/osv-scanner` | GitHub Actions (OSV, Secret Scanning), Node.js scripts | ✅ |
| **2. External Dependencies** | `npx eas-cli`, validation scripts | EAS CLI, GitHub Actions, Web arayüzleri | ⚠️ Kısmi |
| **3. UI Implementation** | `npm run test-storybook`, `npm run vr`, `npm run a11y:stories` | Playwright, Storybook, Vitest, GitHub Actions | ✅ |
| **4. Backend Deployment** | `npm run openapi:validate`, `firebase CLI` | OpenAPI validation, Firebase CLI, Manuel | ⚠️ Kısmi |
| **5. Physical Device Testing** | `adb`, `npx eas-cli`, `npm run detox` | EAS CLI, ADB, Xcode, Validation scripts | ❌ Manuel |
| **6. İleri Seviye** | `npm run deadcode`, `npm run perf:budget`, `npm run lh:ci` | Lighthouse CI, Bundle analyzer, DevTools | ✅ Kısmi |

---

## Notlar

- **✅ Otomatik:** GitHub Actions veya npm scripts ile otomatik çalışır
- **⚠️ Kısmi:** Bazı kısımlar otomatik, bazıları manuel
- **❌ Manuel:** Kullanıcı aksiyonu gerektirir

- **PowerShell dışı denetim:** Node.js scripts, GitHub Actions, CLI tools, Web arayüzleri
- **Tüm komutlar:** Node.js/npm ecosystem'inde çalışır (cross-platform)

---

**Son Güncelleme:** 2025-01-17

