import { useState } from "react";
import { View, Text, Switch } from "react-native";

import { nativeTokens } from "../../src/theme/tokens";

export default function ProfileTab() {
  const [visibility, setVisibility] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [blockUnknown, setBlockUnknown] = useState(false);

  const palette = nativeTokens.palette;
  const radius = nativeTokens.radius;
  const spacing = nativeTokens.spacing;

  const cardRadius = typeof radius?.lg === "number" ? radius.lg : 16;
  const sectionGap = spacing?.md ?? 12;
  const cardPadding = spacing?.lg ?? 15;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: palette.background.light,
        paddingHorizontal: spacing?.lg ?? 16,
        paddingVertical: spacing?.xl ?? 24,
      }}
    >
      <View>
        <Text
          className="text-xs font-semibold uppercase tracking-[0.32em]"
          style={{ color: palette.primary.main }}
        >
          Anonymous Profile
        </Text>
        <Text
          className="mt-2 text-3xl font-bold"
          style={{ color: palette.text.primary }}
        >
          Privacy Controls
        </Text>
        <Text
          className="mt-3 text-sm leading-5"
          style={{ color: palette.text.secondary }}
        >
          Tune how you appear in discovery and the safeguards that protect your
          identity.
        </Text>
      </View>

      <View style={{ marginTop: spacing?.xl ?? 24 }}>
        <View
          className="flex-row items-center justify-between"
          style={{
            backgroundColor: palette.surface.white,
            borderRadius: cardRadius,
            padding: cardPadding,
            borderWidth: 1,
            borderColor: palette.background.medium,
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              className="text-base font-semibold"
              style={{ color: palette.text.primary }}
            >
              Visibility
            </Text>
            <Text
              className="mt-1 text-xs leading-5"
              style={{ color: palette.text.secondary }}
            >
              Show my anonymous badge to compatible users.
            </Text>
          </View>
          <Switch
            value={visibility}
            onValueChange={setVisibility}
            accessibilityLabel="Toggle visibility"
            accessibilityHint="Show or hide your anonymous badge to compatible users"
          />
        </View>

        <View
          className="flex-row items-center justify-between"
          style={{
            backgroundColor: palette.surface.white,
            borderRadius: cardRadius,
            padding: cardPadding,
            borderWidth: 1,
            borderColor: palette.background.medium,
            marginTop: sectionGap,
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              className="text-base font-semibold"
              style={{ color: palette.text.primary }}
            >
              Allow Messages
            </Text>
            <Text
              className="mt-1 text-xs leading-5"
              style={{ color: palette.text.secondary }}
            >
              Let matched users start a new chat immediately.
            </Text>
          </View>
          <Switch
            value={allowMessages}
            onValueChange={setAllowMessages}
            accessibilityLabel="Toggle allow messages"
            accessibilityHint="Allow or block matched users from starting a new chat immediately"
          />
        </View>

        <View
          className="flex-row items-center justify-between"
          style={{
            backgroundColor: palette.surface.white,
            borderRadius: cardRadius,
            padding: cardPadding,
            borderWidth: 1,
            borderColor: palette.background.medium,
            marginTop: sectionGap,
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              className="text-base font-semibold"
              style={{ color: palette.text.primary }}
            >
              Block Unknown
            </Text>
            <Text
              className="mt-1 text-xs leading-5"
              style={{ color: palette.text.secondary }}
            >
              Mute pings from users without verified intent or trust badge.
            </Text>
          </View>
          <Switch
            value={blockUnknown}
            onValueChange={setBlockUnknown}
            accessibilityLabel="Toggle block unknown users"
            accessibilityHint="Mute pings from users without verified intent or trust badge"
          />
        </View>
      </View>

      <View
        className="rounded-2xl"
        style={{
          backgroundColor: palette.surface.gray ?? "#f8f9fa",
          borderRadius: typeof radius?.xxl === "number" ? radius.xxl : 25,
          padding: cardPadding,
          borderWidth: 1,
          borderColor: palette.background.medium,
          marginTop: spacing?.xl ?? 24,
        }}
      >
        <Text
          className="text-sm font-semibold"
          style={{ color: palette.text.primary }}
        >
          Identity Safety
        </Text>
        <Text
          className="mt-2 text-xs leading-5"
          style={{ color: palette.text.secondary }}
        >
          You remain anonymous until you choose to reveal more. Reports are
          reviewed within 15 minutes and proactive guardrails mute risky
          behavior.
        </Text>
      </View>
    </View>
  );
}
