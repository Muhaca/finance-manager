import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import Card from "@/src/components/ui/Card";
import { accountRepo } from "@/src/database/repositories/accountRepo";
import { Account } from "@/src/types/finance";
import { formattedRupiah } from "@/src/utils/currency";
import { Ionicons } from "@expo/vector-icons";

export default function AccountScreen() {
    const [accounts, setAccounts] = useState<Account[]>([]);

    const loadData = () => {
        const data = accountRepo.getAll();

        setAccounts(data);
    };

    // reload tiap balik ke screen
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const totalBalance = accounts.reduce(
        (acc, item) => acc + item.balance,
        0
    );

    const goToAdd = () => {
        router.push("/account/form");
    };

    const goToEdit = (id: number) => {
        router.push(`/account/form?id=${id}`);
    };

    return (
        <View className="flex-1 bg-gray-50 px-4 pt-10 pb-20 ">

            {/* Balance Card */}
            <View className="bg-[#C00B70] rounded-2xl p-6 mb-6 shadow-lg">
                <View className='flex-row justify-between items-center'>
                    <Text className="text-white text-sm">
                        Total Saldo
                    </Text>
                    <Ionicons name="wallet-outline" size={18} color="white" />
                </View>
                <Text className="text-white text-3xl font-bold mt-1">
                    {formattedRupiah(totalBalance)}
                </Text>
            </View>

            {/* Add Button */}
            <Card
                onPress={goToAdd}
                className="border-2 border-dashed border-gray-300 p-3 rounded-lg mb-5 h-20 items-center justify-center"
            >
                <Text className="text-gray-600 text-center font-semibold">
                    + Tambah Akun
                </Text>
            </Card>

            {/* List */}
            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => goToEdit(item.id)}
                        className="p-4 border border-gray-100 rounded-xl mb-3 bg-[#8c174e]"
                    >
                        <View className="flex-row justify-between items-center">
                            <View className="flex-col gap-2">
                                <Ionicons name="wallet-outline" size={20} color="#fff" />
                                <Text className="text-white font-bold">{item.name}</Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <Text className="text-white font-bold">{formattedRupiah(item.balance)}</Text>
                                <Ionicons name="pencil-sharp" size={16} color="#fff" />
                            </View>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    );
}
