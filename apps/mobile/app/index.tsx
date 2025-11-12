import { Link } from "expo-router";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const chats = Array.from({ length: 12 }).map((_, index) => ({
  id: String(index + 1),
  name: `User ${index + 1}`,
}));

export default function Page() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-2xl font-bold text-brand-700">Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/messages/${item.id}`} asChild>
            <TouchableOpacity className="mb-2 rounded-2xl border border-brand-200 bg-brand-50 p-4">
              <Text className="text-brand-800">{item.name}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
      <Link href="/profile" className="mt-2 text-brand-600">
        Go to Profile
      </Link>
    </View>
  );
}
