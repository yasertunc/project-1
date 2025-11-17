import Constants from "expo-constants";
import * as Sentry from "sentry-expo";

const SENTRY_DSN =
  process.env.EXPO_PUBLIC_SENTRY_DSN ??
  (Constants.expoConfig?.extra as { monitoring?: { sentryDsn?: string } })
    ?.monitoring?.sentryDsn;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: true,
    debug: __DEV__,
    tracesSampleRate:
      Number(
        process.env.EXPO_PUBLIC_SENTRY_TRACES_RATE ??
          (
            Constants.expoConfig?.extra as {
              monitoring?: { tracesSampleRate?: number };
            }
          )?.monitoring?.tracesSampleRate ??
          0.1
      ) || 0.1,
  });
}

export { Sentry };
