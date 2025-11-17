# Development Guide

## Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) to automatically run linting and formatting before commits.

### Setup

After cloning the repository, run:

```bash
npm install
```

The `prepare` script will automatically set up Husky hooks.

### What runs on commit

- **ESLint**: Automatically fixes linting errors in staged files
- **Prettier**: Formats staged files according to `.prettierrc.json`

### Bypassing hooks (not recommended)

If you need to bypass hooks in an emergency:

```bash
git commit --no-verify
```

⚠️ **Warning**: Only use this if absolutely necessary. CI will still fail if code doesn't pass checks.

## Test Coverage

### Running tests with coverage

```bash
npm test
```

This generates coverage reports in:
- `coverage/lcov.info` - LCOV format (for CI)
- `coverage/index.html` - HTML report (open in browser)

### Coverage thresholds

Minimum coverage requirements:
- **Lines**: 60%
- **Functions**: 60%
- **Branches**: 50%
- **Statements**: 60%

### Viewing coverage

```bash
# Open HTML report
open coverage/index.html  # macOS
start coverage/index.html # Windows
xdg-open coverage/index.html # Linux
```

## Code Quality

### Formatting

```bash
# Check formatting
npm run format:check

# Auto-fix formatting
npm run format:write
```

### Linting

```bash
# Run ESLint
npm run lint
```

### Type checking

```bash
# TypeScript type checking
npm run typecheck
```

## Full Health Check

Run all checks locally before pushing:

```bash
npm run health:all
```

This runs:
1. Token build
2. Format check
3. Lint
4. Type check
5. Tests with coverage
6. Dead code detection
7. Storybook tests
8. Storybook build
9. Accessibility checks
10. Performance budget
11. i18n checks
12. Visual regression tests

## CI/CD

### Coverage Reports

Coverage reports are automatically uploaded to Codecov on every CI run. View reports at:
- GitHub Actions: Check the "Upload coverage reports" step
- Codecov (if configured): Coverage dashboard

### Pre-commit vs CI

- **Pre-commit hooks**: Fast checks (lint, format) on staged files only
- **CI**: Full test suite, all files, comprehensive checks

Both must pass for code to be merged.

