# Mobile E2E Manual Testing Checklist

This checklist is for manual testing of mobile E2E flows when automated testing is not yet available or as a supplement to automated tests.

## Prerequisites

- [ ] Dev Client APK built (`npm run build:dev-client:android`)
- [ ] Dev Client installed on physical device
- [ ] Device connected via USB debugging (Android) or TestFlight (iOS)
- [ ] Expo Dev Server running (`npm start`)

## Test Environment Setup

### Android
- [ ] USB debugging enabled
- [ ] Device authorized for debugging
- [ ] ADB connection verified (`adb devices`)
- [ ] Dev Client APK installed

### iOS
- [ ] Device registered in Apple Developer Portal
- [ ] Dev Client installed via TestFlight or Xcode
- [ ] Development provisioning profile active
- [ ] Expo Dev Server accessible from device

## Core Flow Tests

### 1. App Launch
- [ ] App launches without crashes
- [ ] Splash screen displays correctly
- [ ] App navigates to home screen
- [ ] No error messages on startup
- [ ] Loading states display correctly

### 2. Tab Navigation
- [ ] All tabs are accessible
- [ ] Tab switching works smoothly
- [ ] Tab icons display correctly
- [ ] Active tab indicator works
- [ ] Tab state persists on app resume

**Tabs to test:**
- [ ] Discover tab
- [ ] Safety tab
- [ ] Profile tab
- [ ] Messages/Inbox tab (if applicable)

### 3. Push Notifications
- [ ] Permission request dialog appears
- [ ] Permission can be granted
- [ ] Permission can be denied
- [ ] Notification token is registered
- [ ] Test notification is received
- [ ] Notification opens app correctly
- [ ] Notification badge updates

### 4. Error Handling
- [ ] Error boundaries catch errors
- [ ] Error UI displays correctly
- [ ] "Try Again" button works
- [ ] App recovers from errors
- [ ] No crashes on error

### 5. Language Switching
- [ ] Language can be switched
- [ ] UI updates to new language
- [ ] Language preference persists
- [ ] All text is translated
- [ ] RTL layout works (if applicable)

### 6. Download Flow
- [ ] Download CTA is visible
- [ ] Download CTA is clickable
- [ ] Platform detection works
- [ ] Redirect to Play Store/App Store works
- [ ] Fallback works for unsupported platforms

## Advanced Flow Tests

### 7. Matching Flow (When Implemented)
- [ ] Matching can be initiated
- [ ] Queue position displays
- [ ] Match found notification works
- [ ] Match can be accepted
- [ ] Match can be rejected
- [ ] Match can be cancelled

### 8. Profile Setup (When Implemented)
- [ ] Profile can be created
- [ ] Profile can be edited
- [ ] Validation errors display correctly
- [ ] Profile data persists
- [ ] Profile syncs with backend

### 9. Chat/Messaging (When Implemented)
- [ ] Messages can be sent
- [ ] Messages can be received
- [ ] Message history loads
- [ ] Typing indicators work
- [ ] Message status updates

## Performance Tests

### 10. App Performance
- [ ] App launches in < 3 seconds
- [ ] Navigation is smooth (60fps)
- [ ] No jank during scrolling
- [ ] Images load efficiently
- [ ] Memory usage is reasonable
- [ ] Battery usage is acceptable

### 11. Network Handling
- [ ] App works offline (if applicable)
- [ ] Network errors handled gracefully
- [ ] Retry logic works
- [ ] Loading states display
- [ ] Timeout handling works

## Device-Specific Tests

### 12. Screen Sizes
- [ ] Small screens (e.g., iPhone SE)
- [ ] Medium screens (e.g., Pixel 6)
- [ ] Large screens (e.g., tablets)
- [ ] Landscape orientation
- [ ] Portrait orientation

### 13. Android-Specific
- [ ] Back button works
- [ ] System UI overlays work
- [ ] Notch handling (if applicable)
- [ ] Dark mode works
- [ ] Light mode works

### 14. iOS-Specific
- [ ] Safe area insets work
- [ ] Notch handling
- [ ] Home indicator works
- [ ] Swipe gestures work
- [ ] Haptic feedback works

## Accessibility Tests

### 15. Screen Reader
- [ ] VoiceOver/TalkBack works
- [ ] All elements are accessible
- [ ] Labels are descriptive
- [ ] Navigation is logical
- [ ] Actions are clear

### 16. Keyboard Navigation
- [ ] All elements are focusable
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] Keyboard shortcuts work (if applicable)

### 17. Visual Accessibility
- [ ] Color contrast meets WCAG AA
- [ ] Text is readable
- [ ] Icons have text labels
- [ ] Reduced motion works
- [ ] Font scaling works

## Edge Cases

### 18. App Lifecycle
- [ ] App resumes from background
- [ ] App handles app switching
- [ ] App handles phone calls (Android)
- [ ] App handles low memory
- [ ] App handles device rotation

### 19. Data Persistence
- [ ] User preferences persist
- [ ] App state persists
- [ ] Data syncs correctly
- [ ] Cache works correctly
- [ ] Data clears on logout (if applicable)

### 20. Security
- [ ] Sensitive data is encrypted
- [ ] API keys are secure
- [ ] User data is protected
- [ ] Permissions are requested correctly
- [ ] Privacy settings work

## Test Results Template

```
## Test Session: [Date] - [Device Model] - [OS Version]

### Environment
- Device: [Model]
- OS: [Version]
- App Version: [Version]
- Build: [Dev Client / Production]

### Results
- Total Tests: [X]
- Passed: [X]
- Failed: [X]
- Blocked: [X]

### Issues Found
1. [Issue description]
   - Severity: [P0/P1/P2]
   - Steps to reproduce: [Steps]
   - Expected: [Expected behavior]
   - Actual: [Actual behavior]

### Notes
[Additional notes]
```

## Reporting

### Issue Severity Levels

- **P0 (Critical)**: App crashes, data loss, security issues
- **P1 (High)**: Major functionality broken, poor UX
- **P2 (Medium)**: Minor issues, edge cases
- **P3 (Low)**: Cosmetic issues, nice-to-have improvements

### Reporting Channels

- Create GitHub issue with `mobile-e2e` label
- Add to test results document
- Notify team via Slack/Discord
- Add to bug tracking system

## Next Steps

After manual testing:
1. Document all issues found
2. Prioritize issues by severity
3. Create tickets for fixes
4. Re-test after fixes
5. Update automated tests when possible

## Resources

- [Mobile Debug Device Testing Guide](mobile-debug-device-testing.md)
- [Device Matrix Implementation](mobile-device-matrix-implementation.md)
- [Mobile E2E Alternatives](mobile-e2e-alternatives.md)

