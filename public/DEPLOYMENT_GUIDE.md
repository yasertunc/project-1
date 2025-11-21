# FellowUs Web Sayfası - Hosting Rehberi

Bu rehber, FellowUs web sayfasını web hosting'e yayınlamak için gerekli adımları içerir.

## 📋 Hosting Öncesi Kontrol Listesi

### ✅ Gerekli Dosyalar

- [x] `index.html` - Ana sayfa
- [x] `robots.txt` - Arama motoru yönlendirmesi
- [x] `sitemap.xml` - Site haritası
- [x] `logo.svg` - Logo dosyası
- [x] `videos/fellowus_demo.mp4` - Video dosyası
- [ ] `og-image.jpg` - Open Graph görseli (1200x630px) - **EKSİK**

### 📁 Dosya Yapısı

```
public/
├── index.html          (Ana sayfa)
├── robots.txt          (SEO için)
├── sitemap.xml         (SEO için)
├── logo.svg            (Logo)
├── og-image.jpg        (Sosyal medya görseli - OLUŞTURULMALI)
└── videos/
    └── fellowus_demo.mp4
```

## 🚀 Hosting Seçenekleri

### 1. **Netlify** (Önerilen - Ücretsiz)

**Avantajlar:**

- Ücretsiz SSL sertifikası
- Otomatik HTTPS
- Kolay deployment
- CDN desteği
- Ücretsiz plan yeterli

**Adımlar:**

1. [Netlify.com](https://www.netlify.com) hesabı oluştur
2. "Add new site" > "Deploy manually"
3. `public` klasörünün içindeki tüm dosyaları sürükle-bırak
4. Domain ayarlarından `www.fellowus.com` domain'ini bağla

### 2. **Vercel** (Önerilen - Ücretsiz)

**Avantajlar:**

- Ücretsiz SSL
- Hızlı CDN
- Kolay deployment
- GitHub entegrasyonu

**Adımlar:**

1. [Vercel.com](https://vercel.com) hesabı oluştur
2. "New Project" > "Upload" seçeneğini kullan
3. `public` klasörünü yükle
4. Domain ayarlarından `www.fellowus.com` domain'ini bağla

### 3. **GitHub Pages** (Ücretsiz)

**Avantajlar:**

- Tamamen ücretsiz
- GitHub ile entegre
- Kolay güncelleme

**Adımlar:**

1. GitHub'da yeni bir repository oluştur
2. `public` klasöründeki dosyaları repository'ye yükle
3. Repository Settings > Pages
4. Source: "Deploy from a branch" > "main" > "/public" seç
5. Custom domain: `www.fellowus.com` ekle

### 4. **Cloudflare Pages** (Ücretsiz)

**Avantajlar:**

- Ücretsiz SSL
- Hızlı CDN
- Kolay deployment

**Adımlar:**

1. [Cloudflare Pages](https://pages.cloudflare.com) hesabı oluştur
2. "Create a project" > "Upload assets"
3. `public` klasörünü yükle
4. Custom domain: `www.fellowus.com` ekle

### 5. **Geleneksel Web Hosting** (cPanel, FTP vb.)

**Adımlar:**

1. Hosting sağlayıcınızdan FTP bilgilerini alın
2. FTP client (FileZilla, WinSCP) kullanarak bağlanın
3. `public_html` veya `www` klasörüne `public` klasöründeki tüm dosyaları yükleyin
4. Domain ayarlarından SSL sertifikası aktif edin

## 📝 Önemli Notlar

### 1. Video Dosyası Yolu

Video dosyası şu anda `public/public/videos/fellowus_demo.mp4` konumunda.
Hosting'e yüklemeden önce `public/videos/` klasörüne taşınmalı veya HTML'deki yol düzeltilmeli.

### 2. Open Graph Görseli

`og-image.jpg` dosyası oluşturulmalı:

- Boyut: 1200x630px
- Format: JPG veya PNG
- İçerik: FellowUs logosu ve sloganı içeren görsel
- Konum: `public/og-image.jpg`

### 3. Domain Ayarları

- `www.fellowus.com` domain'i için DNS ayarları yapılmalı
- A Record veya CNAME kaydı hosting sağlayıcısına göre ayarlanmalı

### 4. SSL Sertifikası

- Modern hosting sağlayıcıları otomatik SSL sağlar
- Let's Encrypt ücretsiz SSL sertifikası kullanılabilir

### 5. Performans Optimizasyonu

- Video dosyası büyükse (2MB+), CDN kullanılmalı
- Görseller optimize edilmeli
- Gzip compression aktif edilmeli

## 🔧 Hosting Sonrası Kontroller

1. ✅ Sayfa yükleniyor mu?
2. ✅ Video oynatılıyor mu?
3. ✅ Tüm diller çalışıyor mu?
4. ✅ Mobil görünüm doğru mu?
5. ✅ SSL aktif mi? (https://)
6. ✅ robots.txt erişilebilir mi?
7. ✅ sitemap.xml erişilebilir mi?
8. ✅ Google Search Console'a kayıt yapıldı mı?

## 📊 SEO Kontrolleri

1. Google Search Console'a site ekle
2. Sitemap'i Google'a gönder: `https://www.fellowus.com/sitemap.xml`
3. Google Analytics ekle (isteğe bağlı)
4. PageSpeed Insights ile performans testi yap

## 🆘 Sorun Giderme

### Video Oynatılmıyor

- Video dosyasının yolu doğru mu kontrol et
- Video formatı (MP4) destekleniyor mu kontrol et
- Dosya boyutu çok büyükse optimize et

### Sayfa Yüklenmiyor

- Domain DNS ayarlarını kontrol et
- Dosya yollarını kontrol et (büyük/küçük harf duyarlı)
- `.htaccess` dosyası gerekli mi kontrol et

### SSL Çalışmıyor

- Hosting sağlayıcısından SSL aktif et
- Let's Encrypt sertifikası kur
- HTTPS yönlendirmesi yapılandır

## 📞 Destek

Sorun yaşarsanız:

1. Hosting sağlayıcısının dokümantasyonunu kontrol edin
2. Browser console'da hataları kontrol edin
3. Network tab'ında yüklenmeyen dosyaları kontrol edin
