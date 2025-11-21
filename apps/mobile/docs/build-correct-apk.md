# Doğru APK Build Etme Rehberi

## Sorun

Önceki APK build'leri yanlış projeden indirildiği için hatalı uygulama içeriyordu. Bu rehber, doğru projeden build oluşturmak için adımları içerir.

## Çözüm

### 1. Yerel Build (Önerilen - Hızlı Test İçin)

```bash
cd apps/mobile

# EAS CLI login olun
npx eas-cli login

# Proje ID'yi kontrol edin
cat app.config.ts | grep projectId
# Beklenen: 694fc69a-a332-4142-9a41-54012868a73b

# APK build oluşturun
npx eas-cli build --platform android --profile production-apk --local

# Build tamamlandıktan sonra APK şu konumda olacak:
# ~/Downloads/FellowusMobile-production-apk-*.apk
```

### 2. Cloud Build (EAS)

```bash
cd apps/mobile

# EAS CLI login
npx eas-cli login

# Build oluştur
npx eas-cli build --platform android --profile production-apk

# Build ID'yi not edin (output'ta görünecek)
# Örnek: Build ID: 12345678-1234-1234-1234-123456789abc

# Build tamamlandıktan sonra indirin
npx eas-cli build:download --id [BUILD_ID] --path artifacts/
```

### 3. GitHub Actions ile Build

1. **GitHub'da workflow'u tetikleyin:**
   - GitHub repository sayfasına gidin
   - "Actions" sekmesine tıklayın
   - "EAS Build" workflow'unu seçin
   - "Run workflow" butonuna tıklayın
   - "android-apk" job'unu seçin
   - "Run workflow" butonuna tıklayın

2. **Build tamamlandıktan sonra:**
   - Workflow run sayfasına gidin
   - "android-apk" job'unu açın
   - "Upload APK artifact" step'inde APK indirebilirsiniz

## Doğrulama

Build'den sonra APK'yı doğrulamak için:

### 1. Package Name Kontrolü

```bash
# APK bilgilerini kontrol edin
aapt dump badging FellowusMobile-production-apk.apk | grep package

# Beklenen çıktı:
# package: name='com.fellowus.app'
```

### 2. İçerik Kontrolü

APK'yı açtığınızda (emülatörde veya cihazda):

- ✅ Uygulama adı: "Fellowus Mobile" olmalı
- ✅ Package: com.fellowus.app olmalı
- ✅ Ana ekran: Projenizin gerçek ekranları olmalı (Chats, Discover, Safety, Profile)

## Önemli Notlar

### EAS Project ID

Projenin doğru EAS project ID'si: `694fc69a-a332-4142-9a41-54012868a73b`

Bu ID `app.config.ts` dosyasında tanımlı:

```typescript
const DEFAULT_PROJECT_ID = "694fc69a-a332-4142-9a41-54012868a73b";
```

### Build Profilleri

- `production-apk`: APK formatında production build (test için)
- `production`: AAB formatında production build (Play Store için)
- `preview`: Internal distribution için APK
- `development`: Development client APK

### Hatalı Build Tespiti

Eğer build yanlış projeden geliyorsa:

- ❌ Farklı bir uygulama görünür
- ❌ Package name `com.fellowus.app` değildir
- ❌ Uygulama içeriği projeyle eşleşmez

Bu durumda:

1. Build'i iptal edin
2. Proje ID'yi kontrol edin
3. EAS credentials'ları kontrol edin
4. Yeniden build yapın

## Sorun Giderme

### Build ID Bulunamıyor

```bash
# En son build'leri listeleyin
npx eas-cli build:list --platform android --limit 5

# Belirli bir build'i görüntüleyin
npx eas-cli build:view [BUILD_ID]
```

### Yanlış Proje

```bash
# EAS projelerini listeleyin
npx eas-cli project:info

# Proje ID'yi doğrulayın
cat apps/mobile/app.config.ts | grep projectId
```

### Build Başarısız Oluyor

1. Environment variables kontrol edin
2. EAS credentials kontrol edin: `npx eas-cli credentials`
3. Expo token kontrol edin: `echo $EXPO_TOKEN`

## Yeni Build Sonrası

Build tamamlandıktan sonra:

1. ✅ APK'yı indirin
2. ✅ Package name'i kontrol edin (`com.fellowus.app`)
3. ✅ Emülatörde veya cihazda test edin
4. ✅ İçeriğin doğru olduğunu doğrulayın

## İletişim

Build ile ilgili sorunlar için:

- EAS Dashboard: https://expo.dev/accounts/yasertunc/projects/fellowus-mobile/builds
- GitHub Actions logs: Repository → Actions → EAS Build
