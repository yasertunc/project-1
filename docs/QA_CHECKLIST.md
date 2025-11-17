# Fellowus – QA Checklist

This checklist should be completed before each release (internal testing, beta, or production).

## Pre-Release Checks

### Code Quality

- [ ] **Lint / Format**: `npm run lint`, `npm run format:check` (or `npm run format:write` to auto-fix)
- [ ] **Type Check**: `npm run typecheck` (no TypeScript errors)
- [ ] **Dead Code**: `npm run deadcode` (no unused exports)
- [ ] **Unit Tests**: `npm run test` (all tests passing, coverage thresholds met)
- [ ] **Test Coverage**: Check coverage report (`coverage/index.html`)

### Visual & Regression

- [ ] **Visual Regression**: `npm run vr` (all snapshots match, or `npm run vr:update` if intentional changes)
- [ ] **Storybook Build**: `npm run build-storybook` (no build errors)
- [ ] **Storybook Tests**: `npm run test-storybook` (all stories render correctly)

### E2E & Integration

- [ ] **Smoke Tests**: `npm run test:smoke` (critical flows pass)
- [ ] **Flow Tests**: `npm run test:flows` (if available, or manual testing)
- [ ] **Failure Scenarios**: Error boundaries and fallbacks work correctly

### Accessibility

- [ ] **A11y Stories**: `npm run a11y:stories` (no violations)
- [ ] **Keyboard Navigation**: All interactive elements are focusable and navigable
- [ ] **Focus Rings**: Visible focus indicators on all interactive elements
- [ ] **ARIA Labels**: All interactive elements have appropriate `aria-label` or `aria-labelledby`
- [ ] **Color Contrast**: Text meets WCAG AA standards (≥ 4.5:1 for normal text, ≥ 3:1 for large text)
- [ ] **Screen Reader**: Test with VoiceOver (iOS) or TalkBack (Android)
- [ ] **Reduced Motion**: `prefers-reduced-motion` respected
- [ ] **Final A11y Audit**: Complete checklist in `docs/final-a11y-audit.md`

### Performance

- [ ] **Lighthouse CI**: `npm run lh:ci` (scores ≥ 90 for performance, accessibility, SEO)
- [ ] **Bundle Size**: `npm run perf:budget` (within budget limits)
- [ ] **Bundle Analysis**: `npm run sb:analyze` (check for large dependencies)
- [ ] **Load Time**: App loads in < 3 seconds on 3G connection
- [ ] **Runtime Performance**: Smooth 60 FPS navigation, no jank

### Security

- [ ] **Dependency Audit**: `npm run audit` (no high/critical vulnerabilities)
- [ ] **Secret Scanning**: `npm run scan:secrets` (no secrets in code)
- [ ] **OSV Scanner**: Check GitHub Security tab for vulnerabilities
- [ ] **Secure Headers**: Verify headers in production (if applicable)

### Mobile-Specific (if applicable)

- [ ] **Expo Doctor**: `npx expo-doctor apps/mobile` (no warnings)
- [ ] **Android Build**: `eas build --platform android --profile production` (builds successfully)
- [ ] **iOS Build**: `eas build --platform ios --profile production-ios` (builds successfully)
- [ ] **Push Notifications**: Test notification permission flow and token registration
- [ ] **Error Boundaries**: Test error handling on device
- [ ] **Device Testing**: Test on physical devices (see `docs/mobile-debug-device-testing.md`)

### Content & SEO

- [ ] **Meta Tags**: Verify `getMeta` output (title/description) is visible and correct
- [ ] **Open Graph**: OG tags present and correct
- [ ] **Sitemap**: `public/sitemap.xml` is up to date
- [ ] **Robots.txt**: `public/robots.txt` is correct
- [ ] **Language Tags**: `lang` attribute set correctly
- [ ] **Alt Text**: All images have descriptive alt text

### Localization

- [ ] **i18n Scan**: `npm run i18n:scan` (no missing keys)
- [ ] **i18n Check**: `npm run i18n:check` (all locales have same keys)
- [ ] **Language Switch**: Test language switching (EN ⇄ TR)
- [ ] **RTL Support**: Test Arabic/RTL layout (if applicable)

### Documentation

- [ ] **README**: `README.md` is up to date
- [ ] **Mobile README**: `apps/mobile/README.md` is up to date
- [ ] **API Docs**: JSDoc comments are complete for public APIs
- [ ] **Changelog**: `docs/PROJECT_STATUS.md` changelog is updated
- [ ] **Release Notes**: Draft release notes for this version

### Logs & Console

- [ ] **Console Errors**: No errors in browser/device console during normal usage
- [ ] **Console Warnings**: Review warnings, fix or document as needed
- [ ] **Sentry**: Check Sentry dashboard for new errors
- [ ] **Production Logs**: Review production logs (if available)

### Manual Testing

- [ ] **Critical User Flows**: Test top 5 user journeys manually
- [ ] **Download Flow**: Test `/download` page redirects correctly
- [ ] **Privacy/Terms**: Verify `/privacy` and `/terms` pages are accessible
- [ ] **Error Scenarios**: Test error handling (network failures, invalid inputs)
- [ ] **Cross-Browser**: Test on Chrome, Firefox, Safari (if web)
- [ ] **Cross-Platform**: Test on Android and iOS (if mobile)

## Release-Specific Checks

### Internal Testing (16.4)

- [ ] **Play Console**: AAB uploaded to internal track
- [ ] **Test Users**: Test users added to Play Console
- [ ] **TestFlight**: iOS build uploaded to TestFlight (if applicable)
- [ ] **Feedback Channel**: Feedback collection mechanism ready

### Open Beta (16.6)

- [ ] **Open Testing**: AAB moved to open testing track
- [ ] **Public TestFlight**: iOS build available via Public TestFlight link
- [ ] **Marketing**: Landing page updated with beta information
- [ ] **Analytics**: Analytics tracking enabled

### Production (17.1)

- [ ] **Version Bump**: Version number updated in `package.json` and `app.config.ts`
- [ ] **Git Tag**: Tag created with `npm run release:tag`
- [ ] **Store Listings**: Play Console and App Store Connect listings complete
- [ ] **Privacy Policy**: Privacy policy URL added to store listings
- [ ] **Terms of Service**: Terms URL added to store listings
- [ ] **Screenshots**: Store screenshots uploaded
- [ ] **Release Notes**: Store release notes written
- [ ] **Monitoring**: Sentry alerts configured
- [ ] **Rollback Plan**: Rollback procedure documented

## Sign-Off

- [ ] **QA Lead**: All checks passed, ready for release
- [ ] **Tech Lead**: Code review complete, technical approval
- [ ] **Product Owner**: Feature set approved for release

## Post-Release

- [ ] **Monitor**: Watch Sentry and analytics for 48 hours
- [ ] **Feedback**: Collect and triage user feedback
- [ ] **Hotfixes**: Prepare hotfix process if needed
- [ ] **Retrospective**: Document lessons learned

---

**Last Updated**: 2025-11-15  
**Next Review**: Before each release
