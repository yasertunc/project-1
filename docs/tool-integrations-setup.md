# Tool Integrations & Accounts Setup Guide (18.x)

This guide covers setting up third-party tool integrations and accounts required for the Fellowus project.

## 18.1 Analytics Account & Token

### Google Analytics 4 (GA4)

1. **Create GA4 Property**:
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property for "Fellowus"
   - Note the Measurement ID (format: `G-XXXXXXXXXX`)

2. **Get API Credentials** (if using GA4 Reporting API):
   - Go to Google Cloud Console
   - Create a service account
   - Enable Google Analytics Reporting API
   - Download JSON key file

3. **Add to Environment Variables**:
   ```bash
   # Web
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   
   # Mobile (if using GA4 SDK)
   EXPO_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. **Add to GitHub Secrets** (if needed):
   - `GA4_MEASUREMENT_ID`
   - `GA4_SERVICE_ACCOUNT_JSON` (Base64 encoded)

### Alternative: PostHog, Mixpanel, Amplitude

If using alternative analytics:
- Follow provider's setup instructions
- Add API keys to environment variables
- Configure in app code

## 18.2 Sentry Account & DSN

### Create Sentry Account

1. **Sign Up**:
   - Go to [Sentry.io](https://sentry.io/signup/)
   - Create account or use existing organization

2. **Create Projects**:
   - **Web Project**: "fellowus-web" (or similar)
   - **Mobile Project**: "fellowus-mobile" (or similar)

3. **Get DSN**:
   - Go to Project Settings → Client Keys (DSN)
   - Copy the DSN for each project

4. **Create Auth Token**:
   - Go to Settings → Auth Tokens
   - Create new token with scopes:
     - `project:read`
     - `project:releases`
     - `org:read`
   - Copy the token (only shown once)

5. **Add to Environment Variables**:
   ```bash
   # Web
   VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
   
   # Mobile
   EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
   EXPO_PUBLIC_SENTRY_TRACES_RATE=0.1
   ```

6. **Add to GitHub Secrets**:
   - `SENTRY_AUTH_TOKEN` - Auth token for source map uploads
   - `SENTRY_ORG` - Sentry organization slug
   - `SENTRY_PROJECT` - Sentry project slug (for mobile)
   - `SENTRY_URL` - Sentry URL (default: https://sentry.io/)

7. **Configure Alerts**:
   - Set up alert rules in Sentry
   - Configure Slack/email notifications
   - Set up release tracking

## 18.5 Firebase (FCM) Setup

### Create Firebase Project

1. **Create Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name: "Fellowus"
   - Enable Google Analytics (optional)

2. **Add Android App**:
   - Click "Add app" → Android
   - Package name: `com.fellowus.app`
   - App nickname: "Fellowus Mobile"
   - Download `google-services.json`
   - Place in `apps/mobile/google-services.json`

3. **Add iOS App** (when ready):
   - Click "Add app" → iOS
   - Bundle ID: `com.fellowus.app`
   - Download `GoogleService-Info.plist`
   - Place in `apps/mobile/ios/GoogleService-Info.plist`

4. **Enable Cloud Messaging**:
   - Go to Project Settings → Cloud Messaging
   - Note the Server Key (for backend)
   - Note the Sender ID

5. **Get Server Key**:
   - Go to Project Settings → Cloud Messaging
   - Copy the Server Key (legacy)
   - Or create a new API key in Google Cloud Console

6. **Add to Environment Variables**:
   ```bash
   # Backend (for sending notifications)
   FCM_SERVER_KEY=your-server-key
   FCM_SENDER_ID=your-sender-id
   ```

7. **Add to GitHub Secrets**:
   - `FCM_SERVER_KEY` - Firebase Cloud Messaging server key
   - `GOOGLE_SERVICES_JSON_BASE64` - Base64 encoded `google-services.json`

8. **Upload to EAS** (for builds):
   ```bash
   cd apps/mobile
   npx eas env:create production GOOGLE_SERVICES_JSON --type file --visibility secret --non-interactive
   # Then upload the google-services.json file
   ```

## 18.7 App Store Connect Setup

### Create Organization (if needed)

1. **Access App Store Connect**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Sign in with Apple ID that has Developer Program access

2. **Create Organization** (if not individual):
   - Go to Users and Access
   - Create organization if needed
   - Add team members

3. **Create App**:
   - Go to My Apps → "+" → New App
   - Platform: iOS
   - Name: "Fellowus Mobile"
   - Primary Language: English
   - Bundle ID: `com.fellowus.app`
   - SKU: `fellowus-mobile-ios`

4. **Create API Key**:
   - Go to Users and Access → Keys
   - Click "+" to create new key
   - Name: "EAS Build Key"
   - Access: Admin or App Manager
   - Download `.p8` key file (only shown once)
   - Note the Key ID and Issuer ID

5. **Add to GitHub Secrets**:
   - `ASC_API_KEY_ID` - App Store Connect API Key ID
   - `ASC_ISSUER_ID` - App Store Connect Issuer ID
   - `ASC_API_KEY_P8` - Contents of the `.p8` file

6. **Configure in EAS**:
   - EAS will automatically use these secrets from GitHub
   - Or configure locally: `eas credentials`

## Verification Checklist

- [ ] Analytics account created and Measurement ID obtained
- [ ] Sentry account created, projects set up, DSN and auth token obtained
- [ ] Firebase project created, Android app added, `google-services.json` downloaded
- [ ] FCM Server Key obtained for backend
- [ ] App Store Connect organization/app created, API key generated
- [ ] All credentials added to GitHub Secrets
- [ ] Environment variables configured in `.env` files
- [ ] Alerts and notifications configured in Sentry
- [ ] Firebase Cloud Messaging enabled and tested

## Security Notes

- Never commit credentials to git
- Use GitHub Secrets for CI/CD
- Use environment variables for local development
- Rotate credentials periodically
- Use least-privilege access for service accounts
- Enable 2FA on all accounts

## Troubleshooting

### Sentry Source Maps Not Uploading

- Verify `SENTRY_AUTH_TOKEN` has correct scopes
- Check `SENTRY_ORG` and `SENTRY_PROJECT` are correct
- Ensure `sentry-expo` plugin is configured in `app.config.ts`

### Firebase Notifications Not Working

- Verify `google-services.json` is in correct location
- Check FCM Server Key is correct
- Ensure notification permissions are granted
- Test with Firebase Console → Cloud Messaging → Send test message

### App Store Connect API Errors

- Verify API key has correct permissions
- Check Key ID and Issuer ID are correct
- Ensure `.p8` file content is correct (no extra whitespace)
- Verify Apple Developer Program membership is active

