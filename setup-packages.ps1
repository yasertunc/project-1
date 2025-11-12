# Requires PowerShell 5+
# Run with:  powershell -ExecutionPolicy Bypass -File .\setup-packages.ps1
$ErrorActionPreference = "Stop"

function Run-Step($title, $cmd) {
  Write-Host "→ $title" -ForegroundColor Cyan
  Invoke-Expression $cmd
}

Write-Host "🚀 Fellowus ortam kurulumu (PowerShell) başlıyor..." -ForegroundColor Green
Write-Host "-------------------------------------------"

# 1️⃣ Vite + React altyapısı
Run-Step "App & Vite bağımlılıkları yükleniyor..." `
  "npm install react react-dom vite @vitejs/plugin-react"

# 2️⃣ Kod kalitesi araçları (lint / prettier)
Run-Step "Lint & Prettier kurulumu..." `
  "npm install -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks"

# 3️⃣ API + Mock servisleri (İstemci katmanı için)
Run-Step "API & Mock servisleri yükleniyor..." `
  "npm install ky msw"

# 4️⃣ Playwright / E2E / Görsel Regresyon testleri
Run-Step "Playwright ve erişilebilirlik testleri yükleniyor..." `
  "npm install -D @playwright/test @axe-core/playwright"

# 5️⃣ Node type desteği
Run-Step "TypeScript Node türleri yükleniyor..." `
  "npm install -D @types/node"

Write-Host "-------------------------------------------"
Write-Host "✅ Kurulum tamamlandı! Şimdi şunları çalıştırabilirsin:" -ForegroundColor Green
Write-Host "   npm run storybook          # Storybook geliştirme ortamı"
Write-Host "   npm run test-storybook     # Storybook testleri (CI modu)"
Write-Host "   npx playwright install     # (ilk kez) tarayıcıları indirir"
Write-Host "   npx playwright test        # E2E veya VR testleri"
Write-Host "-------------------------------------------"
