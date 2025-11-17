import { useMemo, useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";

import { nativeTokens } from "../../src/theme/tokens";

type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  isVip?: boolean;
  online?: boolean;
};

const RAW_CHATS: ChatItem[] = [
  {
    id: "1",
    name: "Hazal",
    lastMessage: "Yeni bir oda açtım, katılmak ister misin?",
    timestamp: "2m",
    unread: 2,
    isVip: true,
    online: true,
  },
  {
    id: "2",
    name: "Alex",
    lastMessage: "Need to follow up on the project scope.",
    timestamp: "12m",
  },
  {
    id: "3",
    name: "Emre",
    lastMessage: "Müsait olduğunda ping at.",
    timestamp: "27m",
    online: true,
  },
  {
    id: "4",
    name: "Linea",
    lastMessage: "Great to meet you earlier!",
    timestamp: "1h",
  },
  {
    id: "5",
    name: "Fellowus GPT",
    lastMessage: "Hazır olduğunda güvenlik turuna başlayabiliriz.",
    timestamp: "2h",
    unread: 1,
  },
];

const FILTERS = ["All", "VIP", "Online", "Muted"];

export default function InboxTab() {
  const [filter, setFilter] = useState("All");

  const palette = nativeTokens.palette;
  const spacing = nativeTokens.spacing;
  const radius = nativeTokens.radius;

  const filtered = useMemo(() => {
    switch (filter) {
      case "VIP":
        return RAW_CHATS.filter((chat) => chat.isVip);
      case "Online":
        return RAW_CHATS.filter((chat) => chat.online);
      case "Muted":
        return [];
      default:
        return RAW_CHATS;
    }
  }, [filter]);

  const backgroundColor = palette.background.light;
  const primaryColor = palette.primary.main;
  const secondaryColor = palette.text.secondary;
  const surfaceColor = palette.surface.white;
  const cardBorder = palette.background.medium;

  const headerSpacing = spacing?.xl ?? 24;
  const listPaddingBottom = spacing?.xxl ?? 32;
  const chipRadius = typeof radius?.lg === "number" ? radius.lg : 16;

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: listPaddingBottom,
        }}
        ListHeaderComponent={
          <View className="px-5 pt-6 pb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className="text-xs font-semibold uppercase tracking-[0.28em]"
                  style={{ color: primaryColor }}
                >
                  Inbox
                </Text>
                <Text
                  className="mt-2 text-3xl font-bold"
                  style={{ color: palette.text.primary }}
                >
                  Chats
                </Text>
              </View>
              <View
                className="items-center justify-center rounded-full px-4 py-2"
                style={{
                  backgroundColor: palette.vip.main,
                }}
              >
                <Text
                  className="text-xs font-semibold uppercase tracking-[0.24em] text-white"
                  style={{
                    fontSize: 11,
                  }}
                >
                  VIP QUEUE
                </Text>
              </View>
            </View>

            <View
              className="flex-row flex-wrap"
              style={{ marginTop: headerSpacing * 0.35 }}
            >
              {FILTERS.map((chip) => {
                const active = chip === filter;
                return (
                  <Pressable
                    key={chip}
                    onPress={() => setFilter(chip)}
                    className="px-4 py-2"
                    accessibilityRole="button"
                    accessibilityLabel={`Filter by ${chip}`}
                    accessibilityState={{ selected: active }}
                    style={{
                      borderRadius: chipRadius,
                      backgroundColor: active
                        ? primaryColor
                        : palette.background.medium,
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{
                        color: active ? "#fff" : secondaryColor,
                        letterSpacing: 2,
                      }}
                    >
                      {chip}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="py-20 items-center justify-center px-5">
            <Text
              className="text-base text-center"
              style={{ color: secondaryColor }}
            >
              Nothing to show here yet. Try switching filters or start a new
              chat.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/messages/${item.id}`} asChild>
            <TouchableOpacity
              activeOpacity={0.9}
              className="mx-5 mb-4 flex-row items-center"
              accessibilityRole="button"
              accessibilityLabel={`Chat with ${item.name}. ${item.lastMessage}. ${item.unread ? `${item.unread} unread messages.` : ""}`}
              accessibilityHint="Double tap to open chat"
              style={{
                backgroundColor: surfaceColor,
                borderRadius:
                  typeof radius?.xxl === "number" ? radius.xxl : 25,
                padding: spacing?.lg ?? 15,
                borderWidth: Platform.OS === "ios" ? 0 : 1,
                borderColor: cardBorder,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.08,
                shadowRadius: 18,
                elevation: 4,
              }}
            >
              <View style={{ marginRight: spacing?.md ?? 12 }}>
                <View
                  className="h-12 w-12 items-center justify-center"
                  style={{
                    borderRadius:
                      typeof radius?.round === "number"
                        ? radius.round
                        : Number.parseInt(
                            String(radius?.round ?? "9999"),
                            10
                          ) || 9999,
                    backgroundColor: primaryColor,
                  }}
                >
                  <Text className="font-semibold text-white">
                    {item.name.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-base font-semibold"
                    style={{ color: palette.text.primary }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className="text-xs font-medium uppercase tracking-[0.18em]"
                    style={{ color: secondaryColor }}
                  >
                    {item.timestamp}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  className="mt-1 text-sm"
                  style={{ color: secondaryColor }}
                >
                  {item.lastMessage}
                </Text>
                <View className="mt-2 flex-row items-center">
                  {item.online ? (
                    <View
                      className="flex-row items-center"
                      style={{ marginRight: 12 }}
                    >
                      <View
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: palette.semantic.online }}
                      />
                      <Text
                        className="text-xs font-medium"
                        style={{ color: secondaryColor }}
                      >
                        Online
                      </Text>
                    </View>
                  ) : null}
                  {item.isVip ? (
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: "#FFF4CC" }}
                    >
                      <Text className="text-xs font-semibold text-[#C38511]">
                        VIP
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {item.unread ? (
                <View className="ml-2 min-h-[22px] min-w-[22px] items-center justify-center rounded-full bg-brand-500 px-2">
                  <Text className="text-xs font-semibold text-white">
                    {item.unread}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </Link>
        )}
        ListFooterComponent={
          <View className="px-5 pt-2">
            <Link href="/profile" className="font-semibold text-brand-600">
              Manage Anonymous Profile →
            </Link>
          </View>
        }
      />
    </View>
  );
}
