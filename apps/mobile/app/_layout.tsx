import "react-native-reanimated";
// import "../src/lib/sentry"; // Temporarily disabled - Sentry removed due to RCT-Folly dependency issue
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";

import "../global.css";
import { palette } from "../src/theme/tokens";
import { useNotifications } from "../src/hooks/useNotifications";
import { ErrorBoundary } from "../src/components/ErrorBoundary";

function NotificationBootstrap() {
  const { pushToken, permissionStatus, error } = useNotifications();

  useEffect(() => {
    if (pushToken && __DEV__) {
      console.log("Expo push token:", pushToken);
    }
  }, [pushToken]);

  useEffect(() => {
    if (error && __DEV__) {
      console.warn("Notification setup error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (permissionStatus && permissionStatus !== "granted" && __DEV__) {
      console.log("Notification permission status:", permissionStatus);
    }
  }, [permissionStatus]);

  return null;
}

export default function Layout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NotificationBootstrap />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.background.light },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="messages/[id]"
            options={{
              title: "Chat",
              presentation: "card",
              headerStyle: {
                backgroundColor: palette.surface.white,
              },
              headerTitleStyle: {
                color: palette.text.primary,
                fontSize: 18,
                fontWeight: "700" as const,
              },
              headerTintColor: palette.primary.main,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
