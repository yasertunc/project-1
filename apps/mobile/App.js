import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeWindStyleSheet } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, Pressable } from "react-native";

import { palette } from "./src/theme/tokens";
import "./global.css";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.muted["50"],
    card: palette.surface,
    primary: palette.primary["600"],
    border: "rgba(148, 163, 184, 0.2)",
    text: palette.ink["900"],
  },
};

const steps = [
  {
    title: "Pick filters",
    description:
      "Select intents, guardrails, and pacing so every match aligns with why you showed up.",
  },
  {
    title: "Match anonymously",
    description:
      "Join using lightweight handles. You stay private until you decide otherwise.",
  },
  {
    title: "Chat safely",
    description:
      "Use built-in guardrails, report flows, and automated tips to keep rooms respectful.",
  },
];

const heroHighlights = [
  "Anonymous IDs keep the conversation focused on intent.",
  "Quick-report flows surface moderation in seconds.",
  "Live translations and theme toggles keep rooms inclusive.",
];

function HeroCard({ onExplore, onHowItWorks }) {
  return (
    <View className="mb-6 rounded-3xl bg-primary-600 px-6 py-8 shadow-lg">
      <Text className="text-sm font-semibold uppercase tracking-wide text-white/80">
        Fellowus
      </Text>
      <Text className="mt-3 text-3xl font-bold text-white">
        Connect anonymously, speak freely.
      </Text>
      <Text className="mt-3 text-white/80">
        Meet people in seconds, stay in control with guardrails that keep every
        room safe.
      </Text>
      <View className="mt-6 flex-row flex-wrap gap-3">
        <CTAButton
          label="Get Started"
          emphasis="primary"
          onPress={onExplore}
        />
        <CTAButton label="How It Works" onPress={onHowItWorks} />
      </View>
    </View>
  );
}

function CTAButton({ label, onPress, emphasis = "secondary" }) {
  const isPrimary = emphasis === "primary";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`rounded-full px-6 py-3 ${
        isPrimary
          ? "bg-white"
          : "border border-white/60 bg-transparent"
      }`}
    >
      <Text
        className={`font-semibold ${
          isPrimary ? "text-primary-600" : "text-white"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function InsightCard({ title, description }) {
  return (
    <View className="rounded-3xl border border-muted-100 bg-surface px-5 py-6">
      <Text className="text-lg font-semibold text-ink-900">{title}</Text>
      <Text className="mt-2 text-ink-500">{description}</Text>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const parentNavigation = navigation.getParent();
  return (
    <SafeAreaView className="flex-1 bg-muted-50">
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={{ padding: 20, gap: 16 }}
      >
        <HeroCard
          onExplore={() => parentNavigation?.navigate("FlowDetails")}
          onHowItWorks={() => navigation.navigate("HowItWorks")}
        />
        <View className="gap-3">
          {heroHighlights.map((highlight) => (
            <View
              key={highlight}
              className="flex-row items-start gap-3 rounded-3xl border border-muted-100 bg-surface px-5 py-4"
            >
              <View className="mt-1 h-2 w-2 rounded-full bg-accent-amber-500" />
              <Text className="flex-1 text-base text-ink-700">{highlight}</Text>
            </View>
          ))}
        </View>
        <Pressable
          onPress={() => parentNavigation?.navigate("FlowDetails")}
          className="rounded-3xl border border-primary-600 bg-transparent px-6 py-4"
        >
          <Text className="text-center font-semibold text-primary-600">
            Explore guardrail flow
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function HowItWorksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-muted-50">
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={{ padding: 20, gap: 16 }}
      >
        <Text className="text-sm font-semibold uppercase tracking-wide text-primary-600">
          How it works
        </Text>
        <Text className="text-3xl font-bold text-ink-900">
          Three easy steps to start talking
        </Text>
        <Text className="text-base text-ink-500">
          Fellowus helps you decide who you want to meet, keeps the match
          anonymous, and protects the room once you’re in.
        </Text>
        <View className="gap-4">
          {steps.map((step, index) => (
            <View
              key={step.title}
              className="rounded-3xl border border-muted-100 bg-surface px-5 py-6"
            >
              <Text className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                Step {index + 1}
              </Text>
              <Text className="mt-2 text-xl font-semibold text-ink-900">
                {step.title}
              </Text>
              <Text className="mt-2 text-ink-500">{step.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-muted-50">
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={{ padding: 20, gap: 16 }}
      >
        <Text className="text-3xl font-bold text-ink-900">Quick toggles</Text>
        <InsightCard
          title="Language Packs"
          description="English (default), Turkish, Arabic, Russian. Auto-detect respects device locale."
        />
        <InsightCard
          title="Safety Signals"
          description="Moderation overlays, quick report flows, and session-based guardrails."
        />
        <InsightCard
          title="Notifications"
          description="Expo push notifications will surface when a match requests to continue."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function FlowDetailsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-muted-50">
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={{ padding: 20, gap: 16 }}
      >
        <Text className="text-3xl font-bold text-ink-900">
          Guardrails & moderation
        </Text>
        <Text className="text-base text-ink-500">
          Channel FSM monitors open rooms, throttles notifications, and raises
          moderation events if a report is filed. Mobile clients mirror the web
          flow with Expo push notifications.
        </Text>
        <InsightCard
          title="Session pacing"
          description="Room timers and heartbeat pings ensure conversations stay fresh without lingering idle states."
        />
        <InsightCard
          title="Escalation path"
          description="Safety triggers propagate to the Matching service and notify the trust & safety dashboard."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function TabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary["600"],
        tabBarInactiveTintColor: palette.ink["500"],
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: "rgba(148, 163, 184, 0.2)",
          paddingVertical: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="HowItWorks" component={HowItWorksScreen} options={{ title: "How it works" }} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={TabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FlowDetails"
          component={FlowDetailsScreen}
          options={{ title: "Guardrails" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
