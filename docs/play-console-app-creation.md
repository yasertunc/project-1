# Google Play Console - Uygulama Oluşturma Rehberi

## Adım 1: Uygulama Oluşturma

1. Play Console Ana Sayfa'da **"Uygulama oluştur"** butonuna tıkla
2. Açılan formda:
   - **Uygulama adı**: `Fellowus Mobile` (veya istediğin isim)
   - **Varsayılan dil**: `Türkçe (Türkiye)` veya `İngilizce (ABD)`
   - **Uygulama türü**: `Uygulama` (App) seç
   - **Ücretsiz mi, ücretli mi?**: `Ücretsiz` seç
   - **Bildirim onayı**: Gerekli kutucukları işaretle
3. **"Uygulama oluştur"** butonuna tıkla

## Adım 2: Package Name (Paket Adı) Ayarlama

Uygulama oluşturulduktan sonra:

1. Sol menüden **"Ayarlar"** → **"Uygulama kimliği"** (App identity) seçeneğine git
2. **"Package name"** bölümünde:
   - `com.fellowus.app` yaz (bu bizim uygulamamızın package name'i)
   - Eğer değiştirilemiyorsa, uygulamayı silip yeniden oluşturman gerekebilir
   - İlk oluştururken package name'i doğru girmek önemli!

## Adım 3: API Access Sayfasına Erişim

Uygulama oluşturulduktan sonra:

1. Sol menüde **"Setup"** veya **"Kurulum"** menüsü görünecek
2. **"Setup"** → **"API access"** seçeneğine git
3. Artık servis hesabı kurulumuna başlayabilirsin

## Notlar

- Package name (`com.fellowus.app`) bir kez belirlendikten sonra değiştirilemez
- Uygulama oluşturulmadan API access sayfası görünmeyebilir
- İlk uygulama oluştururken Play Console hesap doğrulaması isteyebilir (25$ ödeme gerekebilir)
