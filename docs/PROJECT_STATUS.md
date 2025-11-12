# Fellowus – Proje Durum Günlüğü (APK/AAB Yol Haritası Entegre)

**Lejand:** ✅ tamam | ⚠️ işlemde | ❌ başarısız | ◻️ yapılacak | 🆕 yeni eklendi

> Son odağımız “Uygulama Entegrasyonları (9.x)”. **ŞU AN BURADAYIZ:** 9.1  
> **APK/AAB stratejisi:** Expo (Managed Workflow) — *tercih edilen yol*. Alternatifler: Capacitor (WebView) / TWA (PWA shell).

---

1. ⚠️ **Keşif & Planlama**

   1.1 ✅ İş hedefleri ve KPI’lar  
   1.2 ◻️ Paydaş görüşmeleri / kapsam onayı  
   1.3 ✅ Yol haritası ve sürümleme stratejisi (MVP → v1.0)  
   1.4 ✅ Öncelik sırası onayı (9.1 → 9.2 → 9.3) 🆕

2. ✅ **Teknik Hazırlık**

   2.1 ✅ Depo / betikler / README  
   2.2 ✅ TypeScript yapılandırması  
   2.3 ✅ PostCSS + Tailwind  
   2.4 ✅ Design tokens → CSS değişkenleri

3. ✅ **Tasarım Sistemi**

   3.1 ✅ Tema mimarisi (Light/Dark)  
   3.2 ✅ Renk/tipografi/radius/elevation token’ları  
   3.3 ✅ Bileşen kuralları (a11y dâhil)  
   3.4 ✅ Tailwind entegrasyonu

4. ✅ **Bileşen Kütüphanesi**

   4.1 ✅ Çekirdek bileşenler  
   4.2 ✅ Layout/Primitifler  
   4.3 ✅ Sayfa primitifleri  
   4.4 ✅ Homepage kompoziti

5. ✅ **Dökümantasyon & Oyun Alanı**

   5.1 ✅ Storybook  
   5.2 ✅ Hikâyeler & kontroller  
   5.3 ✅ Test Runner (CI modu)  
   5.4 ✅ Token–Storybook senkronu

6. ✅ **Görsel Regresyon (VR)**

   6.1 ✅ Playwright VR konfig  
   6.2 ✅ Snapshot üretimi (`vr:update`)  
   6.3 ✅ Karşılaştırma akışı (`vr`)  
   6.4 ✅ CI uyumlu betikler

7. ✅ **Açık API & Sözleşmeler**

   7.1 ✅ OpenAPI doğrulama/bundle  
   7.2 ✅ Tip üretimi  
   7.3 ✅ Event Contracts v1  
   7.4 ✅ Örnek veriler + doğrulama  
   7.5 ◻️ Backend API tasarımı (endpoint’ler, akışlar) 🆕

8. ✅ **İstemci Katmanı**

   8.1 ✅ Tipli API istemcisi  
   8.2 ✅ Mock’lu Storybook demoları  
   8.3 ✅ Hata yakalama / auth kancası

9. ⚠️ **Uygulama Entegrasyonları** — **ŞU AN BURADAYIZ**

   9.1 ⚠️ Sayfa akışlarını bağlama (Homepage → diğerleri) — **öncelik 1**  
      - Hero “How It Works” CTA’sı gerçek ankora bağlandı, indirme URL’i `safeOpen(DOWNLOAD_URL)` ile merkezileştirildi 🆕  
      - AppPhoneMock mobil maketi Storybook’a eklendi, Tailwind glob/safelist yapılandırması güncellendi 🆕

   9.2 ✅ Erişilebilirlik turu (odak, ARIA, kontrast) — **öncelik 2**  
      - Focus-ring utility, `prefers-reduced-motion` desteği ve kontrast token testleri eklendi 🆕

   9.3 ⚠️ Performans ince ayarı (kritik CSS, lazy, prefetch) — **öncelik 3**  
      - Font preconnect ipuçları ve lazy media ayarları eklendi (erken optimizasyon) 🆕

   9.4 ✅ Yol seçimi: **Expo Managed Workflow** (alternatifler aşağıda) 🆕  
   9.5 ⚠️ Mobil iskelet: `apps/mobile` altında Expo projesi başlatıldı, NativeWind + tab/stack navigasyon temeli kuruldu 🆕  
   9.6 ◻️ Tasarım token köprüsü: **NativeWind** ile Tailwind/design tokens eşlemesi; `tokens.css` → RN değişkenleri 🆕  
   9.7 ◻️ Navigasyon: React Navigation (stack/tab) ve **App Shell** eşlemesi 🆕  
   9.8 ◻️ Bildirimler: Expo Notifications + Firebase (FCM) konfig (Android) 🆕  
   9.9 ◻️ Ortam/kimlik: `app.json`/`eas.json` paket adı (`com.fellowus.app`), versiyonlama ve ikon/splash 🆕  
   9.10 ◻️ **Debug cihaz testi**: Expo Dev Client ile cihazda akışların doğrulanması 🆕  
   9.11 ◻️ **Release imzalama**: Android keystore üretimi, `gradle.properties`/EAS secrets tanımı 🆕  
   9.12 ◻️ **Artifact üretimi**: EAS Build ile **AAB** (Play Store için) + opsiyonel **APK** (sideload/test) 🆕  
   9.13 ◻️ Mağaza hazırlıkları: paket adı rezervi, sürüm kodu politikası, gizlilik bağlantıları 🆕

   **Alternatif Yol: Capacitor (Web tabanlı kabuk)**  
   C.1 ◻️ `web` build → `npx cap add android` → Android Studio ile release AAB/APK 🆕  
   C.2 ◻️ Native plugin ihtiyacı analizi (push, paylaşım, dosya, vs.) 🆕

   **Alternatif Yol: TWA (PWA shell)**  
   TWA.1 ◻️ PWA kriterleri (manifest, service worker) ve assetlinks.json 🆕  
   TWA.2 ◻️ Android Studio TWA projesi ve AAB üretimi 🆕

   **iOS Yol Haritası (Expo – aynı kod tabanı)**  
   iOS.1 ◻️ **Bundle ID**: `com.fellowus.app` ve **App ID** (Apple Developer) 🆕  
   iOS.2 ◻️ **EAS iOS profilleri**: `eas.json` içinde `preview-ios` ve `production-ios` 🆕  
   iOS.3 ◻️ **Signing**: Apple Developer Team ID, App Store Connect API Key (Issuer/Key ID, p8) 🆕  
   iOS.4 ◻️ **Icons/Splash**: iOS asset katalogu ve safe area testleri 🆕  
   iOS.5 ◻️ **Push Bildirimleri**: APNs (Expo Push) etkinleştirme; `aps-environment` ve Push Entitlement 🆕  
   iOS.6 ◻️ **Capabilities**: Associated Domains (ileride Universal Links), Background Modes (notifications) 🆕  
   iOS.7 ◻️ **Cihaz testi**: Expo Dev Client ile gerçek cihazda smoke 🆕  
   iOS.8 ◻️ **Artifact**: EAS Build ile **.ipa** ve **TestFlight** dağıtımı 🆕  
   iOS.9 ◻️ **App Store Connect**: Internal Testing grupları, gizlilik linkleri, App Privacy 🆕

10. ✅ **Yerelleştirme (i18n)**

   10.1 ✅ Tarama (`i18n:scan`)  
   10.2 ✅ Tutarlılık kontrolü (`i18n:check`)  
   10.3 ✅ v1 kapsamı: yalnızca İngilizce 🆕  
   10.4 ◻️ Sonraki diller: TR, RU, AR + EU/AS 🆕  
   10.5 ◻️ Profesyonel çeviri entegrasyonu (uygulama tamamlandıktan sonra) 🆕

11. ◻️ **E2E & Entegrasyon Testleri**

   11.0 ✅ Kritik 5 kullanıcı yolu tanımlandı 🆕  
   11.1 ⚠️ Akış bazlı E2E _(Homepage hero smoke testi hazır)_  
   11.2 ◻️ Hata senaryoları (ağ kesintisi, 4xx/5xx)  
   11.3 ⚠️ Duman testi matrisi _(hash navigasyonu, download CTA ve 404 doğrulamaları Playwright ile kapsandı) 🆕_  
   11.4 ◻️ **Mobil E2E (Detox/Expo)**: smoke + temel akışlar (login-free discovery) 🆕  
   11.5 ◻️ **Cihaz matrisi**: minSdk ve popüler cihazlarda smoke çalıştırma 🆕

12. ✅ **Güvenlik & Uyum**

   12.1 ✅ Bağımlılık taraması (CI’da otomatik)  
      - Link & içerik sağlık taraması `lychee` ile PR’larda raporlanıyor 🆕  
      - OSV-Scanner SARIF yüklemeleri ve `npm audit` raporlaması devrede 🆕  
   12.2 ◻️ Güvenli başlıklar, CORS, rate limiting  
   12.3 ◻️ PII redaksiyon/doğrulama  
   12.4 ◻️ **Keystore/secrets yönetimi**: `.keystore` kasası, `EAS_SECRET_…` ve erişim ilkeleri 🆕  
   12.5 ◻️ **Secret scanning policy** (pre-commit + repo ayarları) 🆕

13. ✅ **CI/CD & Ortamlar**

   13.1 ✅ CI pipeline (lint → typecheck → unit → VR → E2E) _(health:all PR gating + release notları otomasyonu)_  
   13.2 ✅ Preview ortamları (PR başına) 🆕  
   13.3 ✅ Prod release otomasyonu (tag → deploy) 🆕  
      - `pnpm release:tag` yardımcı komutu ile tek adımda tag + Pages tetikleme 🆕  
   13.4 ✅ PR CI Summary yorumu (preview + LHCI + link check + test sinyali)  
   13.5 ⚠️ **EAS Build entegrasyonu (Android)**: `main` ve `tag v*` için AAB build job’ı (workflow taslağı hazır, secrets bekliyor) 🆕  
   13.6 ⚠️ **EAS Build entegrasyonu (iOS)**: `main` ve `tag v*` için iOS `--platform ios` build job’ı (workflow taslağı hazır, secrets bekliyor) 🆕  
   13.7 ◻️ **Artifact yönetimi**: AAB/APK/IPA saklama, checksum, indirme linkleri 🆕  
   13.8 ◻️ **Submit otomasyonu**: `eas submit` ile Play Console **internal track** ve App Store Connect **TestFlight** 🆕  
   13.9 ◻️ **Secrets seti**: `EXPO_TOKEN`, `ANDROID_KEYSTORE_BASE64`, `KEY_ALIAS`, `KEY_PASSWORD`, `ASC_API_KEY_ID`, `ASC_ISSUER_ID`, `ASC_API_KEY_P8` 🆕

14. ◻️ **Gözlemlenebilirlik**

   14.1 ◻️ Log/metric/trace (RUM + backend)  
   14.2 ◻️ Hata raporlama (Sentry)  
   14.3 ◻️ Performans bütçeleri & alarmlar

15. ⚠️ **İçerik & Marka / SEO**

   15.1 ✅ Homepage içerik entegrasyonu (hero, alt metin, CTA)  
   15.2 ✅ Marka dili: samimi, güvenli, özgürlük/mahremiyet odaklı 🆕  
   15.3 ✅ CTA etiketleri: “Get Started” / “How It Works” / “Download App” 🆕  
   15.4 ✅ Meta/OG şemaları, sitemap/robots

16. ◻️ **Lansman Hazırlığı**

   16.1 ◻️ Son a11y denetimi  
   16.2 ◻️ QA turu & kapanış  
   16.3 ◻️ Rollout planı (kademeli/koyu)  
   16.4 ◻️ **Play Console “Internal testing”**: kapalı test listesi ve dağıtım 🆕  
   16.5 ◻️ **TestFlight (iOS)**: Internal Testers grubu ve build onayı 🆕  
   16.6 ◻️ **Open beta** (Android) ve **Public TestFlight** (opsiyonel) 🆕

17. ◻️ **Lansman & Sonrası**

   17.1 ◻️ v1.0 yayını  
   17.2 ◻️ Canlı izleme & hızlı düzeltmeler  
   17.3 ◻️ Yol haritası güncellemesi

18. ◻️ **Araç Entegrasyonları & Hesaplar** 🆕

   18.1 ◻️ Analytics hesabı & token  
   18.2 ◻️ Sentry hesabı & DSN  
   18.3 ◻️ CI servis hesabı/anahtarları  
   18.4 ◻️ **Google Play Console**: geliştirici hesabı + uygulama kaydı 🆕  
   18.5 ◻️ **Firebase (FCM)**: proje, Android app, `google-services.json` 🆕  
   18.6 ◻️ **Expo/EXPO_TOKEN**: hizmet hesabı ve erişimler 🆕  
   18.7 ◻️ **App Store Connect**: organizasyon, Teams, API Key oluşturma 🆕

19. ✅ **Tasarım Referansları** 🆕

   19.1 ✅ Referans: Waze’in temiz ve kullanıcı dostu yaklaşımı

20. ⚠️ **Alan Adı & DNS (fellowus.com)** — **Sağlayıcı: Turhost** 🆕

   20.1 ⚠️ **DNS temel kurulum (Turhost Panel)**  
      - CNAME `www` → `yasertunc.github.io`  
      - A kayıtları (apex `@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`  
      - Opsiyonel TXT doğrulamaları (Search Console, GitHub Pages, Firebase/Play Console)  
      - TTL: 3600s

   20.2 ◻️ **GitHub Pages ayarı**  
      - Settings → Pages → Custom domain `www.fellowus.com`, **Enforce HTTPS**  
      - `CNAME` dosyası (`www.fellowus.com`) repo köküne  
      - Apex → `www` yönlendirmesi

   20.3 ◻️ **SSL/HSTS** — GitHub otomatik sertifika sonrası HSTS (opsiyonel)  
   20.4 ◻️ **Doğrulamalar** — Search Console, Play Console, Firebase, GitHub Pages  
   20.5 ◻️ **Rotalar** — `/`, `/storybook/`, `/download`, `/privacy`, `/terms`  
   20.6 ◻️ **E‑posta (opsiyonel)** — MX, SPF/DKIM/DMARC  
   20.7 ◻️ **CAA kayıtları** — Let’s Encrypt/Google Trust Services (opsiyonel)  
   20.8 ◻️ **CI değişkenleri** — `DOWNLOAD_URL=https://www.fellowus.com/download`, `SITE_ORIGIN=https://www.fellowus.com`

---

## Milestones (öneri)

* **M0 – Karar & iskelet**: 9.4–9.6 ✅/⚠️  
* **M1 – Cihazda çalışır prototip (Android + iOS)**: 9.7–9.10, iOS.7 ◻️  
* **M2 – İmzalı release artifact**: 9.11–9.12, iOS.8 ◻️  
* **M3 – Kapalı test**: 13.8 (Play internal) + 16.5 (TestFlight) ◻️  
* **M4 – Açık beta**: 16.6 ◻️

---

## Yapılandırma notları (özet)

* **Tek kod tabanı**: Expo Managed → Android (AAB/APK) + iOS (IPA/TestFlight)  
* `apps/mobile` + **NativeWind**: token’ların RN tarafına köprü (renk/radius/spacing/typography)  
* `eas.json`: `preview`/`production` (Android) ve `preview-ios`/`production-ios` (iOS) profilleri  
* CI: `eas build --platform android --profile production` ve `eas build --platform ios --profile production-ios` + artifact upload  
* Secrets: Android keystore Base64 + iOS ASC API Key (Key ID, Issuer ID, p8)  
* Yönlendirmeler: `/download` sayfası platform algılar, Android → AAB/APK veya Play; iOS → TestFlight/App Store

---

## Cursor’a talimatlar (otomasyon adımları)

**Branch:** `feat/mobile-expo-bootstrap`  
**PR etiketi:** `mobile`, `expo`, `ci`

1. **Expo iskeletini ekle**
   ```bash
   mkdir -p apps/mobile && cd apps/mobile
   npx create-expo-app@latest -t expo-template-blank --yes
   ```
2. **Bağımlılıklar**
   ```bash
   cd apps/mobile
   npm i nativewind tailwindcss react-native-svg react-native-safe-area-context @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs expo-notifications
   npx tailwindcss init -p
   ```
3. **NativeWind & tokens köprüsü**
   * `tailwind.config.js` → design tokens referansı (repo `tokens.css` / `tokens_fellowus_v1.json`)  
   * `global.css` / entry → NativeWind kurulumu, Babel `nativewind/babel`
4. **Navigasyon & Shell**
   * `App.js` → Stack + Tab navigasyonu, web App Shell akışına eşle  
   * Hero / How It Works kartları mobilde kullanılabilir
5. **EAS yapılandırması**
   ```bash
   npx expo install expo-doctor
   npx expo install expo-dev-client
   ```
   * Kökte `eas.json`: `preview`, `production`, `preview-ios`, `production-ios` profilleri  
   * `app.json`: `android.package=com.fellowus.app`, `ios.bundleIdentifier=com.fellowus.app`
6. **CI taslağı**
   * `.github/workflows/eas-build.yml` → Android `production` profile (AAB), iOS `production-ios` profile (IPA/TestFlight, opsiyonel)
7. **Secrets ekle**
   * `EXPO_TOKEN`, `ANDROID_KEYSTORE_BASE64`, `KEY_ALIAS`, `KEY_PASSWORD`, `ASC_API_KEY_ID`, `ASC_ISSUER_ID`, `ASC_API_KEY_P8`
8. **/download sayfası**
   * `public/download/index.html` → user-agent ile platform tespiti, yönlendirme + fallback
9. **DNS ve Pages**
   * Repo → Pages: Custom domain `www.fellowus.com`, Enforce HTTPS  
   * Turhost DNS kayıtlarını uygula (CNAME `www`, A apex IP’leri)
10. **Doğrulamalar**
    * Search Console, Play Console, Firebase, iOS App Store Connect (gerekli TXT/CAA kayıtları)

---

## Changelog

- _2025-11-11_: İlk STATUS dosyası oluşturuldu; 7.5, 10.3–10.5, 11.0, 15.1–15.3, 18.x, 19.x eklendi.  
- _2025-11-11_: Keşif dokümanları (Product Brief, PRD, Scope, NFR, Roadmap, Risks) eklendi; 1.1 ve 1.3 tamamlandı.  
- _2025-11-11_: App Shell ve Channel status stubları Storybook altında yayınlandı (9.1 ilerlemesi).  
- _2025-11-11_: Health meta script (`health:all`) ve Acceptance Flow hikâyesi/VR kapsamı eklendi; 9.1 adımı storyboard seviyesinde genişledi.  
- _2025-11-11_: Channel FSM, mock WebSocket/FCM transportları ve Storybook testi eklendi; 9.1 akışı gerçekçi mock altyapısıyla güçlendirildi.  
- _2025-11-11_: PR template, labeler, CODEOWNERS ve health CI gate devreye alındı; Release Drafter ile otomatik sürüm notları başlatıldı (13.1 tamamlandı).  
- _2025-11-11_: Storybook gh-pages dağıtımı doğrulandı; README rozeti ve Pages health checklist’i güncellendi, offline arşiv paylaşıldı.  
- _2025-11-11_: Hero indirme davranışı env tabanlı hale geldi, “How It Works” bölümü/ankoru ve testleri eklendi; Storybook build uyarıları `chunkSizeWarningLimit` + ağır hikâye ignore ile azaltıldı.  
- _2025-11-11_: Link denetimi (`lychee`) ve Lighthouse CI raporları PR artifact’i olarak eklendi; smoke testi matrisi indirme/404/hash akışlarını kapsayacak şekilde genişletildi.  
- _2025-11-11_: Homepage hero EN içerik + CTA’lar teslim edildi, SEO yardımcıları (meta helper, robots, sitemap) eklendi, hero smoke testi ve VR snapshotları güncellendi (11.1, 15.1, 15.4 ilerledi).  
- _2025-11-12_: PR başına Storybook preview’leri ve OSV güvenlik taraması CI’a eklendi; preview yorumları ve SARIF yüklemeleri etkinleştirildi (13.2, 12.1 tamamlandı). 🆕  
- _2025-11-12_: Focus-ring + reduced-motion a11y paketi ve PR CI Summary yorumu devreye alındı; 9.2 erişilebilirlik turu ve 13.4 iletişim kanalı kapandı.  
- _2025-11-12_: Tag tabanlı prod Storybook yayınlaması eklendi; README’ye kalıcı “Prod Storybook” bağlantısı yerleştirildi (13.3 tamamlandı). 🆕  
- _2025-11-12_: `pnpm release:tag` akışı, font preconnect ipuçları ve lazy media optimizasyonları hazırlandı; 9.3 performans turlarına başlangıç yapıldı. 🆕  
- _2025-11-12_: AppPhoneMock hikâyesi ve tasarım token safelistleri güncellendi; mobil navigasyon akışları Storybook üzerinden doğrulanabilir hâle geldi.  
- _2025-11-12_: Expo mobil iskeleti (`apps/mobile`), NativeWind token köprüsü, EAS yapılandırması ve `/download` yönlendirme sayfası eklendi; Android/iOS yol haritası detaylandırıldı. 🆕  
- _2025-11-12_: DNS ve custom domain planı (Turhost + GitHub Pages) dokümante edildi; mobil APK/AAB yol haritası ile entegrasyon planı güncellendi. 🆕

