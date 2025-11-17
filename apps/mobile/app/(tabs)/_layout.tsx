import { Tabs } from "expo-router";
import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { palette } from "../../src/theme/tokens";

const activeTint = palette.primary.main;
const inactiveTint = palette.text.secondary;
const borderColor = palette.background.medium;
const backgroundColor = palette.surface.white;

function iconName(routeName: string, focused: boolean) {
  switch (routeName) {
    case "index":
      return focused ? "chatbubbles" : "chatbubbles-outline";
    case "discover":
      return focused ? "sparkles" : "sparkles-outline";
    case "safety":
      return focused ? "shield" : "shield-outline";
    case "profile":
      return focused ? "person" : "person-outline";
    default:
      return focused ? "ellipse" : "ellipse-outline";
  }
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: borderColor,
          paddingTop: Platform.select({ ios: 8, default: 4 }),
          paddingBottom: Platform.select({ ios: 14, default: 8 }),
          height: Platform.select({ ios: 84, default: 70 }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            name={iconName(route.name, focused)}
            color={color}
            size={size}
            accessibilityLabel={`${route.name} tab${focused ? ", selected" : ""}`}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          title: "Safety",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
