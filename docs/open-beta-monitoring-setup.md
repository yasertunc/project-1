# Open Beta Monitoring Setup Guide

This document provides a comprehensive guide for setting up monitoring and alerting for the open beta release, covering Sentry, Google Analytics 4, Play Console metrics, and TestFlight analytics.

## Overview

Effective monitoring during open beta is critical for:

- Early detection of crashes and errors
- Performance tracking
- User behavior analysis
- Feedback collection
- Quick response to issues

## Monitoring Stack

### 1. Sentry (Error Tracking)

#### Dashboard Setup

**Create Beta Release Dashboard**:

1. Go to Sentry → Dashboards
2. Create new dashboard: "Fellowus Open Beta"
3. Add widgets:
   - **Crash Rate**: `count_unique(user)` grouped by `release`
   - **Error Rate**: `count()` where `level:error`
   - **Top Errors**: `count()` grouped by `error.type`
   - **Affected Users**: `count_unique(user)` grouped by `error.type`
   - **Performance**: `p75(transaction.duration)`

**Alert Configuration**:

```yaml
# Sentry Alert Rules
- Name: "Beta Crash Rate > 2%"
  Conditions:
    - Crash-free sessions < 98%
    - Time window: 1 hour
  Actions:
    - Send email to team
    - Create Slack notification
    - Create PagerDuty incident (if critical)

- Name: "New Error Type Detected"
  Conditions:
    - New error type appears
    - Occurrences > 10 in 1 hour
  Actions:
    - Send email to team
    - Create GitHub issue

- Name: "Performance Degradation"
  Conditions:
    - p75 transaction duration > 2s
    - Time window: 1 hour
  Actions:
    - Send email to team
```

#### Release Tracking

**Configure Release in Sentry**:

```typescript
// apps/mobile/app.config.ts
export default {
  extra: {
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: "beta",
    release: process.env.EXPO_PUBLIC_APP_VERSION,
  },
};
```

**Track Releases**:

```bash
# After each beta build
npx @sentry/cli releases new $VERSION
npx @sentry/cli releases set-commits $VERSION --auto
npx @sentry/cli releases files $VERSION upload-sourcemaps ./dist
```

### 2. Google Analytics 4 (User Behavior)

#### Custom Events Setup

**Beta-Specific Events**:

```typescript
// Track beta-specific events
analytics.logEvent("beta_app_launch", {
  version: "1.0.0-beta",
  platform: "android",
});

analytics.logEvent("beta_feature_used", {
  feature: "matching",
  version: "1.0.0-beta",
});

analytics.logEvent("beta_feedback_submitted", {
  type: "bug_report",
  rating: 4,
});
```

**GA4 Dashboard Configuration**:

1. Go to GA4 → Explore → Create custom report
2. Add dimensions:
   - App version
   - Platform
   - User type (beta tester)
3. Add metrics:
   - Active users
   - Sessions
   - Crash-free users
   - Average session duration
   - Feature usage

**Custom Alerts**:

- **Low Engagement**: Active users < 50% of previous day
- **High Bounce Rate**: Bounce rate > 60%
- **Feature Adoption**: Feature usage < 10% of active users

### 3. Play Console Metrics

#### Key Metrics to Monitor

**Android Vitals**:

- Crash rate (target: < 1%)
- ANR rate (target: < 0.1%)
- Slow rendering (target: < 1%)
- Frozen frames (target: < 0.1%)

**User Feedback**:

- Review ratings (target: ≥ 4.0)
- Review volume
- Common complaints

**Performance**:

- App startup time
- Battery usage
- Network usage

#### Play Console Alerts

1. Go to Play Console → Alerts
2. Create alerts for:
   - Crash rate threshold
   - ANR rate threshold
   - Review rating drop
   - High uninstall rate

### 4. TestFlight Analytics (iOS)

#### Metrics to Track

**Install Metrics**:

- Install count
- Install rate
- Uninstall rate

**Usage Metrics**:

- Active testers
- Session count
- Average session duration

**Feedback**:

- Feedback submissions
- Crash reports
- Usage statistics

#### TestFlight Dashboard

1. Go to App Store Connect → TestFlight
2. Monitor:
   - Build status
   - Tester feedback
   - Crash reports
   - Usage statistics

## Daily Monitoring Checklist

### Morning Check (9 AM)

- [ ] Check Sentry for overnight errors
- [ ] Review Play Console crash reports
- [ ] Check GA4 for unusual activity
- [ ] Review user feedback (Play Console, TestFlight)
- [ ] Check alert notifications

### Afternoon Check (2 PM)

- [ ] Review midday metrics
- [ ] Check for new error types
- [ ] Monitor performance metrics
- [ ] Review user feedback

### End of Day (6 PM)

- [ ] Daily metrics summary
- [ ] Error trend analysis
- [ ] User feedback summary
- [ ] Prepare next day priorities

## Weekly Monitoring Report

### Metrics to Include

1. **Crash & Error Metrics**:
   - Total crashes
   - Crash-free sessions %
   - Top 5 errors
   - New error types

2. **Performance Metrics**:
   - Average app startup time
   - p75/p95 transaction duration
   - Memory usage
   - Battery impact

3. **User Engagement**:
   - Active users
   - Sessions per user
   - Feature adoption rates
   - User retention (Day 1, Day 7)

4. **Feedback Summary**:
   - Total feedback submissions
   - Average rating
   - Common themes
   - Action items

### Report Template

```markdown
# Open Beta Weekly Report - Week [X]

## Summary

- Active testers: [X]
- Crash-free sessions: [X]%
- Average rating: [X]/5.0

## Critical Issues

- [List P0/P1 issues]

## Performance

- App startup: [X]s (target: < 2s)
- p75 transaction: [X]ms (target: < 500ms)

## User Feedback

- Total submissions: [X]
- Average rating: [X]/5.0
- Top themes: [List]

## Action Items

- [List action items for next week]
```

## Alerting Configuration

### Sentry Alerts

**Critical Alerts** (Immediate Response):

- Crash rate > 5%
- New P0 error type
- Performance degradation > 50%

**Warning Alerts** (Review within 24h):

- Crash rate > 2%
- New error type
- Performance degradation > 20%

### GA4 Alerts

**User Engagement**:

- Active users drop > 30%
- Session duration drop > 20%
- Bounce rate increase > 10%

### Play Console Alerts

**Quality Metrics**:

- Crash rate > 2%
- ANR rate > 0.5%
- Review rating drop > 0.5 stars

## Troubleshooting Common Issues

### High Crash Rate

1. **Identify Root Cause**:
   - Check Sentry for top errors
   - Review crash logs
   - Check recent code changes

2. **Immediate Actions**:
   - Pause rollout if > 5%
   - Create hotfix if critical
   - Communicate to testers

3. **Long-term Fix**:
   - Fix root cause
   - Add tests
   - Improve error handling

### Performance Issues

1. **Identify Bottleneck**:
   - Check Sentry performance data
   - Review GA4 user flow
   - Analyze memory usage

2. **Optimization**:
   - Profile app performance
   - Optimize slow operations
   - Reduce bundle size

### Low User Engagement

1. **Analyze Behavior**:
   - Check GA4 user flows
   - Review feature usage
   - Analyze session patterns

2. **Improvements**:
   - Improve onboarding
   - Add feature tutorials
   - Fix usability issues

## Integration with CI/CD

### Automated Monitoring

**Post-Deploy Checks**:

```yaml
# .github/workflows/beta-deploy.yml
- name: Verify Deployment
  run: |
    # Wait for metrics to stabilize
    sleep 300
    # Check crash rate
    # Alert if > threshold
```

**Daily Health Check**:

```yaml
# .github/workflows/beta-health-check.yml
on:
  schedule:
    - cron: "0 9 * * *" # Daily at 9 AM

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Sentry Metrics
        run: |
          # Query Sentry API
          # Check crash rate
          # Create issue if threshold exceeded
```

## Best Practices

1. **Set Clear Thresholds**:
   - Define acceptable metrics ranges
   - Set alert thresholds
   - Document escalation procedures

2. **Regular Reviews**:
   - Daily monitoring checks
   - Weekly metrics review
   - Monthly trend analysis

3. **Quick Response**:
   - Respond to critical alerts within 1 hour
   - Acknowledge user feedback within 24 hours
   - Fix P0 issues within 48 hours

4. **Communication**:
   - Keep testers informed
   - Share weekly reports
   - Be transparent about issues

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
