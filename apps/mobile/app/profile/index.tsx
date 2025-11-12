import { useState } from "react";
import { View, Text, Switch } from "react-native";

export default function Page() {
  const [visibility, setVisibility] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [blockUnknown, setBlockUnknown] = useState(false);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-2xl font-bold text-brand-700">
        Anonymous Profile
      </Text>
      <View className="gap-3">
        <View className="flex-row items-center justify-between rounded-2xl border border-brand-200 bg-white p-4">
          <View>
            <Text className="text-base font-medium text-brand-900">Visibility</Text>
            <Text className="text-xs text-brand-600 opacity-70">Show me to matching users</Text>
          </View>
          <Switch value={visibility} onValueChange={setVisibility} />
        </View>
        <View className="flex-row items-center justify-between rounded-2xl border border-brand-200 bg-white p-4">
          <View>
            <Text className="text-base font-medium text-brand-900">Allow Messages</Text>
            <Text className="text-xs text-brand-600 opacity-70">Let matched users start chats</Text>
          </View>
          <Switch value={allowMessages} onValueChange={setAllowMessages} />
        </View>
        <View className="flex-row items-center justify-between rounded-2xl border border-brand-200 bg-white p-4">
          <View>
            <Text className="text-base font-medium text-brand-900">Block Unknown</Text>
            <Text className="text-xs text-brand-600 opacity-70">Mute messages from unverified users</Text>
          </View>
          <Switch value={blockUnknown} onValueChange={setBlockUnknown} />
        </View>
      </View>
    </View>
  );
}