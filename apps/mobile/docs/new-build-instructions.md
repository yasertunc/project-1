# Yeni APK Build Oluşturma Talimatları

## ⚠️ ÖNEMLİ: Eski APK Hatalıydı

Eski APK dosyası yanlış projeden indirildiği için hatalıydı ve temizlendi. Şimdi yeni bir build yapmanız gerekiyor.

## Yöntem 1: GitHub Actions ile Build (Önerilen)

### Adımlar:

1. **GitHub Repository'ye gidin:**
   - Repository sayfasına gidin
   - "Actions" sekmesine tıklayın

2. **Workflow'u tetikleyin:**
   - Sol menüden "EAS Build" workflow'unu seçin
   - Sağ üstte "Run workflow" butonuna tıklayın
   - "Use workflow from" dropdown'dan branch seçin (genellikle `main`)
   - **ÖNEMLİ**: "Which workflow to run?" altında **"android-apk"** job'unu seçin
   - "Run workflow" butonuna tıklayın

3. **Build'i takip edin:**
   - Workflow run sayfasında build ilerlemesini izleyin
   - "Verify APK build belongs to project" step'i projeyi doğrulayacak
   - Build başarılı olursa APK indirilecek

4. **APK'yı indirin:**
   - Workflow tamamlandıktan sonra
   - "android-apk" job'una gidin
   - "Upload APK artifact" step'inde APK dosyasını indirin

## Yöntem 2: Yerel EAS CLI ile Build

### Önkoşullar:

```bash
# EAS CLI yüklü olmalı
npm install -g eas-cli

# Expo'ya login olun
eas login
```

### Build Komutu:

```bash
cd apps/mobile

# Proje ID'yi kontrol edin
cat app.config.ts | grep "DEFAULT_PROJECT_ID"
# Beklenen: 694fc69a-a332-4142-9a41-54012868a73b

# APK build oluşturun
eas build --platform android --profile production-apk

# Build ID'yi not edin (output'ta görünecek)
# Örnek: Build ID: abc123def-456-789-012-345678901234

# Build tamamlandıktan sonra (genellikle 10-20 dakika)
# APK'yı indirin
eas build:download --id [BUILD_ID] --path artifacts/
```

## Yöntem 3: Local Build (En Hızlı - Test İçin)

```bash
cd apps/mobile

# Local build (daha hızlı ama production değil)
eas build --platform android --profile production-apk --local
```

Local build için bilgisayarınızda Android SDK ve Java JDK yüklü olmalı.

## Build Doğrulama

Yeni build tamamlandıktan sonra:

### 1. Package Name Kontrolü

```bash
# Android SDK'nın yüklü olması gerekir
aapt dump badging artifacts/*.apk | grep package

# Beklenen çıktı:
# package: name='com.fellowus.app'
```

### 2. İçerik Kontrolü

APK'yı cihazda veya emülatörde açtığınızda:

- ✅ Uygulama adı: "Fellowus Mobile"
- ✅ Package: com.fellowus.app
- ✅ Ana ekranlar: Chats, Discover, Safety, Profile
- ✅ İkon: Altın sarısı "F" logosu (yeni ikon yüklendiğinde)

### 3. Proje ID Doğrulama

Build'in doğru projeden olduğunu doğrulamak için:

```bash
# Build bilgilerini görüntüleyin
eas build:view [BUILD_ID]

# Beklenen:
# - projectId: 694fc69a-a332-4142-9a41-54012868a73b
# - package: com.fellowus.app
# - appIdentifier: com.fellowus.app
```

## Sorun Giderme

### Build Başarısız Oluyor

1. **EAS Token kontrol edin:**

   ```bash
   echo $EXPO_TOKEN
   # Eğer boşsa, GitHub Secrets'tan EXPO_TOKEN'i kontrol edin
   ```

2. **Proje ID kontrol edin:**

   ```bash
   cat apps/mobile/app.config.ts | grep projectId
   # Beklenen: 694fc69a-a332-4142-9a41-54012868a73b
   ```

3. **EAS credentials kontrol edin:**
   ```bash
   eas credentials
   ```

### Build ID Bulunamıyor

GitHub Actions workflow'unda build ID extraction iyileştirildi. Eğer hala sorun varsa:

- Workflow log'larını kontrol edin
- Build output'unda build URL'ini arayın
- Manuel olarak `eas build:list` ile build ID'yi bulun

### Yanlış Proje Build'i

Workflow artık build'i otomatik olarak doğruluyor:

- Proje ID kontrolü yapılıyor
- Package name kontrolü yapılıyor
- Yanlış proje build'i otomatik olarak reddediliyor

## Yeni Build Özellikleri

✅ **Proje doğrulama**: Build öncesi proje ID kontrolü  
✅ **Build ID extraction**: Gelişmiş build ID çıkarımı  
✅ **Otomatik doğrulama**: Build sonrası proje ve package kontrolü  
✅ **Package name kontrolü**: com.fellowus.app kontrolü  
✅ **Hata önleme**: Yanlış build otomatik reddediliyor

## Sonraki Adımlar

1. ✅ Yeni build oluşturun (yukarıdaki yöntemlerden biriyle)
2. ✅ APK'yı indirin
3. ✅ Package name'i doğrulayın (`com.fellowus.app`)
4. ✅ Cihazda/emülatörde test edin
5. ✅ İçeriğin doğru olduğunu doğrulayın

## Notlar

- **İlk build**: 10-20 dakika sürebilir
- **Sonraki build'ler**: Daha hızlı olabilir (cache sayesinde)
- **Local build**: Daha hızlı ama production değil
- **Cloud build**: Daha güvenilir, production için önerilen

## Destek

Build ile ilgili sorunlar için:

- EAS Dashboard: https://expo.dev/accounts/yasertunc/projects/fellowus-mobile/builds
- GitHub Actions: Repository → Actions → EAS Build → Son workflow run
