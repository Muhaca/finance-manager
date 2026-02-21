import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

import EmptyState from "@/src/components/EmtyState";
import TransactionItem from "@/src/components/TransactionItem";
import { categoryTypeList } from "@/src/constants/cetegoryTypeList";
import { transactionRepo } from "@/src/database/repositories/transactionRepo";
import { formattedRupiah } from "@/src/utils/currency";

type FilterType = "all" | "income" | "expense";

export default function TransactionsTab() {
    const [data, setData] = useState<any[]>([]);
    const [balance, setBalance] = useState(0);
    const [summary, setSummary] = useState<any>({});
    const [filter, setFilter] =
        useState<FilterType>("all");

    // ==============================
    // LOAD DATA
    // ==============================
    const loadData = () => {
        const trx = transactionRepo.getAll();
        const bal = transactionRepo.getTotalBalance();
        const sum = transactionRepo.getSummaryCurrentMonth()

        console.log(sum);

        setSummary(sum || { total_income: 0, total_expense: 0 })
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
            <View className="bg-[#C00B70] rounded-2xl p-6 mb-6 shadow-lg">
                <View className="flex-row justify-between">
                    <Text className="text-white text-sm">
                        {filter === "income" ? "Total Pemasukan" : filter === "expense" ? "Total Pengeluaran" : "Total"}
                    </Text>
                </View>

                <Text className="text-white text-3xl font-bold mt-1">
                    {filter === "income" ? formattedRupiah(summary.total_income) : filter === "expense" ? formattedRupiah(summary.total_expense) : formattedRupiah(balance)}
                </Text>
            </View>

            {/* ===================== */}
            {/* FILTER BAR */}
            {/* ===================== */}
            <View className="flex-row mb-4 gap-2">
                {[{ code: "all", label: "Semua" }, ...categoryTypeList].map(
                    (f) => (
                        <Pressable
                            key={f.code}
                            onPress={() =>
                                setFilter(f.code as FilterType)
                            }
                            className={`px-4 py-2 rounded-full border ${filter === f.code
                                ? "bg-[#E978AC] border-[#E978AC]"
                                : "bg-white border-gray-200"
                                }`}
                        >
                            <Text
                                className={`text-sm capitalize ${filter === f.code
                                    ? "text-white"
                                    : "text-gray-600"
                                    }`}
                            >
                                {f.label}
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

