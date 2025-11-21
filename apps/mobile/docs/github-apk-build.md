# GitHub Üzerinden APK Oluşturma Rehberi

## Yöntem 1: GitHub UI Üzerinden (Önerilen)

### Adımlar:

1. **GitHub Repository'ye gidin:**
   - GitHub'da projenizin repository sayfasına gidin
   - URL: `https://github.com/[username]/[repository]`

2. **Actions sekmesine tıklayın:**
   - Repository sayfasının üst menüsünden "Actions" sekmesine tıklayın

3. **EAS Build workflow'unu seçin:**
   - Sol menüden "EAS Build" workflow'unu seçin
   - Workflow sayfasında "Run workflow" butonuna tıklayın

4. **Workflow parametrelerini ayarlayın:**
   - "Use workflow from" dropdown'dan branch seçin (genellikle `main` veya `master`)
   - **ÖNEMLİ**: "Which workflow to run?" altında **"android-apk"** job'unu seçin
   - "Run workflow" butonuna tıklayın

5. **Build'i takip edin:**
   - Workflow run sayfasında build ilerlemesini izleyin
   - "Verify APK build belongs to project" step'i projeyi doğrulayacak
   - Build başarılı olursa APK indirilecek

6. **APK'yı indirin:**
   - Workflow tamamlandıktan sonra (genellikle 10-20 dakika)
   - "android-apk" job'una gidin
   - "Upload APK artifact" step'inde APK dosyasını indirin

## Yöntem 2: GitHub CLI ile

### Önkoşullar:

```bash
# GitHub CLI yüklü olmalı
gh --version

# GitHub'a login olun
gh auth login
```

### Workflow'u Tetikle:

```bash
# Repository dizinine gidin
cd /path/to/repository

# Workflow'u tetikle
gh workflow run "EAS Build.yml" \
  --ref main \
  -f job=android-apk
```

### Build'i Takip Et:

```bash
# Workflow run'larını listele
gh run list --workflow="EAS Build.yml"

# Son workflow run'unu izle
gh run watch
```

## Yöntem 3: GitHub API ile

### Workflow'u Tetikle:

```bash
# GitHub Personal Access Token gerekli
GITHUB_TOKEN="your_token_here"
REPO_OWNER="yasertunc"
REPO_NAME="project-1"

curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/workflows/eas-build.yml/dispatches \
  -d '{"ref":"main","inputs":{"job":"android-apk"}}'
```

## Workflow Detayları

### Workflow Tetikleyicileri:

- **workflow_dispatch**: Manuel tetikleme (GitHub UI veya API)
- **push (tags)**: `v*` tag'leri push edildiğinde otomatik tetiklenir

### APK Build Job:

- **Job adı**: `android-apk`
- **Platform**: Android
- **Profile**: `production-apk`
- **Build type**: APK
- **Doğrulama**: Proje ID ve package name kontrolü yapılır

### Build Adımları:

1. ✅ Repository checkout
2. ✅ Node.js ve npm setup
3. ✅ Dependencies cache
4. ✅ Dependencies install
5. ✅ EAS CLI install
6. ✅ EAS project verification
7. ✅ EAS build (Android APK)
8. ✅ Build verification (proje ID ve package name)
9. ✅ Artifact download
10. ✅ GitHub Release oluşturma (tag varsa)

## Build Sonrası

### APK Dosyası:

- **Konum**: Workflow artifacts içinde
- **İsim**: `FellowusMobile-production.apk`
- **Boyut**: ~70-80 MB

### Checksum:

- **SHA256**: `FellowusMobile-production.apk.sha256` dosyası da oluşturulur
- **Güvenlik**: APK'nın bütünlüğünü doğrulamak için kullanılır

### GitHub Release:

Eğer build bir tag push ile tetiklendiyse:
- APK GitHub Release'e eklenir
- SHA256 checksum dosyası da eklenir
- Release notes otomatik oluşturulur

## Sorun Giderme

### GitHub'daki Başarısız Workflow'ları Temizleme

1. **GitHub UI (Actions sekmesi)**
   - Repository → `Actions` → `EAS Build`
   - Sol listeden `workflow run` öğelerini filtrele: Status → `Failed`
   - Her run sayfasında sağ üstte `...` → `Delete workflow run` seç
   - Tek tek silmek yerine liste görünümünde checkbox ile toplu seçip `Delete workflow runs` kullanabilirsin
   - Silme, sadece log/artifactları kaldırır; kod ya da branch etkilenmez

2. **GitHub CLI**
   - `gh run list --workflow="EAS Build.yml" --status failure`
   - Silmek istediğin run ID'leri için:
     ```bash
     gh run delete <run-id>
     ```
   - Toplu silme için küçük bir script çalıştır:
     ```bash
     gh run list --workflow="EAS Build.yml" --status failure --limit 20 --json databaseId \
       | jq '.[].databaseId' \
       | xargs -n1 gh run delete
     ```
   - `jq` yoksa `gh run list ... --format '{id}\n'` çıktısını `for` döngüsüyle silebilirsin

3. **Otomatik Temizlik (Opsiyonel)**
   - `repository → Settings → Actions → General → Artifact and log retention` altında süreyi kısalt
   - İhtiyaç varsa `actions/delete-workflow-runs` gibi GitHub Action'ları belirli aralıklarla çalıştır

> Not: Silme işlemleri audit loglarında görünür; production ortamında politika gerektiriyorsa kayıt al.

### Workflow Başlamıyor

1. **Secrets kontrol edin:**
   - `EXPO_TOKEN` secret'ının ayarlı olduğundan emin olun
   - Repository Settings → Secrets and variables → Actions

2. **Permissions kontrol edin:**
   - Workflow permissions ayarlarını kontrol edin
   - Actions'in "Read and write permissions" olmalı

### Build Başarısız Oluyor

1. **Logs kontrol edin:**
   - Workflow run sayfasında hata loglarını kontrol edin
   - Her step'in detaylarını inceleyin

2. **EAS Token kontrol edin:**
   - `EXPO_TOKEN` secret'ının geçerli olduğundan emin olun
   - Token'ı yeniden oluşturun: `npx expo token:create`

3. **Proje ID kontrol edin:**
   - `EAS_PROJECT_ID` secret'ının doğru olduğundan emin olun
   - Veya `apps/mobile/app.config.ts` içindeki `DEFAULT_PROJECT_ID` kullanılır

### APK Bulunamıyor

1. **Build ID kontrol edin:**
   - "Verify APK build belongs to project" step'inin başarılı olduğundan emin olun
   - Build ID'nin doğru extract edildiğini kontrol edin

2. **Artifact upload kontrol edin:**
   - "Upload APK artifact" step'inin başarılı olduğundan emin olun
   - Artifacts sayfasında APK dosyasının göründüğünü kontrol edin

## Build Süresi

- **İlk build**: 15-25 dakika
- **Sonraki build'ler**: 10-20 dakika (cache sayesinde)
- **EAS Build kuyruğu**: Free tier'da daha uzun sürebilir

## Önemli Notlar

- ✅ **Proje doğrulama**: Build otomatik olarak proje ID ve package name'i doğrular
- ✅ **Güvenlik**: Yanlış proje build'leri otomatik reddedilir
- ✅ **Cache**: npm dependencies cache'lenir, build süresi kısalır
- ✅ **Artifacts**: APK ve checksum dosyaları GitHub artifacts'te saklanır

## Sonraki Adımlar

1. ✅ GitHub Actions'tan APK build'i başlatın
2. ✅ Build'i tamamlanana kadar bekleyin
3. ✅ APK dosyasını artifacts'ten indirin
4. ✅ Cihazda/emülatörde test edin
5. ✅ Package name ve içeriği doğrulayın

## İletişim

Sorunlar için:
- GitHub Issues: Repository → Issues
- EAS Dashboard: https://expo.dev/accounts/yasertunc/projects/fellowus-mobile/builds
- Workflow logs: Repository → Actions → EAS Build → Son workflow run

