import { Text, View } from "react-native";

function EmptyState() {
    return (
        <View className="items-center mt-32">
            <Text className="text-gray-400 text-sm">
                Belum ada transaksi
            </Text>
            <Text className="text-gray-300 text-xs mt-1">
                Mulai dengan menambahkan pemasukan atau pengeluaran
            </Text>
        </View>
    );
}

export default EmptyState;
