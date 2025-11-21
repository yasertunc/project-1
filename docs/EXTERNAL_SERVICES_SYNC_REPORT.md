# External Services Synchronization Report

## Tarih: 2025-01-16

Bu rapor, `fellowus-complete-specification.json` dosyasındaki dış servis konfigürasyonlarına göre mevcut proje dosyalarının senkronizasyon durumunu analiz eder.

## 📋 Spesifikasyon Gereksinimleri

### API Endpoints (JSON Spesifikasyonu)

```json
{
  "base": "https://api.fellowus.app/v2",
  "auth": "/auth",
  "users": "/users",
  "locations": "/locations",
  "messages": "/messages",
  "notifications": "/notifications",
  "ai": "/ai/assistant"
}
```

### Deployment Platforms

```json
{
  "web": {
    "hosting": "Vercel / Netlify",
    "cdn": "CloudFlare",
    "domain": "fellowus.app"
  },
  "mobile": {
    "ios": {
      "minVersion": "iOS 13.0",
      "bundle": "com.fellowus.app",
      "appStore": true
    },
    "android": {
      "minSdk": 23,
      "targetSdk": 33,
      "package": "com.fellowus.app",
      "playStore": true
    }
  }
}
```

### Environments

```json
{
  "development": {
    "url": "http://localhost:3000"
  },
  "staging": {
    "url": "https://staging.fellowus.app"
  },
  "production": {
    "url": "https://www.fellowus.com"
  }
}
```

## 🔍 Mevcut Durum Analizi

### 1. API Endpoints

**Spesifikasyon:**

- Base: `https://api.fellowus.app/v2`

**Mevcut Durum:**

- `src/api/matchingClient.ts`: `https://staging-api.fellowus.app` (default) ❌
- `openapi/matching.yaml`:
  - Production: `https://api.fellowus.app` ⚠️ (domain doğru ama `/v2` yok)
  - Staging: `https://staging-api.fellowus.app` ⚠️ (domain farklı)

**Sorun:**

- API base URL'de `/v2` versiyonu eksik
- Staging domain'i `staging-api.fellowus.app` yerine `staging.fellowus.app` olmalı
- Production domain'i `api.fellowus.app` yerine `api.fellowus.app` olmalı

### 2. Domain Names

**Spesifikasyon:**

- Production: `fellowus.app`
- Staging: `staging.fellowus.app`
- API: `api.fellowus.app`

**Mevcut Durum:**

- `src/lib/env.ts`: `https://www.fellowus.com/download` ⚠️
- `apps/mobile/app.config.ts`: `https://www.fellowus.com/download` ⚠️
- GitHub workflows: `https://www.fellowus.com/download` ⚠️
- OpenAPI: `https://api.fellowus.app` ve `https://staging-api.fellowus.app` ❌

**Sorun:**

- `fellowus.app` yerine `fellowus.app` kullanılmalı
- `api.fellowus.app` yerine `api.fellowus.app` kullanılmalı
- `staging-api.fellowus.app` yerine `staging.fellowus.app` kullanılmalı

### 3. Mobile App Configuration

**iOS:**

- ✅ Bundle ID: `com.fellowus.app` (doğru)
- ⚠️ Min Version: Kontrol edilmeli (JSON'da iOS 13.0)

**Android:**

- ✅ Package: `com.fellowus.app` (doğru)
- ⚠️ Min SDK: Kontrol edilmeli (JSON'da 23)
- ⚠️ Target SDK: Kontrol edilmeli (JSON'da 33)

### 4. Chromatic

**Durum:** ✅ Doğru yapılandırılmış

- Workflow: `.github/workflows/chromatic.yml`
- Token: `CHROMATIC_PROJECT_TOKEN` secret
- Build script: `build-storybook`

### 5. Storybook

**Durum:** ✅ Doğru yapılandırılmış

- Config: `.storybook/main.ts`
- Build: `build-storybook` script
- Preview: GitHub Pages deployment

### 6. GitHub Actions

**Durum:** ✅ Doğru yapılandırılmış

- CI: `.github/workflows/ci.yml`
- Chromatic: `.github/workflows/chromatic.yml`
- EAS Build: `.github/workflows/eas-build.yml`
- Preview: `.github/workflows/preview.yml`
- Release: `.github/workflows/release-pages.yml`

### 7. Google Services

**Durum:** ✅ Doğru yapılandırılmış

- Play Console: `com.fellowus.app`
- Service Account: GitHub Secrets'te
- EAS Submit: Workflow'da aktif

### 8. Apple Services

**Durum:** ✅ Doğru yapılandırılmış

- App Store Connect: `com.fellowus.app`
- API Keys: GitHub Secrets'te
- EAS Build: iOS workflow aktif

## 🔧 Gerekli Düzeltmeler

### Öncelik 1: API Endpoints

1. `src/api/matchingClient.ts` - Base URL'i `https://api.fellowus.app/v2` olarak güncelle
2. `openapi/matching.yaml` - Server URL'lerini güncelle:
   - Production: `https://api.fellowus.app/v2`
   - Staging: `https://staging.fellowus.app/v2`

### Öncelik 2: Domain Names

1. `src/lib/env.ts` - `fellowus.app` → `fellowus.app`
2. `apps/mobile/app.config.ts` - `fellowus.app` → `fellowus.app`
3. GitHub workflows - `fellowus.app` → `fellowus.app`
4. OpenAPI spec - Domain'leri güncelle

### Öncelik 3: Mobile App Config

1. iOS minVersion kontrolü ve güncelleme
2. Android minSdk ve targetSdk kontrolü ve güncelleme

## ✅ Doğru Olanlar

1. ✅ Bundle ID / Package: `com.fellowus.app`
2. ✅ Chromatic konfigürasyonu
3. ✅ Storybook konfigürasyonu
4. ✅ GitHub Actions workflows
5. ✅ Google Play Console entegrasyonu
6. ✅ Apple App Store Connect entegrasyonu
7. ✅ EAS Build konfigürasyonu

## 📊 Uyumluluk Oranı

- **Tamamlanan**: 7/10 (%70)
- **Düzeltilmesi Gereken**: 3/10 (%30)
  - API endpoints (domain + version)
  - Domain names (fellowus.app → fellowus.app)
  - Mobile SDK versions (kontrol gerekli)
