import type { ConfigContext, ExpoConfig } from "expo/config";
import "dotenv/config";

const DEFAULT_PROJECT_ID = "694fc69a-a332-4142-9a41-54012868a73b";
const DEFAULT_APP_NAME = "Fellowus Mobile";
const DEFAULT_SLUG = "fellowus-mobile";
const DEFAULT_OWNER = "yasertunc";
const DEFAULT_VERSION = "1.0.0";
const DEFAULT_PACKAGE = "com.fellowus.app";
const DEFAULT_DOWNLOAD_URL = "https://www.fellowus.com/download";
const DEFAULT_NOTIFICATION_ICON = "./assets/icon.png";
const DEFAULT_NOTIFICATION_COLOR = "#667eea";
// Sentry constants - currently unused but kept for future use
// const DEFAULT_SENTRY_ORG = "fellowus";
// const DEFAULT_SENTRY_PROJECT = "fellowus-mobile";
// const DEFAULT_SENTRY_URL = "https://sentry.io/";

type ExpoPlugin = NonNullable<ExpoConfig["plugins"]>[number];

export default function createExpoConfig({
  config,
}: ConfigContext): ExpoConfig {
  const version = process.env.EXPO_PUBLIC_APP_VERSION ?? DEFAULT_VERSION;
  // Sentry temporarily disabled due to RCT-Folly dependency issue
  // Will be re-enabled once Sentry is updated to compatible version
  const sentryConfig: ExpoPlugin | null = null;
  // const sentryConfig: ExpoPlugin | null =
  //   process.env.SENTRY_AUTH_TOKEN &&
  //   process.env.SENTRY_ORG &&
  //   process.env.SENTRY_PROJECT
  //     ? ([
  //         "sentry-expo",
  //         {
  //           organization: process.env.SENTRY_ORG ?? DEFAULT_SENTRY_ORG,
  //           project: process.env.SENTRY_PROJECT ?? DEFAULT_SENTRY_PROJECT,
  //           url: process.env.SENTRY_URL ?? DEFAULT_SENTRY_URL,
  //           authToken: process.env.SENTRY_AUTH_TOKEN,
  //           deployEnv:
  //             process.env.SENTRY_ENV ??
  //             process.env.EAS_BUILD_PROFILE ??
  //             "development",
  //         },
  //       ] as ExpoPlugin)
  //     : null;

  const googleServicesFile =
    process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json";

  return {
    ...config,
    name: process.env.EXPO_PUBLIC_APP_NAME ?? DEFAULT_APP_NAME,
    slug: process.env.EXPO_PUBLIC_APP_SLUG ?? DEFAULT_SLUG,
    owner: process.env.EXPO_PUBLIC_EXPO_OWNER ?? DEFAULT_OWNER,
    version,
    scheme: "fellowus",
    runtimeVersion: { policy: "appVersion" },
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: process.env.EXPO_IOS_BUNDLE_ID ?? DEFAULT_PACKAGE,
      buildNumber: process.env.EXPO_IOS_BUILD_NUMBER ?? version,
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        NSUserTrackingUsageDescription:
          "This app does not track you across other apps and websites.",
      },
    },
    android: {
      package: process.env.EXPO_ANDROID_PACKAGE ?? DEFAULT_PACKAGE,
      versionCode: Number(process.env.EXPO_ANDROID_VERSION_CODE ?? "1"),
      googleServicesFile,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["NOTIFICATIONS"],
      playStoreUrl:
        process.env.EXPO_ANDROID_PLAY_STORE_URL ??
        "https://play.google.com/store/apps/details?id=com.fellowus.app",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-notifications",
        {
          icon:
            process.env.EXPO_NOTIFICATIONS_ICON ?? DEFAULT_NOTIFICATION_ICON,
          color:
            process.env.EXPO_NOTIFICATIONS_COLOR ?? DEFAULT_NOTIFICATION_COLOR,
          sounds: [],
        },
      ],
      ...(sentryConfig ? [sentryConfig] : []),
    ],
    extra: {
      ...(config.extra ?? {}),
      router: config.extra?.router ?? {},
      downloadUrl: process.env.EXPO_PUBLIC_DOWNLOAD_URL ?? DEFAULT_DOWNLOAD_URL,
      notifications: {
        registerEndpoint:
          process.env.EXPO_PUBLIC_NOTIFICATIONS_REGISTER_URL ?? "",
      },
      monitoring: {
        sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? "",
        tracesSampleRate: Number(
          process.env.EXPO_PUBLIC_SENTRY_TRACES_RATE ?? "0.1"
        ),
      },
      privacyPolicyUrl:
        process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ??
        "https://www.fellowus.com/privacy",
      termsOfServiceUrl:
        process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_URL ??
        "https://www.fellowus.com/terms",
      eas: {
        projectId: process.env.EAS_PROJECT_ID ?? DEFAULT_PROJECT_ID,
      },
    },
    experiments: {
      typedRoutes: true,
    },
  };
}
