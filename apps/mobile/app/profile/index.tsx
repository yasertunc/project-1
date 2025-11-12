import { View, Text, Switch } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-2xl font-bold text-brand-700">
        Anonymous Profile
      </Text>
      <View className="rounded-2xl border border-brand-200 p-4">
        <Text className="mb-2 text-brand-900">Visibility</Text>
        <Switch value />
      </View>
    </View>
  );
}
