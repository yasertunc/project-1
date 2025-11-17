import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Msg = { id: string; text: string; from: "me" | "other"; ts: number };
type MessagesStackParamList = {
  "messages/[id]": { id: string };
};

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<MessagesStackParamList, "messages/[id]">
    >();
  const [text, setText] = useState("");
  const [items, setItems] = useState<Msg[]>(() => [
    {
      id: "1",
      text: `Hey, I'm User ${id}`,
      from: "other",
      ts: Date.now() - 120_000,
    },
    { id: "2", text: "Hi! 👋", from: "me", ts: Date.now() - 60_000 },
  ]);
  const [typing, setTyping] = useState(false);

  const listRef = useRef<FlatList<Msg>>(null);
  const sorted = useMemo(() => [...items].sort((a, b) => a.ts - b.ts), [items]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [sorted.length]);

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const send = () => {
    const t = text.trim();
    if (!t) return;
    const now = Date.now();
    setItems((prev) => [
      ...prev,
      { id: String(now), text: t, from: "me", ts: now },
    ]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setItems((prev) => [
        ...prev,
        { id: String(now + 1), text: "👍", from: "other", ts: Date.now() },
      ]);
      setTyping(false);
    }, 800);
  };

  const renderItem = ({ item }: { item: Msg }) => (
    <View
      className="mb-2 max-w-[85%]"
      accessibilityLabel={`${item.from === "me" ? "You" : "Other user"} said: ${item.text} at ${formatTime(item.ts)}`}
    >
      <View
        className={`rounded-2xl p-3 ${
          item.from === "me"
            ? "self-end bg-brand-500"
            : "self-start bg-brand-50 border border-brand-200"
        }`}
      >
        <Text className={item.from === "me" ? "text-white" : "text-brand-900"}>
          {item.text}
        </Text>
      </View>
      <Text
        className={`mt-1 text-xs opacity-60 ${
          item.from === "me"
            ? "self-end text-right text-white"
            : "self-start text-brand-700"
        }`}
      >
        {formatTime(item.ts)}
      </Text>
    </View>
  );

  useEffect(() => {
    if (id) {
      navigation.setOptions({
        title: `User ${id}`,
      });
    }
  }, [navigation, id]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      <FlatList
        ref={listRef}
        className="flex-1 px-4 py-3"
        data={sorted}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        accessibilityLabel="Chat messages"
        ListFooterComponent={
          typing ? (
            <View className="self-start rounded-2xl border border-brand-200 bg-brand-50 px-3 py-2">
              <Text className="text-brand-700">typing…</Text>
            </View>
          ) : null
        }
      />

      <View className="flex-row items-center gap-2 border-t border-brand-200 p-3">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          className="flex-1 border border-brand-200 rounded-2xl px-3 py-2"
          returnKeyType="send"
          onSubmitEditing={send}
          accessibilityLabel="Message input"
          accessibilityHint="Type your message here and press send"
        />
        <TouchableOpacity
          onPress={send}
          className="rounded-2xl bg-brand-600 px-4 py-2"
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityHint="Sends the typed message"
        >
          <Text className="font-medium text-white">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
