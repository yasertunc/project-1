# i18n Next Languages Plan (10.4-10.5)

This document outlines the plan for adding additional languages to the Fellowus app beyond English (v1 scope).

## Current Status

- ✅ **English (en)**: Complete, v1 baseline
- ✅ **Turkish (tr)**: Partial (some keys exist)
- ✅ **Arabic (ar)**: Partial (some keys exist)
- ⚠️ **Russian (ru)**: Not started
- ⚠️ **EU/AS languages**: Not started

## Target Languages

### Phase 1: Priority Languages (Post-v1)

1. **Turkish (tr)** - High priority
   - Large user base in target markets
   - RTL not required (LTR)
   - Status: Partial implementation

2. **Arabic (ar)** - High priority
   - Large user base in target markets
   - RTL support required
   - Status: Partial implementation, RTL support needed

3. **Russian (ru)** - Medium priority
   - Large user base in target markets
   - LTR
   - Status: Not started

### Phase 2: Regional Expansion

4. **French (fr)** - EU expansion
5. **German (de)** - EU expansion
6. **Spanish (es)** - EU/LATAM expansion
7. **Portuguese (pt)** - EU/LATAM expansion
8. **Hindi (hi)** - AS expansion
9. **Chinese (zh)** - AS expansion
10. **Japanese (ja)** - AS expansion

## Implementation Plan

### Step 1: Complete Turkish (tr)

1. **Scan for missing keys**:
   ```bash
   npm run i18n:scan
   npm run i18n:check
   ```

2. **Add missing translations**:
   - Review `src/locales/tr/common.json`
   - Add missing keys from `src/locales/en/common.json`
   - Ensure all UI strings are translated

3. **Test Turkish locale**:
   - Switch language in app
   - Verify all text displays correctly
   - Test language persistence

### Step 2: Complete Arabic (ar) with RTL Support

1. **Complete translations**:
   - Review `src/locales/ar/common.json`
   - Add missing keys
   - Professional translation recommended

2. **RTL Layout Support**:
   - Update CSS/Tailwind for RTL
   - Test layout with `dir="rtl"`
   - Verify text alignment, margins, padding
   - Test navigation flow (RTL reading order)

3. **RTL Components**:
   - Update `LanguageSwitcher` to handle RTL
   - Test form inputs (text alignment)
   - Test navigation (back button position)
   - Test lists and cards (alignment)

### Step 3: Add Russian (ru)

1. **Create locale file**:
   ```bash
   mkdir -p src/locales/ru
   cp src/locales/en/common.json src/locales/ru/common.json
   ```

2. **Translate content**:
   - Professional translation recommended
   - Review cultural context
   - Test with native speakers

3. **Add to language switcher**:
   - Update `src/components/LanguageSwitcher.tsx`
   - Add Russian option

### Step 4: Professional Translation Integration

1. **Translation Service Selection**:
   - Options: Crowdin, Lokalise, Phrase, Transifex
   - Consider: Cost, API integration, workflow

2. **Workflow Setup**:
   - Export translation keys to service
   - Assign translators
   - Review and approve translations
   - Import translations back to codebase

3. **CI/CD Integration**:
   - Automate translation sync
   - Validate translations on PR
   - Generate translation reports

## Technical Implementation

### Locale File Structure

```
src/locales/
├── en/
│   └── common.json
├── tr/
│   └── common.json
├── ar/
│   └── common.json
└── ru/
    └── common.json
```

### Adding a New Language

1. **Create locale directory**:
   ```bash
   mkdir -p src/locales/{locale}
   ```

2. **Copy base translation file**:
   ```bash
   cp src/locales/en/common.json src/locales/{locale}/common.json
   ```

3. **Translate content**:
   - Replace English text with translations
   - Keep keys unchanged
   - Maintain JSON structure

4. **Update i18n configuration**:
   - Add locale to `src/i18n/setup.ts`
   - Update `LanguageSwitcher` component
   - Test language switching

5. **Validate**:
   ```bash
   npm run i18n:check
   ```

### RTL Support

For RTL languages (Arabic, Hebrew, etc.):

1. **CSS/Tailwind RTL**:
   ```css
   [dir="rtl"] {
     /* RTL-specific styles */
   }
   ```

2. **React Native RTL**:
   - Use `I18nManager.forceRTL(true)` for RTL
   - Test layout with RTL enabled
   - Verify text alignment

3. **Component Updates**:
   - Use logical properties (margin-inline-start instead of margin-left)
   - Test navigation flow
   - Test form inputs

## Quality Assurance

### Translation Quality

- [ ] Professional translation review
- [ ] Native speaker review
- [ ] Cultural context validation
- [ ] Terminology consistency

### Technical Quality

- [ ] All keys present in all locales
- [ ] No missing translations
- [ ] JSON syntax valid
- [ ] i18n check passes

### UI/UX Quality

- [ ] Text fits in UI elements
- [ ] No text overflow
- [ ] RTL layout correct (if applicable)
- [ ] Language switching works
- [ ] Language persistence works

## Timeline

- **v1.0**: English only
- **v1.1**: Turkish (tr) complete
- **v1.2**: Arabic (ar) complete with RTL
- **v1.3**: Russian (ru) added
- **v2.0**: Professional translation service integrated
- **v2.1+**: Regional expansion (EU/AS languages)

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [React Native i18n](https://reactnative.dev/docs/internationalization)
- [RTL Support Guide](https://reactnative.dev/docs/native-modules-ios#right-to-left-languages)
- Translation Services: Crowdin, Lokalise, Phrase, Transifex

## Next Steps

1. Complete Turkish translations
2. Implement RTL support for Arabic
3. Add Russian translations
4. Evaluate and select translation service
5. Set up translation workflow
6. Plan regional expansion

