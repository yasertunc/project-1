# Google Play Console Servis Hesabı Kurulumu

Bu rehber, EAS Submit ile Android uygulamasını Play Console'a otomatik göndermek için gerekli servis hesabı kurulumunu adım adım açıklar.

## Adım 1: Play Console'da API Erişimini Açma

1. [Google Play Console](https://play.google.com/console) → Hesabınızla giriş yapın
2. Sol menüden **"Setup"** → **"API access"** seçeneğine gidin
3. Eğer ilk kez açıyorsanız, **"Link a Google Cloud project"** butonuna tıklayın
   - Yeni bir Google Cloud projesi oluşturulacak veya mevcut bir projeyi seçebilirsiniz
   - Proje oluşturulduktan sonra sayfa yenilenecek

## Adım 2: Servis Hesabı Oluşturma

1. **"API access"** sayfasında, **"Service accounts"** bölümüne gidin
2. **"Create service account"** butonuna tıklayın
3. Açılan Google Cloud Console sayfasında:
   - **"Service account name"**: `expo-eas-submit` (veya istediğiniz bir isim)
   - **"Service account ID"**: Otomatik oluşturulur
   - **"Description"**: `EAS Submit için Play Console API erişimi`
   - **"Create and continue"** butonuna tıklayın
4. **"Grant this service account access to project"** adımında:
   - Rol seçmeye gerek yok (Play Console tarafında yetkilendirme yapacağız)
   - **"Continue"** → **"Done"** tıklayın

## Adım 3: JSON Anahtarını İndirme

1. Google Cloud Console'da oluşturduğunuz servis hesabına tıklayın
2. **"Keys"** sekmesine gidin
3. **"Add key"** → **"Create new key"** seçin
4. **"Key type"**: **JSON** seçin
5. **"Create"** butonuna tıklayın
6. JSON dosyası otomatik olarak indirilecek (örn: `expo-eas-submit-xxxxx.json`)
7. **Bu dosyayı güvenli bir yerde saklayın** (repo'ya commit etmeyin!)

## Adım 4: Play Console'da Yetkilendirme

1. Play Console → **"Setup"** → **"API access"** sayfasına geri dönün
2. Oluşturduğunuz servis hesabını bulun (e-posta adresi ile görünecek)
3. Servis hesabının yanındaki **"Grant access"** butonuna tıklayın
4. Açılan pencerede:
   - **"App permissions"**: Uygulamanızı seçin (`com.fellowus.app`)
   - **"Account permissions"**:
     - ✅ **"View app information and download bulk reports"** (opsiyonel, raporlar için)
     - ✅ **"Manage production releases"** (production track'e göndermek için)
     - ✅ **"Manage testing track releases"** (internal/alpha/beta track'lerine göndermek için)
   - **"Save"** butonuna tıklayın

## Adım 5: JSON Dosyasını Projeye Yerleştirme

1. İndirdiğiniz JSON dosyasını `apps/mobile/.eas/android-service-account.json` konumuna kopyalayın
   - `.eas` klasörü yoksa oluşturun
   - Dosya adı tam olarak `android-service-account.json` olmalı (eas.json'daki path ile eşleşmeli)
2. `.gitignore` dosyasına ekleyin (eğer yoksa):
   ```
   .eas/android-service-account.json
   ```

## Adım 6: EAS Submit Komutunu Çalıştırma

Artık `eas submit` komutunu çalıştırabilirsiniz:

```bash
cd apps/mobile
npx eas submit --platform android --latest --non-interactive --wait
```

Komut otomatik olarak `eas.json`'daki `serviceAccountKeyPath` değerini kullanacak.

## Alternatif: EAS Secret Olarak Saklama

JSON dosyasını repo'ya eklemek istemiyorsanız, EAS Secret olarak saklayabilirsiniz:

```bash
npx eas secret:create --scope project --name GOOGLE_SERVICE_ACCOUNT_JSON --type file --value path/to/service-account.json --environment production
```

Sonra `eas.json`'da `serviceAccountKeyPath` yerine environment variable kullanabilirsiniz (EAS Submit bunu otomatik olarak destekler).

## Sorun Giderme

- **"Service account key not found"**: JSON dosyasının yolu ve adının `eas.json`'daki `serviceAccountKeyPath` ile eşleştiğinden emin olun
- **"Permission denied"**: Play Console'da servis hesabına gerekli izinlerin verildiğini kontrol edin
- **"App not found"**: Play Console'da uygulamanın (`com.fellowus.app`) oluşturulduğundan ve servis hesabının bu uygulamaya erişim izni olduğundan emin olun
