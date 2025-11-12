import { useLocalSearchParams, Link } from "expo-router";
import { View, Text } from "react-native";

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-semibold text-brand-700 mb-2">Chat with User {id}</Text>
      <View className="flex-1 rounded-2xl border border-brand-200 p-4">
        <Text className="text-brand-900">[messages…]</Text>
      </View>
      <Link href="/" className="text-brand-600 mt-4">Back</Link>
    </View>
  );
}
