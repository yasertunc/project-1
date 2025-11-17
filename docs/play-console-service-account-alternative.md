# Google Play Console Servis Hesabı - Alternatif Yöntem

Eğer Play Console'da "API access" sayfasını bulamıyorsan, bu alternatif yöntemi kullanabilirsin.

## Yöntem: Google Cloud Console'dan Direkt Oluşturma

### Adım 1: Google Cloud Console'da Proje Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) → Giriş yap
2. Üst kısımdaki proje seçiciye tıkla → **"New Project"** (Yeni Proje)
3. Proje adı: `Fellowus Play Console` (veya istediğin isim)
4. **"Create"** butonuna tıkla
5. Proje oluşturulduktan sonra, projeyi seçili hale getir

### Adım 2: Google Play Android Developer API'yi Etkinleştirme

1. Google Cloud Console'da sol menüden **"APIs & Services"** → **"Library"** seç
2. Arama kutusuna `Google Play Android Developer API` yaz
3. **"Google Play Android Developer API"** seçeneğine tıkla
4. **"Enable"** (Etkinleştir) butonuna tıkla

### Adım 3: Servis Hesabı Oluşturma

1. Sol menüden **"IAM & Admin"** → **"Service Accounts"** seç
2. **"Create Service Account"** butonuna tıkla
3. Formu doldur:
   - **Service account name**: `expo-eas-submit`
   - **Service account ID**: Otomatik oluşturulur
   - **Description**: `EAS Submit için Play Console API erişimi`
4. **"Create and Continue"** tıkla
5. **"Grant this service account access to project"** adımında:
   - Rol eklemeye gerek yok (Play Console tarafında yetkilendirme yapacağız)
   - **"Continue"** → **"Done"** tıkla

### Adım 4: JSON Anahtarını İndirme

1. Oluşturduğun servis hesabına tıkla (liste görünüyorsa)
2. **"Keys"** sekmesine git
3. **"Add Key"** → **"Create new key"** seç
4. **"Key type"**: **JSON** seç
5. **"Create"** butonuna tıkla
6. JSON dosyası otomatik olarak indirilecek (örn: `expo-eas-submit-xxxxx.json`)
7. **Bu dosyayı güvenli bir yerde sakla!**

### Adım 5: Play Console'da Yetkilendirme

Şimdi Play Console'da servis hesabına izin vermemiz gerekiyor:

1. [Google Play Console](https://play.google.com/console) → Giriş yap
2. Sol menüden **"Kullanıcılar ve izinler"** (Users and permissions) seç
3. **"Yeni kullanıcılar davet et"** (Invite new users) butonuna tıkla
4. **"E-posta adresi"** alanına: İndirdiğin JSON dosyasını aç ve `client_email` değerini kopyala (örn: `expo-eas-submit@xxxxx.iam.gserviceaccount.com`)
5. **"E-posta adresini yapıştır"** → **"Ekle"** tıkla
6. Açılan pencerede:
   - **"Uygulama izinleri"** (App permissions): `Fellowus Mobile` uygulamasını seç
   - **"Hesap izinleri"** (Account permissions):
     - ✅ **"View app information and download bulk reports"** (opsiyonel)
     - ✅ **"Manage production releases"** (production track için)
     - ✅ **"Manage testing track releases"** (internal/alpha/beta track'leri için)
   - **"Kaydet"** (Save) tıkla

### Adım 6: JSON Dosyasını Projeye Yerleştirme

1. İndirdiğin JSON dosyasını `apps/mobile/.eas/android-service-account.json` konumuna kopyala
   - `.eas` klasörü yoksa oluştur
   - Dosya adını `android-service-account.json` olarak değiştir
2. Dosya zaten `.gitignore`'da, güvende

### Adım 7: Test Etme

Artık `eas submit` komutunu çalıştırabilirsin:

```bash
cd apps/mobile
npx eas submit --platform android --latest --non-interactive --wait
```

## Sorun Giderme

- **"Service account key not found"**: JSON dosyasının yolu ve adının `eas.json`'daki `serviceAccountKeyPath` ile eşleştiğinden emin ol
- **"Permission denied"**: Play Console'da servis hesabına gerekli izinlerin verildiğini kontrol et
- **"App not found"**: Play Console'da uygulamanın (`com.fellowus.app`) oluşturulduğundan emin ol
