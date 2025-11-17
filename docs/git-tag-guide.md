# Git Tag Oluşturma Rehberi

## Tag Oluşturma Yöntemleri

### Yöntem 1: Terminal'den (Önerilen)

#### Adım 1: Değişiklikleri Commit Et

```bash
# Tüm değişiklikleri ekle
git add .

# Commit oluştur
git commit -m "feat: Add automatic submit to Play Console"

# Push et
git push origin feat/mobile-mvp
```

#### Adım 2: Tag Oluştur ve Push Et

```bash
# Tag oluştur (annotated tag - önerilen)
git tag -a v1.0.1 -m "Release v1.0.1: Automatic Play Console submit"

# Tag'i push et
git push origin v1.0.1

# Veya tüm tag'leri push et
git push origin --tags
```

#### Tag Versiyonlama Önerileri

- **v1.0.1** - Patch release (bug fix)
- **v1.1.0** - Minor release (yeni özellik)
- **v2.0.0** - Major release (breaking changes)

### Yöntem 2: GitHub Web Arayüzünden

1. GitHub repo'na git: `https://github.com/yasertunc/project-1`
2. Sağ tarafta **"Releases"** → **"Create a new release"** tıkla
3. **"Choose a tag"** → **"Create new tag"** seç
4. Tag adı: `v1.0.1`
5. **"Create release"** butonuna tıkla

### Yöntem 3: GitHub Actions'tan Manuel Çalıştırma

1. GitHub repo → **Actions** sekmesi
2. **"EAS Build"** workflow'unu seç
3. **"Run workflow"** butonuna tıkla
4. Branch seç ve **"Run workflow"** tıkla

## Tag Formatı

Workflow'umuz `v*` formatındaki tag'leri tetikliyor:

- ✅ `v1.0.1` - Çalışır
- ✅ `v1.1.0` - Çalışır
- ✅ `v2.0.0` - Çalışır
- ❌ `1.0.1` - Çalışmaz (v ile başlamalı)

## Tag Oluşturulduktan Sonra

Tag push edildiğinde:

1. GitHub Actions workflow otomatik başlar
2. Android AAB build'i oluşturulur
3. Build tamamlandıktan sonra otomatik olarak Play Console internal track'e gönderilir

## Mevcut Tag'leri Görüntüleme

```bash
# Tüm tag'leri listele
git tag

# Belirli bir tag'i görüntüle
git show v1.0.1
```

## Tag Silme (Gerekirse)

```bash
# Local tag'i sil
git tag -d v1.0.1

# Remote tag'i sil
git push origin --delete v1.0.1
```
