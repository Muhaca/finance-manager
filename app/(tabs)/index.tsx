import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import TransactionItem from "@/src/components/TransactionItem";
import { transactionRepo } from "@/src/database/repositories/transactionRepo";
import { formattedRupiah } from "@/src/utils/currency";

export default function DashboardScreen() {
  const [summary, setSummary] = useState<any>({});
  const [recent, setRecent] = useState<any[]>([]);

  const loadData = () => {
    const sum = transactionRepo.getSummaryCurrentMonth();
    const rec = transactionRepo.getRecent(5);

    setSummary(sum || {});
    setRecent(rec || []);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const balance =
    (summary.total_income || 0) -
    (summary.total_expense || 0);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Balance Card */}
      <View className="bg-indigo-600 rounded-3xl p-6 mb-6 shadow-lg">
        <Text className="text-indigo-200 text-sm">
          Total Balance
        </Text>

        <Text className="text-white text-3xl font-bold mt-1">
          {formattedRupiah(balance)}
        </Text>
      </View>

      {/* Income / Expense */}
      <View className="flex-row gap-3 mb-6">
        {/* Income */}
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <Text className="text-xs text-gray-500">
            Income
          </Text>
          <Text className="text-green-600 font-bold text-lg mt-1">
            {formattedRupiah(summary.total_income || 0)}
          </Text>
        </View>

        {/* Expense */}
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <Text className="text-xs text-gray-500">
            Expense
          </Text>
          <Text className="text-red-500 font-bold text-lg mt-1">
            {formattedRupiah(summary.total_expense || 0)}
          </Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <Text className="font-semibold text-gray-800 mb-3">
        Recent Transactions
      </Text>

      {recent.map((item) => (
        <TransactionItem
          key={item.id}
          id={item.id}
          title={item.note}
          amount={item.amount}
          type={item.type}
          date={item.date}
          accountName={item.account_name}
          categoryName={item.category_name}
        />
      ))}
    </ScrollView>
  );
}
