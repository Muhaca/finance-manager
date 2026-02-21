import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import CustomHeader from "@/src/components/CustomHeader";
import TransactionItem from "@/src/components/TransactionItem";
import { accountRepo } from '@/src/database/repositories/accountRepo';
import { transactionRepo } from "@/src/database/repositories/transactionRepo";
import { formattedRupiah } from "@/src/utils/currency";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const [summary, setSummary] = useState<any>({});
  const [recent, setRecent] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  const loadData = () => {
    const sum = transactionRepo.getSummaryCurrentMonth();
    const rec = transactionRepo.getRecent(5);
    const acc = accountRepo.getAll();


    setAccounts(acc || []);
    setSummary(sum || {});
    setRecent(rec || []);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const summaryBalance =
    (summary.total_income || 0) -
    (summary.total_expense || 0);

  const totalBalance = accounts.reduce(
    (acc, item) => acc + item.balance,
    0
  );

  return (
    <SafeAreaView className="h-full">
      <CustomHeader />
      <ScrollView className="flex-1 bg-gray-50 p-4 pt-0">
        {/* Balance Card */}
        <View className="bg-[#C00B70] rounded-2xl p-6 mb-6 shadow-lg">
          <View className='flex-row justify-between items-center'>
            <Text className="text-white text-sm">
              Total Saldo
            </Text>
            <Ionicons name="wallet-outline" size={18} color="white" />
          </View>
          <Text className="text-white text-3xl font-bold mt-1">
            {formattedRupiah(summaryBalance + totalBalance)}
          </Text>
        </View>

        {/* Income / Expense */}
        <View className="flex-row gap-3 mb-6">
          {/* Income */}
          <View className="flex-1 bg-green-50 rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className='flex-row gap-2 items-center'>
              <Ionicons name="trending-up-outline" size={18} color="green" />
              <Text className="text-xs text-green-600">
                Pemasukan
              </Text>
            </View>
            <Text className="text-green-600 font-bold text-lg mt-1">
              {formattedRupiah(summary.total_income || 0)}
            </Text>
          </View>

          {/* Expense */}
          <View className="flex-1 bg-red-50 rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className='flex-row gap-2 items-center'>
              <Ionicons name="trending-down-outline" size={18} color="red" />
              <Text className="text-xs text-red-600">
                Pengeluaran
              </Text>
            </View>
            <Text className="text-red-500 font-bold text-lg mt-1">
              {formattedRupiah(summary.total_expense || 0)}
            </Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <Text className="font-semibold text-gray-800 mb-3">
          Transaksi Terakhir
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
    </SafeAreaView>
  );
}
