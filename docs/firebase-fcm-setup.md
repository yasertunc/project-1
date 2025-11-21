# Firebase Cloud Messaging (FCM) Setup Guide (9.8, 18.5)

This guide covers setting up Firebase Cloud Messaging for push notifications in the Fellowus mobile app.

## Overview

Firebase Cloud Messaging (FCM) enables push notifications for Android and iOS. This guide covers the complete setup process.

## Prerequisites

- Firebase account
- Google account
- Android app package: `com.fellowus.app`
- iOS bundle ID: `com.fellowus.app` (when ready)

## Step 1: Create Firebase Project

1. **Go to Firebase Console**:
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" or "Create a project"

2. **Project Details**:
   - Project name: "Fellowus"
   - Enable Google Analytics (optional, recommended)
   - Select Analytics account (or create new)

3. **Create Project**:
   - Click "Create project"
   - Wait for project creation (takes a few minutes)

## Step 2: Add Android App

1. **Add Android App**:
   - In Firebase project, click "Add app" → Android icon
   - Package name: `com.fellowus.app`
   - App nickname: "Fellowus Mobile" (optional)
   - Debug signing certificate SHA-1 (optional, for Firebase Auth)

2. **Download `google-services.json`**:
   - Click "Download google-services.json"
   - Save the file

3. **Place File in Project**:

   ```bash
   # Copy to mobile app directory
   cp ~/Downloads/google-services.json apps/mobile/google-services.json
   ```

4. **Register App**:
   - Click "Next" → "Continue to console"

## Step 3: Add iOS App (When Ready)

1. **Add iOS App**:
   - In Firebase project, click "Add app" → iOS icon
   - Bundle ID: `com.fellowus.app`
   - App nickname: "Fellowus Mobile iOS" (optional)
   - App Store ID: (leave empty for now)

2. **Download `GoogleService-Info.plist`**:
   - Click "Download GoogleService-Info.plist"
   - Save the file

3. **Place File in Project**:

   ```bash
   # Copy to iOS directory (when iOS project is generated)
   cp ~/Downloads/GoogleService-Info.plist apps/mobile/ios/GoogleService-Info.plist
   ```

4. **Register App**:
   - Click "Next" → "Continue to console"

## Step 4: Enable Cloud Messaging

1. **Navigate to Cloud Messaging**:
   - In Firebase Console, go to Project Settings
   - Click "Cloud Messaging" tab

2. **Note Server Key**:
   - Copy the "Server key" (legacy) - you'll need this for backend
   - Copy the "Sender ID" - you'll need this for backend

3. **Enable Cloud Messaging API** (if needed):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select Firebase project
   - Enable "Cloud Messaging API" if not already enabled

## Step 5: Configure Backend

### Get Server Key

**Option A: Legacy Server Key** (Easiest)

1. Firebase Console → Project Settings → Cloud Messaging
2. Copy "Server key" (legacy)

**Option B: Service Account** (Recommended for production)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select Firebase project
3. Go to IAM & Admin → Service Accounts
4. Create new service account or use existing
5. Grant "Firebase Cloud Messaging API Admin" role
6. Create JSON key and download

### Add to Environment Variables

```bash
# Backend .env
FCM_SERVER_KEY=your-server-key-here
FCM_SENDER_ID=your-sender-id-here
```

### Add to GitHub Secrets

```bash
# For CI/CD
FCM_SERVER_KEY=your-server-key-here
FCM_SENDER_ID=your-sender-id-here
```

## Step 6: Upload to EAS (for Builds)

Since `google-services.json` is git-ignored, upload it to EAS:

```bash
cd apps/mobile

# Create file secret in EAS
npx eas env:create production GOOGLE_SERVICES_JSON \
  --type file \
  --visibility secret \
  --non-interactive

# Follow prompts to upload google-services.json file
```

Or use base64 encoding:

```bash
# Encode file to base64
cat google-services.json | base64

# Add to GitHub Secrets
GOOGLE_SERVICES_JSON_BASE64=<base64-encoded-content>
```

## Step 7: Configure App

### Android Configuration

The `google-services.json` file is already configured in `app.config.ts`:

```typescript
android: {
  googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
}
```

### iOS Configuration (When Ready)

Add to `app.config.ts`:

```typescript
ios: {
  googleServicesFile: "./ios/GoogleService-Info.plist",
}
```

## Step 8: Test Push Notifications

### Test from Firebase Console

1. **Go to Cloud Messaging**:
   - Firebase Console → Cloud Messaging
   - Click "Send your first message"

2. **Compose Message**:
   - Notification title: "Test Notification"
   - Notification text: "This is a test"
   - Target: Single device
   - FCM registration token: (get from app logs)

3. **Send Test**:
   - Click "Test" → Enter FCM token
   - Click "Test" to send

### Test from Backend

Use FCM REST API or Admin SDK:

```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "FCM_REGISTRATION_TOKEN",
    "notification": {
      "title": "Test",
      "body": "This is a test notification"
    }
  }'
```

## Step 9: Backend Integration

### Send Notification Endpoint

Create backend endpoint to send notifications:

```typescript
// Example: POST /api/notifications/send
{
  "token": "expo-push-token",
  "title": "New Match",
  "body": "You have a new match!",
  "data": {
    "matchId": "123",
    "type": "match_found"
  }
}
```

### Backend Implementation

Use FCM Admin SDK or REST API:

```typescript
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(token: string, payload: any) {
  const message = {
    token,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data,
  };

  try {
    const response = await admin.messaging().send(message);
    return { success: true, messageId: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Verification Checklist

- [ ] Firebase project created
- [ ] Android app added to Firebase
- [ ] `google-services.json` downloaded and placed in project
- [ ] Cloud Messaging enabled
- [ ] Server key obtained
- [ ] Server key added to backend environment variables
- [ ] `google-services.json` uploaded to EAS (or GitHub Secrets)
- [ ] App configured to use `google-services.json`
- [ ] Push token registration working
- [ ] Test notification sent successfully
- [ ] Backend endpoint created for sending notifications

## Troubleshooting

### Notifications Not Received

**Check**:

- `google-services.json` is in correct location
- Package name matches Firebase project
- Notification permissions granted
- FCM token is valid
- Server key is correct
- Backend endpoint is working

### Build Errors

**Error**: "google-services.json is missing"

- **Solution**: Upload to EAS or add to GitHub Secrets

**Error**: "Package name mismatch"

- **Solution**: Verify package name in Firebase matches `app.config.ts`

### Token Registration Fails

**Check**:

- Firebase project is active
- Cloud Messaging API is enabled
- Network connectivity
- App permissions

## Security Best Practices

1. **Never commit `google-services.json`** to git (already in `.gitignore`)
2. **Use service account** for production backend (not legacy server key)
3. **Rotate server keys** periodically
4. **Limit server key access** to backend only
5. **Use HTTPS** for all API calls
6. **Validate tokens** on backend before sending

## Next Steps

After FCM setup:

1. Implement backend notification sending
2. Add notification handling in app
3. Test on physical devices
4. Set up notification analytics
5. Configure notification channels (Android)
6. Add notification preferences UI

## Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Expo Notifications Documentation](https://docs.expo.dev/push-notifications/overview/)
- [FCM REST API](https://firebase.google.com/docs/cloud-messaging/http-server-ref)
- [FCM Admin SDK](https://firebase.google.com/docs/cloud-messaging/admin/send-messages)
