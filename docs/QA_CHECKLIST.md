## Fellowus – QA Kontrol Listesi

- [ ] **Lint / Format**: `pnpm lint`, `pnpm format:check`
- [ ] **Tip Kontrolü**: `pnpm typecheck`
- [ ] **Birim Testleri**: `pnpm test`
- [ ] **VR / Görsel Kontrol**: `pnpm vr` (ve gerekliyse `pnpm vr:update`)
- [ ] **Smoke Test**: kritik kullanıcı yolunu manuel veya otomasyonla doğrula
- [ ] **Erişilebilirlik**: focus halkaları, `aria-` etiketleri, kontrast (axe veya manuel)
- [ ] **SEO / Meta**: `getMeta` ile üretilen başlık/açıklama görünüyor mu?
- [ ] **Dokümantasyon**: README / QA notları güncel mi?
- [ ] **Log / Console**: Uygulama ve test sırasında hata/uyarı yok
