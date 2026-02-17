import { Text, View } from "react-native";

function EmptyState() {
    return (
        <View className="items-center mt-32">
            <Text className="text-gray-400 text-sm">
                No transactions yet
            </Text>
            <Text className="text-gray-300 text-xs mt-1">
                Start by adding income or expense
            </Text>
        </View>
    );
}

export default EmptyState;
