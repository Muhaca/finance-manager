import { Text, TouchableOpacity, View } from "react-native";
import { TransactionItemProps } from "../types/finance";

export default function TransactionItem({
    title,
    amount,
    type,
    date,
    accountName,
    categoryName,
    onPress,
    onLongPress
}: TransactionItemProps) {
    const isIncome = type === "income";

    const formattedRupiah = (value: number) => {
        return `Rp ${value.toLocaleString("id-ID")}`;
    };

    return (
        <TouchableOpacity
            onLongPress={onLongPress}
            onPress={onPress}
            className="bg-white rounded-2xl p-4 mb-3 flex-row justify-between items-center shadow-sm border border-gray-100"
            activeOpacity={0.7}
        >
            {/* LEFT */}
            <View className="flex-1">
                {/* Title */}
                <Text className="font-semibold text-base text-gray-800">
                    {title || categoryName}
                </Text>

                {/* Subtitle */}
                <Text className="text-xs text-gray-500 mt-1">
                    {accountName} • {date}
                </Text>
            </View>

            {/* RIGHT */}
            <View className="items-end">
                <Text
                    className={`font-bold text-base ${isIncome ? "text-green-600" : "text-red-500"
                        }`}
                >
                    {isIncome ? "+" : "-"} {formattedRupiah(amount)}
                </Text>

                <Text className="text-xs text-gray-400 mt-1 capitalize">
                    {type}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
