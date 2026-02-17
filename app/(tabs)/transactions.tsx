import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

import TransactionItem from "@/src/components/TransactionItem";
import { transactionRepo } from "@/src/database/repositories/transactionRepo";

type FilterType = "all" | "income" | "expense";

export default function TransactionsTab() {
    const [data, setData] = useState<any[]>([]);
    const [balance, setBalance] = useState(0);
    const [filter, setFilter] =
        useState<FilterType>("all");

    // ==============================
    // LOAD DATA
    // ==============================
    const loadData = () => {
        const trx = transactionRepo.getAll();
        const bal = transactionRepo.getTotalBalance();

        setData(trx || []);
        setBalance(bal);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    // ==============================
    // DELETE
    // ==============================
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

    // ==============================
    // FILTER
    // ==============================
    const filteredData = data.filter((item) => {
        if (filter === "all") return true;
        return item.type === filter;
    });

    // ==============================
    // UI
    // ==============================
    return (
        <View className="flex-1 bg-gray-50 p-4">
            {/* ===================== */}
            {/* BALANCE HEADER */}
            {/* ===================== */}
            <View className="bg-indigo-600 rounded-3xl p-6 mb-6 shadow-lg">
                <Text className="text-indigo-200 text-sm">
                    Total Balance
                </Text>

                <Text className="text-white text-3xl font-bold mt-1">
                    Rp {balance.toLocaleString("id-ID")}
                </Text>
            </View>

            {/* ===================== */}
            {/* FILTER BAR */}
            {/* ===================== */}
            <View className="flex-row mb-4 gap-2">
                {["all", "income", "expense"].map(
                    (f) => (
                        <Pressable
                            key={f}
                            onPress={() =>
                                setFilter(f as FilterType)
                            }
                            className={`px-4 py-2 rounded-full border ${filter === f
                                ? "bg-indigo-600 border-indigo-600"
                                : "bg-white border-gray-200"
                                }`}
                        >
                            <Text
                                className={`text-sm capitalize ${filter === f
                                    ? "text-white"
                                    : "text-gray-600"
                                    }`}
                            >
                                {f}
                            </Text>
                        </Pressable>
                    )
                )}
            </View>

            {/* ===================== */}
            {/* TRANSACTION LIST */}
            {/* ===================== */}
            <FlatList
                data={filteredData}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<EmptyState />}
                renderItem={({ item }) => (
                    <TransactionItem
                        id={item.id}
                        title={item.note}
                        amount={item.amount}
                        type={item.type}
                        date={item.date}
                        accountName={
                            item.account_name
                        }
                        categoryName={
                            item.category_name
                        }
                        onPress={() =>
                            router.push(
                                `/transaction/form?id=${item.id}`
                            )
                        }
                        onLongPress={() =>
                            handleDelete(item.id)
                        }
                    />
                )}
            />

            {/* ===================== */}
            {/* FAB ADD */}
            {/* ===================== */}
            <Pressable
                onPress={() =>
                    router.push(
                        "/transaction/form"
                    )
                }
                className="absolute bottom-6 right-6 bg-indigo-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            >
                <Text className="text-white text-2xl font-bold">
                    +
                </Text>
            </Pressable>
        </View>
    );
}

// ==============================
// EMPTY STATE
// ==============================
function EmptyState() {
    return (
        <View className="items-center mt-32">
            <Text className="text-gray-400 text-sm">
                No transactions yet
            </Text>

            <Text className="text-gray-300 text-xs mt-1">
                Tap + to add income or expense
            </Text>
        </View>
    );
}
