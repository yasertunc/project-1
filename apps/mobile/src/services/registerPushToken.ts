import { Platform } from "react-native";
import Constants from "expo-constants";

type RegisterEndpoint = {
  notifications?: {
    registerEndpoint?: string;
  };
};

type RegistrationResult =
  | { status: "registered" }
  | { status: "skipped"; reason: string };

function resolveRegisterEndpoint(): string | undefined {
  const candidates: Array<RegisterEndpoint | undefined | null> = [
    (Constants.expoConfig?.extra as RegisterEndpoint | undefined) ?? undefined,
    (Constants.manifest2?.extra as RegisterEndpoint | undefined) ?? undefined,
    (Constants.manifest as RegisterEndpoint | undefined) ?? undefined,
  ];

  for (const extra of candidates) {
    const endpoint = extra?.notifications?.registerEndpoint;
    if (endpoint) {
      return endpoint;
    }
  }

  return undefined;
}

/**
 * Registers an Expo push token with the backend notification service.
 *
 * This function sends the device's push token and metadata to the backend
 * endpoint configured via `EXPO_PUBLIC_NOTIFICATIONS_REGISTER_URL` in app.config.ts.
 *
 * @param pushToken - Expo push token string
 * @returns Registration result indicating success or skip reason
 * @throws Error if registration fails (non-2xx response)
 *
 * @example
 * ```ts
 * const token = await Notifications.getExpoPushTokenAsync();
 * const result = await registerPushToken(token.data);
 * if (result.status === 'registered') {
 *   console.log('Token registered successfully');
 * }
 * ```
 */
export async function registerPushToken(
  pushToken: string
): Promise<RegistrationResult> {
  const endpoint = resolveRegisterEndpoint();

  if (!endpoint) {
    return {
      status: "skipped",
      reason: "Notification register endpoint missing in expo config",
    };
  }

  const payload = {
    token: pushToken,
    platform: Platform.OS,
    appVersion: Constants.expoConfig?.version,
    deviceName: Constants.deviceName,
    channel: "expo",
    registeredAt: new Date().toISOString(),
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Push token registration failed (${response.status}): ${message || "unknown error"}`
    );
  }

  return { status: "registered" };
}
