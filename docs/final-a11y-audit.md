# Final Accessibility Audit Plan (16.1)

## Scope

- **Web Storybook / marketing pages**
- **Mobile Expo app (baseline screens)**
- **Content & localization (English baseline, TR/AR where applicable)**

## Checklist

1. **Keyboard Navigation**
   - Ensure all interactive elements are focusable.
   - Verify skip links (`Skip to main content`) operate.
2. **Color Contrast**
   - Use tools (Storybook a11y panel, axe) to verify contrast ratios (≥ 4.5:1 for text).
3. **ARIA & Semantics**
   - `role`, `aria-label`, `aria-describedby` present where needed.
4. **Focus Management**
   - Modals/dynamic sections trap focus appropriately.
5. **Localization**
   - `lang` attribute updates on language switch.
   - RTL layout verified for `LanguageSwitcher` Arabic option.
6. **Screen Reader Testing**
   - Narrative flow for Hero, How It Works, CTA sections.
   - Mobile: talkback/VoiceOver spot checks.
7. **Performance for Assistive Tech**
   - Avoid animated content without `prefers-reduced-motion` fallback.

## Tooling

- `npm run a11y:stories`
- `npx axe --load-delay`
- Chrome DevTools Lighthouse (Accessibility score)
- Expo Go + TalkBack/VoiceOver for mobile.

## Output

- Document findings in `docs/QA_CHECKLIST.md` (add “Final Accessibility Audit” row).
- Create GitHub issue(s) for any violations blocking release.
