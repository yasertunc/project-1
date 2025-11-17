import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { registerPushToken } from "../services/registerPushToken";

type PermissionStatus = Notifications.PermissionStatus | "unavailable";

type NotificationState = {
  pushToken?: string;
  permissionStatus: PermissionStatus;
  lastNotification?: Notifications.Notification;
  registrationStatus?: "pending" | "registered" | "skipped";
  error?: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#667eea",
    showBadge: true,
  });
}

/**
 * React hook for managing push notification permissions and token registration.
 *
 * Automatically requests permissions, retrieves the Expo push token, and registers
 * it with the backend when available. Handles permission states and errors.
 *
 * @returns Object containing:
 *   - `pushToken`: Current Expo push token (null if not available)
 *   - `permissionStatus`: Current permission status ('granted' | 'denied' | 'undetermined')
 *   - `error`: Any error that occurred during setup
 *   - `registrationStatus`: Status of backend token registration ('idle' | 'pending' | 'success' | 'error')
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { pushToken, permissionStatus } = useNotifications();
 *   if (permissionStatus === 'granted' && pushToken) {
 *     console.log('Push token:', pushToken);
 *   }
 * }
 * ```
 */
export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    permissionStatus: "unavailable",
  });
  const lastRegisteredToken = useRef<string | undefined>(undefined);

  const registerAsync = useCallback(async () => {
    try {
      await ensureAndroidChannel();

      if (!Device.isDevice) {
        setState((prev) => ({
          ...prev,
          error: "Push notifications require a physical device.",
          permissionStatus: "unavailable",
        }));
        return;
      }

      const existingStatus = await (
        Notifications.getPermissionsAsync as unknown as () => Promise<{
          status: PermissionStatus;
        }>
      )();
      let finalStatus = existingStatus.status;

      if (existingStatus.status !== "granted") {
        const requestStatus = await (
          Notifications.requestPermissionsAsync as unknown as () => Promise<{
            status: PermissionStatus;
          }>
        )();
        finalStatus = requestStatus.status;
      }

      if (finalStatus !== "granted") {
        setState((prev) => ({
          ...prev,
          permissionStatus: finalStatus,
          error: "Notification permission not granted.",
        }));
        return;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        setState((prev) => ({
          ...prev,
          permissionStatus: finalStatus,
          error: "Expo project ID missing; cannot request push token.",
        }));
        return;
      }

      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      setState((prev) => ({
        ...prev,
        permissionStatus: finalStatus,
        pushToken: tokenResponse.data,
        error: undefined,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  }, []);

  useEffect(() => {
    registerAsync();
  }, [registerAsync]);

  useEffect(() => {
    if (!state.pushToken) return;
    if (lastRegisteredToken.current === state.pushToken) return;

    const currentToken = state.pushToken;
    let isMounted = true;

    setState((prev) => ({
      ...prev,
      registrationStatus: "pending",
    }));

    registerPushToken(currentToken)
      .then((result) => {
        if (!isMounted) return;

        if (result.status === "skipped") {
          console.info("Push token registration skipped:", result.reason);
        }

        lastRegisteredToken.current = currentToken;

        setState((prev) => ({
          ...prev,
          registrationStatus: result.status,
        }));
      })
      .catch((error) => {
        if (!isMounted) return;
        lastRegisteredToken.current = undefined;
        setState((prev) => ({
          ...prev,
          registrationStatus: undefined,
          error: error instanceof Error ? error.message : String(error),
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [state.pushToken]);

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        setState((prev) => ({
          ...prev,
          lastNotification: notification,
        }));
      }
    );

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (__DEV__) {
          console.log("Notification response", response);
        }
      }
    );

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  const requestPermission = useCallback(async () => {
    await registerAsync();
  }, [registerAsync]);

  return useMemo(
    () => ({
      ...state,
      requestPermission,
    }),
    [state, requestPermission]
  );
}
