# QA Sweep & Closure Plan (16.2)

## Objectives

1. Validate primary flows across web Storybook and Expo app.
2. Ensure documentation, release notes, and status log are up to date.
3. Capture sign-off checklist before going to internal testing (16.4/16.5).

## Web Checklist

- `npm run build-storybook` + `npm run test:smoke`
- `npm run vr` (ensure snapshots current)
- `npm run lh:ci` against `storybook-static`
- Manual spot check: hero → CTA, language switch, download link.

## Mobile Checklist

- Expo Go smoke on Pixel 6 + Samsung S21 (per device matrix)
- Notification permission flow
- Language switch
- Profile toggles

## Documentation

- Update `docs/QA_CHECKLIST.md` with pass/fail status + links to test evidence.
- Ensure `docs/PROJECT_STATUS.md` matches latest completion state.
- Draft release notes (to use later in GitHub Releases / Play Console).

## Sign-off

- QA lead (or assigned engineer) owns final approval.
- Open issues create blockers; move to 16.3 if resolved.
