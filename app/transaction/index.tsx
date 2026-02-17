import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, View } from "react-native";

import EmptyState from "@/src/components/EmtyState";
import TransactionItem from "@/src/components/TransactionItem";
import { transactionRepo } from "@/src/database/repositories/transactionRepo";

export default function TransactionListScreen() {
    const [data, setData] = useState<any[]>([]);

    const loadData = () => {
        const result = transactionRepo.getAll();
        setData(result);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Transaction",
            "This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        transactionRepo.delete(id);
                        loadData();
                    },
                },
            ]
        );
    };


    return (
        <View className="flex-1 bg-gray-50 p-4">
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<EmptyState />}
                renderItem={({ item }) => (
                    <TransactionItem
                        id={item.id}
                        title={item.note}
                        amount={item.amount}
                        type={item.type}
                        date={item.date}
                        accountName={item.account_name}
                        categoryName={item.category_name}
                        onPress={() =>
                            router.push(
                                `/transaction/form?id=${item.id}`
                            )
                        }
                        onLongPress={() => handleDelete(item.id)}
                    />
                )}
            />
        </View>
    );
}
