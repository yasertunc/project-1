#!/usr/bin/env bash
set -e

echo "🚀 Fellowus ortam kurulumu başlatılıyor..."
echo "-------------------------------------------"

# 1️⃣ Vite + React altyapısı
echo "→ App & Vite bağımlılıkları yükleniyor..."
npm install react react-dom vite @vitejs/plugin-react

# 2️⃣ Kod kalitesi araçları (lint / prettier)
echo "→ Lint & Prettier kurulumu..."
npm install -D eslint prettier   @typescript-eslint/parser @typescript-eslint/eslint-plugin   eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks

# 3️⃣ API + Mock servisleri (İstemci katmanı için)
echo "→ API & Mock servisleri yükleniyor..."
npm install ky msw

# 4️⃣ Playwright / E2E / Görsel Regresyon testleri
echo "→ Playwright ve erişilebilirlik testleri yükleniyor..."
npm install -D @playwright/test @axe-core/playwright

# 5️⃣ Node type desteği
echo "→ TypeScript Node türleri yükleniyor..."
npm install -D @types/node

echo "-------------------------------------------"
echo "✅ Kurulum tamamlandı! Şimdi şunları çalıştırabilirsin:"
echo "   npm run storybook          # Storybook geliştirme ortamı"
echo "   npm run test-storybook     # Storybook testleri (CI modu)"
echo "   npx playwright test        # E2E veya VR testleri"
echo "-------------------------------------------"
