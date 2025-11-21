# 📤 Web Hosting'e Yükleme Rehberi

## 📁 Yüklenecek Klasör: `public/`

**Web hosting'e yüklenecek klasör:** `public/` klasörünün **içindeki tüm dosyalar**

```
public/
├── index.html                    ← Ana sayfa (MUTLAKA YÜKLENMELİ)
├── robots.txt                    ← SEO için
├── sitemap.xml                   ← SEO için
├── CNAME                         ← Domain ayarı (GitHub Pages için)
├── .htaccess                     ← Apache hosting için (HTTPS yönlendirme)
├── _headers                      ← Netlify için (Security headers)
│
├── assets/                       ← Tüm görseller ve logolar
│   ├── screenshots/              ← Uygulama ekran görüntüleri
│   │   ├── screenshot-1-map.jpg
│   │   ├── screenshot-2-places.jpg
│   │   ├── screenshot-3-profile.jpg
│   │   ├── screenshot-4-search.jpg
│   │   ├── screenshot-5-filters.jpg
│   │   ├── screenshot-6-food.jpg
│   │   ├── screenshot-7-social.jpg
│   │   └── screenshot-8-vip.jpg
│   └── stores/                   ← Store logoları
│       ├── google-play-logo.svg
│       └── app-store-logo.svg
│
├── brand/                        ← Marka logoları
│   ├── fellowus-logo-amber.png
│   └── fellowus-logo-blue.png
│
├── download/                     ← İndirme sayfası
│   └── index.html
│
├── privacy/                      ← Gizlilik politikası
│   └── index.html
│
├── terms/                        ← Kullanım koşulları
│   └── index.html
│
└── public/                       ← Video klasörü
    └── videos/
        └── fellowus_demo.mp4     ← Tanıtım videosu
```

## 🚀 Yükleme Yöntemleri

### Yöntem 1: FTP ile Yükleme (Geleneksel Hosting)

1. **FTP İstemcisi Kullanın** (FileZilla, WinSCP, Cyberduck)
2. **Bağlantı Bilgileri:**
   - Host: `ftp.fellowus.com` veya hosting sağlayıcınızın FTP adresi
   - Kullanıcı adı: Hosting panelinden aldığınız FTP kullanıcı adı
   - Şifre: FTP şifresi
   - Port: 21 (FTP) veya 22 (SFTP)

3. **Yükleme Adımları:**
   ```
   - FTP istemcisinde bağlanın
   - public/ klasörünün İÇİNDEKİ tüm dosyaları seçin
   - public/ klasörünü DEĞİL, içindeki dosyaları yükleyin
   - Genellikle public_html/ veya www/ klasörüne yüklenir
   ```

### Yöntem 2: Netlify (Önerilen - Ücretsiz)

1. [Netlify.com](https://www.netlify.com) hesabı oluşturun
2. "Add new site" → "Deploy manually"
3. `public/` klasörünün **içindeki tüm dosyaları** sürükle-bırak
4. Domain ayarlarından `www.fellowus.com` domain'ini bağlayın
5. SSL otomatik olarak aktif olur ✅

**Önemli:** `public/` klasörünü değil, içindeki dosyaları yükleyin!

### Yöntem 3: Vercel (Önerilen - Ücretsiz)

1. [Vercel.com](https://vercel.com) hesabı oluşturun
2. "Import Project" → "Deploy"
3. Root directory: `public` olarak ayarlayın
4. Domain ayarlarından `www.fellowus.com` ekleyin
5. SSL otomatik olarak aktif olur ✅

### Yöntem 4: GitHub Pages

1. Repository'yi GitHub'a push edin
2. Settings → Pages → Source: `public` klasörü
3. Custom domain: `www.fellowus.com` ekleyin
4. SSL otomatik olarak aktif olur ✅

### Yöntem 5: cPanel File Manager

1. cPanel'e giriş yapın
2. "File Manager" açın
3. `public_html/` klasörüne gidin
4. `public/` klasöründeki **tüm dosyaları** yükleyin
5. `.htaccess` dosyasının yüklendiğinden emin olun

## ⚠️ ÖNEMLİ NOTLAR

### ✅ Yapılması Gerekenler

1. **`public/` klasörünün İÇİNDEKİ dosyaları yükleyin**
   - ❌ YANLIŞ: `public/` klasörünü yüklemek
   - ✅ DOĞRU: `public/` içindeki dosyaları yüklemek

2. **Klasör yapısını koruyun**
   - `assets/`, `download/`, `privacy/`, `terms/` klasörlerini koruyun
   - Dosya yolları göreceli olduğu için klasör yapısı önemli

3. **Tüm dosyaları yükleyin**
   - HTML dosyaları
   - CSS (index.html içinde)
   - JavaScript (index.html içinde)
   - Görseller (assets/)
   - Video (public/videos/)

### ❌ Yapılmaması Gerekenler

1. **`public/` klasörünü yüklemeyin**
   - Hosting'e `public/index.html` değil, `index.html` yüklenmeli
   - Kök dizinde `index.html` olmalı

2. **Dosya yollarını değiştirmeyin**
   - `assets/stores/google-play-logo.svg` yolu korunmalı
   - `assets/screenshots/` yolu korunmalı

## 📋 Yükleme Sonrası Kontrol Listesi

### ✅ Kontrol Edilecekler

- [ ] Ana sayfa açılıyor mu? (`https://www.fellowus.com/`)
- [ ] HTTPS aktif mi? (🔒 simgesi görünüyor mu?)
- [ ] Görseller yükleniyor mu? (Store logoları, ekran görüntüleri)
- [ ] Video oynatılıyor mu? (`public/videos/fellowus_demo.mp4`)
- [ ] Alt sayfalar çalışıyor mu?
  - [ ] `/download` sayfası
  - [ ] `/privacy` sayfası
  - [ ] `/terms` sayfası
- [ ] Store linkleri çalışıyor mu?
- [ ] Mobil görünüm düzgün mü?
- [ ] SEO dosyaları erişilebilir mi?
  - [ ] `robots.txt`
  - [ ] `sitemap.xml`

## 🔍 Yükleme Sonrası Test

### Tarayıcıda Test

1. **Ana Sayfa:** `https://www.fellowus.com/`
2. **Alt Sayfalar:**
   - `https://www.fellowus.com/download`
   - `https://www.fellowus.com/privacy`
   - `https://www.fellowus.com/terms`

### SSL Test

1. **SSL Labs:** https://www.ssllabs.com/ssltest/
2. **Security Headers:** https://securityheaders.com/

### Mobil Test

- Chrome DevTools → Mobile Device Mode
- Gerçek cihazlarda test edin

## 🆘 Sorun Giderme

### Görseller Görünmüyor

- `assets/` klasörünün yüklendiğinden emin olun
- Dosya yollarının doğru olduğunu kontrol edin
- Tarayıcı konsolunda (F12) hata mesajlarını kontrol edin

### HTTPS Çalışmıyor

- Hosting sağlayıcınızdan SSL sertifikası kurulumunu kontrol edin
- `.htaccess` dosyasının yüklendiğinden emin olun (Apache hosting)
- `_headers` dosyasının yüklendiğinden emin olun (Netlify)

### Video Oynatılmıyor

- `public/videos/fellowus_demo.mp4` dosyasının yüklendiğinden emin olun
- Video dosya boyutunu kontrol edin (çok büyükse yavaş yüklenebilir)
- Tarayıcı konsolunda hata mesajlarını kontrol edin

## 📞 Destek

Sorun yaşarsanız:

- Hosting sağlayıcınızın destek ekibiyle iletişime geçin
- Tarayıcı konsolundaki hata mesajlarını kontrol edin
- `public/HTTPS_SSL_GUIDE.md` dosyasına bakın

---

**Özet:** `public/` klasörünün **içindeki tüm dosyaları** web hosting'e yükleyin. Klasör yapısını koruyun ve kök dizinde `index.html` olmasına dikkat edin.
