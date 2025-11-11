# Fellowus – Event Contracts v1

Tarih: 2025-11-10T10:04:32.534818Z

Bu paket, Matching Acceptance Flow için **JSON Schema** sözleşmelerini ve **Reason/Code** sözlüklerini içerir.

## İçerik

- `schemas/common.json` – ortak alanlar
- `schemas/*.schema.json` – event bazlı şemalar
- `dictionaries/*.json|*.csv` – sabit sözlükler

## Kullanım

- Üretim öncesi doğrulama: JSON Schema validator (AJV, djv, etc.)
- Sürümleme: `eventVersion` alanını minör/majör kurallarıyla güncelleyin.
- Gizlilik: PII yok, `geoHash` hassasiyeti sınırlı, katılımcılar anonim handle.

## Developer Quickstart

```bash
npm ci
npm run storybook
```

## Health Checks

```bash
npm run health:all
```

## Visual Regression

```bash
npm run vr:update
npm run vr
```

## i18n & Tokens

```bash
npm run i18n:check
npm run tokens:build
```

## Lint · Format · Types

```bash
npm run format:write
npm run lint
npm run typecheck
```

## Storybook (GitHub Pages)
[![deploy-storybook](https://github.com/yasertunc/project-1/actions/workflows/deploy-storybook.yml/badge.svg)](https://github.com/yasertunc/project-1/actions/workflows/deploy-storybook.yml)

**Live docs:** https://yasertunc.github.io/project-1/

