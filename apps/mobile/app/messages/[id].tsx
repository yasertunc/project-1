import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, Link } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type Msg = { id: string; text: string; from: "me" | "other"; ts: number };

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [text, setText] = useState("");
  const [items, setItems] = useState<Msg[]>(() => [
    { id: "1", text: `Hey, I'm User ${id}`, from: "other", ts: Date.now() - 120_000 },
    { id: "2", text: "Hi! 👋", from: "me", ts: Date.now() - 60_000 },
  ]);

  const listRef = useRef<FlatList<Msg>>(null);
  const sorted = useMemo(() => [...items].sort((a, b) => a.ts - b.ts), [items]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [sorted.length]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    const now = Date.now();
    setItems((prev) => [...prev, { id: String(now), text: t, from: "me", ts: now }]);
    setText("");
    setTimeout(() => {
      setItems((prev) => [
        ...prev,
        { id: String(now + 1), text: "👍", from: "other", ts: Date.now() },
      ]);
    }, 500);
  };

  const renderItem = ({ item }: { item: Msg }) => (
    <View
      className={`max-w-[85%] rounded-2xl p-3 mb-2 ${
        item.from === "me"
          ? "self-end bg-brand-500"
          : "self-start bg-brand-50 border border-brand-200"
      }`}
    >
      <Text className={item.from === "me" ? "text-white" : "text-brand-900"}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <View className="border-b border-brand-200 px-4 pt-4 pb-2">
        <Text className="text-xl font-semibold text-brand-700">Chat with User {id}</Text>
        <Link href="/" className="mt-1 text-brand-600">
          Back
        </Link>
      </View>

      <FlatList
        ref={listRef}
        className="flex-1 px-4 py-3"
        data={sorted}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      <View className="flex-row items-center gap-2 border-t border-brand-200 p-3">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          className="flex-1 border border-brand-200 rounded-2xl px-3 py-2"
          returnKeyType="send"
          onSubmitEditing={send}
        />
        <TouchableOpacity onPress={send} className="rounded-2xl bg-brand-600 px-4 py-2">
          <Text className="font-medium text-white">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
