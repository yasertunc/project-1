# Fellowus Mobile

Expo React Native app for Android and iOS.

## Features

- ✅ Expo Router navigation (tabs + stack)
- ✅ NativeWind (Tailwind CSS for React Native)
- ✅ Push notifications (Expo Notifications + FCM)
- ✅ Sentry error reporting
- ✅ Design tokens integration
- ✅ TypeScript strict mode
- ✅ Accessibility (a11y) support

## Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment:**

Copy `env.example` to `.env` and fill in the values:

```bash
cp env.example .env
```

Required environment variables:

- `EXPO_PUBLIC_APP_NAME` – App display name
- `EXPO_PUBLIC_APP_SLUG` – Expo slug
- `EXPO_PUBLIC_EXPO_OWNER` – Expo account owner
- `EXPO_ANDROID_PACKAGE` – Android package ID (e.g., `com.fellowus.app`)
- `EXPO_IOS_BUNDLE_ID` – iOS bundle ID (e.g., `com.fellowus.app`)
- `EXPO_PUBLIC_NOTIFICATIONS_REGISTER_URL` – Backend endpoint for push token registration
- `EXPO_PUBLIC_SENTRY_DSN` – Sentry DSN for error reporting
- `GOOGLE_SERVICES_JSON` – Path to `google-services.json` (for FCM)

3. **Start development server:**

```bash
npm run start
```

## Scripts

- `npm run start` – Start Expo dev server
- `npm run android` – Run on Android device/emulator
- `npm run ios` – Run on iOS device/simulator
- `npm run typecheck` – TypeScript type checking
- `npm run lint` – Lint code (currently skipped for MVP)

## Building

### Development Build

```bash
eas build --profile development --platform android
```

### Production Build

```bash
eas build --profile production --platform android
```

For iOS:

```bash
eas build --profile production-ios --platform ios
```

## Project Structure

```
apps/mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── messages/[id].tsx  # Dynamic route
│   └── _layout.tsx        # Root layout
├── src/
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities (Sentry, etc.)
│   ├── services/          # API services
│   └── theme/             # Design tokens
├── assets/                # Images, icons
├── app.config.ts          # Expo configuration
├── eas.json               # EAS Build configuration
└── babel.config.js        # Babel configuration
```

## Configuration

### App Config

`app.config.ts` is environment-driven. See `env.example` for all available variables.

### EAS Build

`eas.json` contains build profiles:

- `development` – Development client with debugging
- `preview` – Internal distribution (APK)
- `production` – Production builds (AAB for Android)

### Design Tokens

Design tokens are generated from `src/tokens/tokens_fellowus_v1.json` and available in:

- `src/theme/tokens.ts` (TypeScript)
- `src/theme/tokens.js` (JavaScript, for Tailwind config)

## Push Notifications

Push notifications are automatically registered when:

1. User grants notification permission
2. `EXPO_PUBLIC_NOTIFICATIONS_REGISTER_URL` is configured
3. App receives Expo push token

See `src/hooks/useNotifications.ts` for implementation details.

## Error Reporting

Sentry is automatically initialized if `EXPO_PUBLIC_SENTRY_DSN` is set. See `src/lib/sentry.ts`.

## Testing

### Detox (E2E)

```bash
npm run detox:build:android
npm run detox:test:android
```

## Troubleshooting

### Build Issues

- Ensure all environment variables are set
- Check `google-services.json` is present (for Android)
- Verify EAS credentials: `eas credentials`

### Type Errors

- Run `npm run typecheck` to see all errors
- Ensure `tsconfig.json` includes all source directories

### Metro Bundler Issues

- Clear cache: `npm run start -- --clear`
- Reset Metro: `npx expo start -c`

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
