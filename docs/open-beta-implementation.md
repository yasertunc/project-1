# Open Beta Implementation Guide

This document provides a detailed implementation guide for the open beta rollout plan outlined in `docs/open-beta-plan.md`.

## Overview

Open beta allows public testing of the app before full production release. This guide covers Android Play Console Open Testing and iOS Public TestFlight setup, monitoring, and management.

## Android - Play Console Open Testing

### Prerequisites

- [ ] Internal testing track has been validated
- [ ] No P0/P1 bugs in internal testing
- [ ] Privacy policy and terms of service published
- [ ] Store listing content ready
- [ ] Support channels established

### Step 1: Create Open Testing Track

1. **Navigate to Play Console**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Select "Fellowus Mobile" app
   - Go to **Testing** → **Open testing**

2. **Create Track**:
   - Click **Create new release**
   - Select the AAB from internal testing (or upload new)
   - Add release notes:

     ```
     Open Beta v1.0.0

     Welcome to Fellowus Open Beta! This is an early version of the app.

     What's new:
     - Initial release
     - Core matching functionality
     - Push notifications

     Known issues:
     - [List any known issues]

     We appreciate your feedback! Please report issues via [support link].
     ```

3. **Configure Track Settings**:
   - **Countries/regions**: Start with limited regions (e.g., Turkey, US)
   - **Testing requirements**: Optional (can require opt-in)
   - **Feedback channels**: Enable in-app feedback, Play Console reviews

### Step 2: Store Listing for Open Testing

1. **App Details**:
   - Title: "Fellowus Mobile (Beta)"
   - Short description: "Connect with fellow travelers - Beta version"
   - Full description: Include beta disclaimer and feedback instructions

2. **Graphics**:
   - Use beta badge on screenshots if desired
   - Feature graphic with "BETA" label

3. **Content Rating**:
   - Complete content rating questionnaire
   - Ensure rating is appropriate for target audience

### Step 3: Gradual Rollout

1. **Initial Rollout (10%)**:

   ```bash
   # Monitor for 24-48 hours
   # Check crash rate, user feedback, ratings
   ```

2. **Expand Rollout**:
   - If metrics are good, increase to 25%
   - Monitor for another 24-48 hours
   - Continue expanding: 50% → 75% → 100%

3. **Rollback Procedure**:
   - If issues detected, pause rollout immediately
   - Fix issues in internal testing
   - Create new release and restart rollout

### Step 4: Monitoring & Metrics

#### Key Metrics to Track

**Crash Rate**:

- Target: < 1% crash-free sessions
- Alert if: > 2% crash-free sessions

**User Feedback**:

- Monitor Play Console reviews
- Track in-app feedback submissions
- Monitor support channels

**Performance**:

- App startup time
- ANR (Application Not Responding) rate
- Battery usage

**Engagement**:

- Daily active users (DAU)
- Session length
- Feature usage

#### Monitoring Setup

**Play Console Dashboard**:

- Go to **Quality** → **Android vitals**
- Set up alerts for:
  - Crash rate threshold
  - ANR rate threshold
  - Slow rendering

**Sentry Alerts**:

```javascript
// Configure Sentry alerts for beta releases
{
  "conditions": [
    {
      "id": "crash_rate_threshold",
      "name": "Crash Rate > 2%",
      "conditions": [
        {
          "id": "crash_rate",
          "value": 0.02,
          "interval": "1h"
        }
      ]
    }
  ]
}
```

**Google Analytics 4**:

- Create custom events for beta-specific actions
- Set up conversion tracking
- Monitor user flows

### Step 5: Feedback Collection

#### In-App Feedback

Implement feedback mechanism:

```typescript
// apps/mobile/src/components/FeedbackButton.tsx
import { Button } from 'react-native';
import * as Linking from 'expo-linking';

export function FeedbackButton() {
  const handleFeedback = () => {
    Linking.openURL('https://forms.gle/[FEEDBACK_FORM_ID]');
  };

  return (
    <Button
      title="Send Feedback"
      onPress={handleFeedback}
    />
  );
}
```

#### Play Console Reviews

- Respond to all reviews (especially negative ones)
- Thank users for feedback
- Address common issues in release notes

#### Support Channels

- Email: beta-support@fellowus.app
- Discord: [Beta channel]
- GitHub Issues: [If public]

### Step 6: Communication

#### Beta Announcement

**Channels**:

- Website blog post
- Social media (Twitter, LinkedIn)
- Email newsletter
- Community Discord

**Message Template**:

```
🎉 Fellowus Mobile Open Beta is Live!

We're excited to announce the open beta of Fellowus Mobile!

What to expect:
- Early access to new features
- Help shape the future of Fellowus
- Report bugs and share feedback

Download now: [Play Store Link]

Note: This is a beta version. Some features may be incomplete or have bugs.
```

#### Regular Updates

- Weekly release notes
- Monthly beta summary
- Respond to user feedback publicly

## iOS - Public TestFlight

### Prerequisites

- [ ] Internal TestFlight group validated
- [ ] App Store Connect app created
- [ ] Privacy policy and terms URLs configured
- [ ] App Privacy questionnaire completed
- [ ] Beta App Review passed (if required)

### Step 1: Create Public Link

1. **Navigate to App Store Connect**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Select "Fellowus Mobile"
   - Go to **TestFlight** → **Public Link**

2. **Create Public Link**:
   - Click **Enable Public Link**
   - Set capacity (e.g., 1,000 testers)
   - Add public link information:
     - Title: "Fellowus Mobile Beta"
     - Description: "Join the Fellowus Mobile beta and help us improve!"
     - What to Test: Detailed testing instructions

3. **Configure Build**:
   - Select build to distribute
   - Add test information
   - Submit for Beta App Review (if first time)

### Step 2: Beta App Review

**Requirements**:

- Complete App Privacy questionnaire
- Provide demo account (if login required)
- Ensure app complies with App Store guidelines
- Include beta disclaimer in app

**Review Process**:

- Typically takes 24-48 hours
- Apple may request additional information
- Once approved, public link is active

### Step 3: Distribute Public Link

**Share Link**:

- Website: Add TestFlight badge
- Social media: Share link with instructions
- Email: Send to beta signup list
- In-app: Show link to existing users (if applicable)

**Link Format**:

```
https://testflight.apple.com/join/[INVITE_CODE]
```

### Step 4: Monitoring & Metrics

#### TestFlight Metrics

**App Store Connect Dashboard**:

- Install count
- Crash reports
- Feedback submissions
- Usage statistics

**Key Metrics**:

- Install rate
- Crash-free sessions
- User retention
- Feature adoption

#### Sentry Integration

Configure Sentry for TestFlight builds:

```typescript
// apps/mobile/app.config.ts
export default {
  extra: {
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: "testflight-beta",
  },
};
```

### Step 5: Feedback Collection

#### TestFlight Feedback

- Users can submit feedback directly in TestFlight
- Monitor feedback in App Store Connect
- Respond to feedback promptly

#### In-App Feedback

Same as Android - implement feedback button:

```typescript
// Link to feedback form or support email
Linking.openURL("mailto:beta-support@fellowus.app?subject=Beta%20Feedback");
```

### Step 6: Updates & Communication

#### Regular Builds

- Push updates weekly (if changes available)
- Include release notes in TestFlight
- Notify testers of major updates

#### Communication

- TestFlight notes for each build
- Email updates to testers
- Community Discord announcements

## Exit Criteria

### Metrics Thresholds

**Must Meet**:

- [ ] Crash-free sessions > 99%
- [ ] No P0 bugs for ≥ 7 days
- [ ] Average rating ≥ 4.0 (if applicable)
- [ ] No critical security issues

**Should Meet**:

- [ ] User retention ≥ 40% (Day 7)
- [ ] Feature adoption ≥ 50%
- [ ] Support ticket volume < 10/day
- [ ] Performance metrics within targets

### Go/No-Go Decision

**Go to Production If**:

- All "Must Meet" criteria satisfied
- At least 3 "Should Meet" criteria satisfied
- Stakeholder approval received
- Production release plan ready

**Delay Production If**:

- Any "Must Meet" criteria not met
- Critical bugs discovered
- User feedback indicates major issues
- Performance below targets

## Rollback Procedure

### If Issues Detected

1. **Immediate Actions**:
   - Pause new installs (if possible)
   - Notify testers of known issues
   - Investigate root cause

2. **Fix Process**:
   - Reproduce issue
   - Fix in development
   - Test in internal testing
   - Release hotfix to beta

3. **Communication**:
   - Transparent update to testers
   - Timeline for fix
   - Workaround instructions (if available)

## Post-Beta Transition

### Preparation for Production

1. **Finalize Store Listings**:
   - Remove beta disclaimers
   - Update screenshots/graphics
   - Finalize descriptions

2. **Prepare Production Build**:
   - Increment version number
   - Remove beta-specific code
   - Final QA pass

3. **Migration Plan**:
   - Beta users → Production users
   - Data migration (if needed)
   - Notification to beta testers

### Thank Beta Testers

- Special recognition in app (if applicable)
- Thank you message
- Early access to production features
- Beta tester badge (if applicable)

## Resources

- [Open Beta Plan](docs/open-beta-plan.md)
- [Rollout Plan](docs/rollout-plan.md)
- [Release Preparation](docs/release-prep.md)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [TestFlight Guide](https://developer.apple.com/testflight/)
