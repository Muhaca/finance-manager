import { Text, View } from "react-native";

export default function CustomHeader() {
    return (
        <View className="bg-white p-7">
            <Text className="text-blue-300 text-2xl font-bold">
                My Istri
            </Text>
            <Text className="text-blue-300 text-sm">
                Welcome back 👋
            </Text>
        </View>
    );
}