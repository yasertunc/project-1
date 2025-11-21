# APK Build Rehberi

## Mevcut APK

Zaten bir APK dosyası mevcut:
- **Konum**: `apps/mobile/apps/mobile/artifacts/FellowusMobile-production.apk`
- **Boyut**: ~78 MB
- **Tarih**: 17 Kasım 2025

## Yeni APK Build Etme

### Seçenek 1: Preview APK (Test için)

```bash
cd apps/mobile
npx eas-cli build --platform android --profile preview
```

Bu komut:
- APK formatında build oluşturur
- Internal distribution için uygundur
- Test ve geliştirme için idealdir

### Seçenek 2: Production APK

```bash
cd apps/mobile
npx eas-cli build --platform android --profile production-apk
```

Bu komut:
- Production APK oluşturur
- Version code otomatik artar
- Release için uygundur

### Seçenek 3: Development APK (Dev Client)

```bash
cd apps/mobile
npx eas-cli build --platform android --profile development
```

Bu komut:
- Development client APK oluşturur
- Expo Dev Tools ile çalışır
- Hot reload destekler

## APK'yı İndirme

Build tamamlandıktan sonra:

1. **EAS Dashboard'dan**: https://expo.dev/accounts/[your-account]/projects/fellowus-mobile/builds
2. **Komut satırından**:
   ```bash
   cd apps/mobile
   npx eas-cli build:list --platform android --limit 1
   npx eas-cli build:download [BUILD_ID]
   ```

## APK'yı Cihaza Yükleme

### Android Cihazda

1. APK dosyasını cihaza kopyalayın (USB, email, cloud storage)
2. Cihazda "Bilinmeyen kaynaklardan uygulama yükleme" iznini açın:
   - Ayarlar → Güvenlik → Bilinmeyen kaynaklar
3. APK dosyasına dokunun ve yükleme işlemini başlatın

### ADB ile (Geliştirici için)

```bash
adb install apps/mobile/apps/mobile/artifacts/FellowusMobile-production.apk
```

## Hızlı Build (Local - Önerilmez)

Eğer EAS Build kullanmak istemiyorsanız (sadece geliştirme için):

```bash
cd apps/mobile
npm run android
```

Bu komut local build yapar ama production APK için EAS Build kullanılmalıdır.

## Notlar

- **EAS Build** için Expo hesabı ve `EXPO_TOKEN` gerekir
- Production build'ler için Android keystore yapılandırılmış olmalı
- Build süresi genellikle 10-20 dakika arasındadır
- Build'ler Expo'nun cloud servisinde yapılır

## Sorun Giderme

### EAS CLI yüklü değilse:
```bash
npm install -g eas-cli
```

### Login olmadıysanız:
```bash
npx eas-cli login
```

### Build durumunu kontrol etme:
```bash
cd apps/mobile
npx eas-cli build:list --platform android
```

