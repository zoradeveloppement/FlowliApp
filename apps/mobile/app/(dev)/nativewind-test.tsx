import { View, Pressable, Text } from "react-native";

export default function NativewindTest() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-100">
      <Pressable className="h-12 px-6 rounded-3xl bg-black/90 border border-white/10 items-center justify-center">
        <Text className="text-white font-semibold">Should be a black pill</Text>
      </Pressable>
    </View>
  );
}
