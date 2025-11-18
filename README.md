[![Chromatic](https://badgen.net/badge/visual%20tests/Chromatic/orange)](https://www.chromatic.com/builds?appId=691374e0d54721cfeb8ae770)

# Fellowus

**Privacy-first, anonymous matching & conversation app** with dynamic guide behavior across Android/iOS + Web.

[![gh-pages](https://github.com/yasertunc/project-1/actions/workflows/deploy-gh-pages.yml/badge.svg)](https://github.com/yasertunc/project-1/actions/workflows/deploy-gh-pages.yml)

**Live docs:** https://www.fellowus.com/  
**Prod Storybook:** https://www.fellowus.com/storybook/

## Project Structure

```
├── apps/
│   └── mobile/          # Expo React Native app (Android/iOS)
├── src/                 # Web components & Storybook
├── docs/                # Documentation
├── schemas/             # JSON Schema event contracts
└── openapi/             # OpenAPI specifications
```

## Quick Start

### Web (Storybook)

```bash
npm ci
npm run storybook
```

### Mobile (Expo)

```bash
cd apps/mobile
npm install
npm run start
```

For Android/iOS builds, see [docs/mobile-notifications.md](docs/mobile-notifications.md) and [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md).

## Documentation

📚 **Full documentation index**: [docs/README.md](docs/README.md)

**Quick links:**

- 📊 [Project Status](docs/PROJECT_STATUS.md) - Current status and progress (✅ All technical preparation complete)
- 📋 [Final Completion Summary](docs/FINAL_COMPLETION_SUMMARY.md) - ✅ **Complete project summary**
- 📋 [Project Completion Summary](docs/project-completion-summary.md) - High-level overview
- 🧪 [QA Checklist](docs/QA_CHECKLIST.md) - Quality assurance checklist
- 🔧 [Tool Integrations Setup](docs/tool-integrations-setup.md) - Setup guides for all tools

## Development

### Health Checks

```bash
npm run health:all
```

### Visual Regression

```bash
npm run vr:update
npm run vr
```

### i18n & Tokens

```bash
npm run i18n:check
npm run tokens:build
```

### Code Quality

```bash
npm run format:write
npm run lint
npm run typecheck
```

## Releases

To produce tagged releases:

```bash
npm run release:tag           # creates v<package.json version> and pushes it
npm run release:tag rc        # creates the next v<version>-rc.N tag
npm run release:tag beta      # creates the next v<version>-beta.N tag
```

This triggers:

- GitHub Pages deploy for production Storybook
- EAS Build workflows (when secrets are present)

## Event Contracts

This package includes **JSON Schema** contracts and **Reason/Code** dictionaries for the Matching Acceptance Flow.

### Contents

- `schemas/common.json` – common fields
- `schemas/*.schema.json` – event-based schemas
- `dictionaries/*.json|*.csv` – fixed dictionaries

### Usage

- Pre-production validation: JSON Schema validator (AJV, djv, etc.)
- Versioning: Update `eventVersion` field with minor/major rules
- Privacy: No PII, limited `geoHash` precision, participants use anonymous handles

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for development setup.

### Quick Start for Contributors

1. Clone and install: `npm ci`
2. Make changes
3. Pre-commit hooks will auto-format/lint on commit
4. Run full checks: `npm run health:all`
5. Push and create PR

## Documentation

- [Project Status](docs/PROJECT_STATUS.md) – Current progress and roadmap
- [Mobile Setup](docs/mobile-notifications.md) – Push notifications & environment setup
- [EAS Build](docs/eas-submit.md) – Build and submission automation
- [Security](docs/security-hardening.md) – Security best practices

## License

Private project.
