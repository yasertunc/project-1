import { ScrollView, Text, View } from "react-native";

import { nativeTokens } from "../../src/theme/tokens";

const SPOTLIGHT = [
  {
    title: "Intent Filters",
    description:
      "Tailor your match queue with intents like mentorship, co-founding, or casual chat.",
  },
  {
    title: "VIP Lounges",
    description:
      "Exclusive rooms monitored 24/7 with priority moderation and instant translation.",
  },
  {
    title: "Safety Tours",
    description:
      "Guided onboarding that reminds every participant of the shared rules.",
  },
];

const DISCOVERIES = [
  {
    emoji: "💡",
    headline: "Anonymous meetups starting soon",
    body: "Pick an intent, set your guardrails, and queue up for time-boxed conversations.",
  },
  {
    emoji: "🌍",
    headline: "Global language rooms",
    body: "Instant translation and transcription keep rooms accessible wherever you connect from.",
  },
  {
    emoji: "🛡️",
    headline: "Safe defaults first",
    body: "No screenshots, no DMs without consent, and every chat starts with community guardrails.",
  },
];

export default function DiscoverTab() {
  const palette = nativeTokens.palette;
  const spacing = nativeTokens.spacing;
  const radius = nativeTokens.radius;

  return (
    <ScrollView
      className="flex-1"
      style={{
        backgroundColor: palette.background.light,
        paddingHorizontal: spacing?.xl ?? 24,
        paddingTop: spacing?.xl ?? 24,
        paddingBottom: spacing?.xxl ?? 32,
      }}
    >
      <View>
        <Text
          className="text-xs font-semibold uppercase tracking-[0.32em]"
          style={{ color: palette.primary.main }}
        >
          Discover
        </Text>
        <Text
          className="mt-2 text-3xl font-bold"
          style={{ color: palette.text.primary }}
        >
          Spaces that match your intent
        </Text>
        <Text
          className="mt-3 text-sm leading-6"
          style={{ color: palette.text.secondary }}
        >
          Fellowus curates anonymous rooms aligned with your goals. The more you
          filter, the smarter the queue becomes.
        </Text>
      </View>

      <View
        className="mt-8 rounded-3xl"
        style={{
          backgroundColor: palette.surface.white,
          borderRadius: typeof radius?.xxl === "number" ? radius.xxl : 25,
          padding: spacing?.xl ?? 24,
          borderWidth: 1,
          borderColor: palette.background.medium,
        }}
      >
        <Text
          className="text-sm font-semibold uppercase tracking-[0.24em]"
          style={{ color: palette.text.secondary }}
        >
          Spotlight
        </Text>
        {SPOTLIGHT.map((item, index) => (
          <View
            key={item.title}
            style={{
              marginTop:
                index === 0 ? (spacing?.md ?? 16) : (spacing?.md ?? 16),
            }}
          >
            <Text
              className="text-lg font-semibold"
              style={{ color: palette.text.primary }}
            >
              {item.title}
            </Text>
            <Text
              className="mt-2 text-sm leading-6"
              style={{ color: palette.text.secondary }}
            >
              {item.description}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-10">
        {DISCOVERIES.map((entry, index) => (
          <View
            key={entry.headline}
            className="flex-row items-start"
            style={{
              marginTop: index === 0 ? 0 : (spacing?.lg ?? 16),
            }}
          >
            <Text style={{ fontSize: 28, marginRight: spacing?.md ?? 12 }}>
              {entry.emoji}
            </Text>
            <View
              className="flex-1 rounded-3xl"
              style={{
                backgroundColor: palette.surface.white,
                borderRadius:
                  typeof radius?.lg === "number" ? radius.lg : 16,
                padding: spacing?.lg ?? 16,
                borderWidth: 1,
                borderColor: palette.background.medium,
              }}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: palette.text.primary }}
              >
                {entry.headline}
              </Text>
              <Text
                className="mt-2 text-sm leading-6"
                style={{ color: palette.text.secondary }}
              >
                {entry.body}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
