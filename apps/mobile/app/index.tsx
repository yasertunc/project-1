import { Link } from "expo-router";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const chats = Array.from({ length: 12 }).map((_, index) => ({
  id: String(index + 1),
  name: `User ${index + 1}`,
}));

export default function Page() {
  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <View className="px-4 pt-4 pb-2">
            <Text className="text-2xl font-bold text-brand-700">Chats</Text>
            <Text className="text-brand-500 mt-1">
              Stay anonymous, stay in control.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="py-20 items-center justify-center">
            <Text className="text-brand-400 text-base">No chats yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/messages/${item.id}`} asChild>
            <TouchableOpacity className="mx-4 mb-3 flex-row items-center rounded-2xl border border-brand-200 bg-brand-50 p-4">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-brand-500">
                <Text className="font-semibold text-white">{item.name.split(" ")[1]}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-brand-900">{item.name}</Text>
                <Text className="text-xs text-brand-600 opacity-70">Tap to continue the conversation</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        ListFooterComponent={
          <View className="px-4 pt-2">
            <Link href="/profile" className="text-brand-600 font-medium">
              Go to Profile →
            </Link>
          </View>
        }
      />
    </View>
  );
}
