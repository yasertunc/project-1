import { ScrollView, Text, View } from "react-native";

import { nativeTokens } from "../../src/theme/tokens";

const SAFETY_CARDS = [
  {
    title: "Guardrails",
    items: [
      "Reported users are escalated to a human moderator in < 15 minutes.",
      "AI filters block disallowed content before it reaches you.",
      "Screenshots and screen recordings trigger auto-blur notifications.",
    ],
  },
  {
    title: "Controls",
    items: [
      "Tap hold to mute or remove any participant instantly.",
      "Add co-hosts that help moderate active rooms in real time.",
      "Publish room rules so everyone sees expectations up front.",
    ],
  },
  {
    title: "Support",
    items: [
      "Round-the-clock help desk for urgent incidents.",
      "Automated follow-ups for any reported conversation.",
      "Privacy center explains what’s anonymous and what’s shared.",
    ],
  },
];

export default function SafetyTab() {
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
          Safety
        </Text>
        <Text
          className="mt-2 text-3xl font-bold"
          style={{ color: palette.text.primary }}
        >
          Always-on protections
        </Text>
        <Text
          className="mt-3 text-sm leading-6"
          style={{ color: palette.text.secondary }}
        >
          The Fellowus trust stack is active in every conversation. Your
          identity, content, and comfort are always prioritized.
        </Text>
      </View>

      <View className="mt-8">
        {SAFETY_CARDS.map((block, index) => (
          <View
            key={block.title}
            className="rounded-3xl"
            style={{
              backgroundColor: palette.surface.white,
              borderRadius:
                typeof radius?.xxl === "number" ? radius.xxl : 25,
              padding: spacing?.xl ?? 24,
              borderWidth: 1,
              borderColor: palette.background.medium,
              marginTop: index === 0 ? 0 : (spacing?.lg ?? 16),
            }}
          >
            <Text
              className="text-lg font-semibold"
              style={{ color: palette.text.primary }}
            >
              {block.title}
            </Text>
            {block.items.map((item) => (
              <View
                key={item}
                className="flex-row items-start"
                style={{ marginTop: spacing?.sm ?? 8 }}
              >
                <Text style={{ color: palette.primary.main, marginRight: 12 }}>
                  •
                </Text>
                <Text
                  className="flex-1 text-sm leading-6"
                  style={{ color: palette.text.secondary }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View
        className="mt-10 rounded-3xl"
        style={{
          backgroundColor: palette.primary.main,
          borderRadius: typeof radius?.xxl === "number" ? radius.xxl : 25,
          padding: spacing?.xl ?? 24,
        }}
      >
        <Text className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
          Need to escalate?
        </Text>
        <Text className="mt-2 text-lg font-semibold text-white">
          Reach the safety desk directly
        </Text>
        <Text className="mt-2 text-sm leading-6 text-white/80">
          Share chat ID, screenshots, or device details. Our response team
          follows up immediately.
        </Text>
      </View>
    </ScrollView>
  );
}
