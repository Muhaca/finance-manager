import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text } from "react-native";

import Card from "@/src/components/ui/Card";
import { accountRepo } from "@/src/database/repositories/accountRepo";
import { Account } from "@/src/types/finance";
import { formattedRupiah } from "@/src/utils/currency";
import { ScrollView } from "react-native-gesture-handler";

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

    const goToAdd = () => {
        router.push("/account/form");
    };

    const goToEdit = (id: number) => {
        router.push(`/account/form?id=${id}`);
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 px-4 pt-10 pb-20 ">
            {/* Add Button */}
            <Card
                onPress={goToAdd}
                style={{
                    backgroundColor: "#4CAF50",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                }}
            >
                <Text style={{ color: "white", textAlign: "center" }}>
                    + Add Account
                </Text>
            </Card>

            {/* List */}
            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => goToEdit(item.id)}
                        style={{
                            padding: 16,
                            borderWidth: 1,
                            borderRadius: 12,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                        <Text>Balance: {formattedRupiah(item.balance)}</Text>
                    </Pressable>
                )}
            />
        </ScrollView>
    );
}
