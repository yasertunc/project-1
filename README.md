# Fellowus Storybook

[![gh-pages](https://github.com/yasertunc/project-1/actions/workflows/deploy-gh-pages.yml/badge.svg)](https://github.com/yasertunc/project-1/actions/workflows/deploy-gh-pages.yml)

**Live docs:** https://yasertunc.github.io/project-1/
# Fellowus â€“ Event Contracts v1

Tarih: 2025-11-10T10:04:32.534818Z

Bu paket, Matching Acceptance Flow iÃ§in **JSON Schema** sÃ¶zleÅŸmelerini ve **Reason/Code** sÃ¶zlÃ¼klerini iÃ§erir.

## Ä°Ã§erik

- `schemas/common.json` â€“ ortak alanlar
- `schemas/*.schema.json` â€“ event bazlÄ± ÅŸemalar
- `dictionaries/*.json|*.csv` â€“ sabit sÃ¶zlÃ¼kler

## KullanÄ±m

- Ãœretim Ã¶ncesi doÄŸrulama: JSON Schema validator (AJV, djv, etc.)
- SÃ¼rÃ¼mleme: `eventVersion` alanÄ±nÄ± minÃ¶r/majÃ¶r kurallarÄ±yla gÃ¼ncelleyin.
- Gizlilik: PII yok, `geoHash` hassasiyeti sÄ±nÄ±rlÄ±, katÄ±lÄ±mcÄ±lar anonim handle.

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

## Lint Â· Format Â· Types

```bash
npm run format:write
npm run lint
npm run typecheck
```

## Storybook (GitHub Pages)
[![deploy-storybook](https://github.com/yasertunc/project-1/actions/workflows/deploy-storybook.yml/badge.svg)](https://github.com/yasertunc/project-1/actions/workflows/deploy-storybook.yml)

**Live docs:** https://yasertunc.github.io/project-1/


## Storybook (GitHub Pages)
[![deploy-storybook](https://github.com/yasertunc/project-1/actions/workflows/deploy-storybook.yml/badge.svg)](https://github.com/yasertunc/project-1/actions/workflows/deploy-storybook.yml)

**Live docs:** https://yasertunc.github.io/project-1/


