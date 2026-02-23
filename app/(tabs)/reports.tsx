import { useCallback, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";


import { transactionRepo } from "@/src/database/repositories/transactionRepo";
import { formattedRupiah } from "@/src/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const colors = [
    "#FFB3BA", // Pastel Pink
    "#FFDFBA", // Pastel Peach
    "#FFFFBA", // Pastel Yellow
    "#BAFFC9", // Pastel Mint Green
    "#BAE1FF"  // Pastel Blue
];

export default function ReportScreen() {
    const [data, setData] = useState<any[]>([]);
    const [dailyData, setDailyData] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const loadData = () => {
        const result = transactionRepo.getMonthlySummary(year);
        const category = transactionRepo.getExpenseByCategory();
        const daily = transactionRepo.getDailySummary(year, month);

        setDailyData(daily);
        setData(result);
        setCategoryData(category);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [year, month])
    );

    const labels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const incomeData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);

    data.forEach((item) => {
        const index = Number(item.month) - 1;
        incomeData[index] = item.income || 0;
        expenseData[index] = item.expense || 0;
    });

    const totalIncome = incomeData.reduce(
        (a, b) => a + b,
        0
    );

    const totalExpense = expenseData.reduce(
        (a, b) => a + b,
        0
    );

    const balance = totalIncome - totalExpense;

    const dailyIncome = Array(31).fill(0);
    const dailyExpense = Array(31).fill(0);

    dailyData.forEach((item) => {
        const index = Number(item.day) - 1;
        dailyIncome[index] = item.income || 0;
        dailyExpense[index] = item.expense || 0;
    });

    const pieData = categoryData.map(
        (item, index) => ({
            name: item.category || "Other",
            population: item.total,
            color: colors[index % colors.length],
            legendFontColor: "#374151",
            legendFontSize: 12,
        })
    );

    const topCategory = categoryData[0];


    return (
        <ScrollView className="flex-1 bg-gray-50 px-4 pt-10 pb-20 ">
            {/* ===================== */}
            {/* BALANCE HEADER */}
            {/* ===================== */}
            <View className="bg-[#C00B70] h-[120px] flex justify-start rounded-b-3xl p-6 mb-6 shadow-lg">
                < View className="flex-row justify-between items-center">
                    <Text className="text-white text-sm">
                        Total Sldo Bulan ini
                    </Text>
                    <Ionicons name="wallet-outline" size={20} color="white" />
                </View>
                <Text className="text-white text-3xl font-bold mt-1">
                    {formattedRupiah(balance)}
                </Text>
            </View>

            <Text className="text-lg font-bold mb-4">Daily Summary</Text>
            <LineChart
                data={{
                    labels: dailyData.map((item) => item.day),
                    datasets: [
                        {
                            data: dailyIncome,
                            color: (opacity = 1) => `rgba(23, 130, 68, 1)${opacity})`, // hijau
                            strokeWidth: 2,
                        },
                        {
                            data: dailyExpense,
                            color: (opacity = 1) => `rgba(195, 9, 77, 1)${opacity})`, // merah
                            strokeWidth: 2,
                        },
                    ],
                    legend: ["Income", "Expense"],
                }}
                width={screenWidth - 32}
                height={260}
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) =>
                        `rgba(79, 70, 229, ${opacity})`,
                    labelColor: () => "#6b7280",
                }}
                bezier
                style={{
                    borderRadius: 16,
                }}
            />

            <Text className="text-lg font-bold mt-8 mb-4">Monthly Summary</Text>
            <LineChart
                data={{
                    labels,
                    datasets: [
                        {
                            data: incomeData,
                            color: (opacity = 1) => `rgba(23, 130, 68, 1)${opacity})`, // hijau
                            strokeWidth: 2,
                        },
                        {
                            data: expenseData,
                            color: (opacity = 1) => `rgba(195, 9, 77, 1)${opacity})`, // merah
                            strokeWidth: 2,
                        },
                    ],
                    legend: ["Income", "Expense"],
                }}
                width={screenWidth - 32}
                height={260}
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) =>
                        `rgba(79, 70, 229, ${opacity})`,
                    labelColor: () => "#6b7280",
                }}
                bezier
                style={{
                    borderRadius: 16,
                }}
            />

            <Text className="text-lg font-bold mt-8 mb-4">
                Expense by Category
            </Text>
            {pieData.length > 0 ? (
                <PieChart
                    data={pieData}
                    width={screenWidth - 30}
                    height={200}
                    chartConfig={{
                        color: () => `#000`,
                    }}
                    accessor="population"
                    backgroundColor="white"
                    paddingLeft="8"
                    absolute
                />
            ) : (
                <Text className="text-gray-400 text-sm">
                    No expense data yet
                </Text>
            )}

            <View className="bg-white rounded-2xl p-4 mb-10 mt-6 border border-gray-100">
                <Text className="text-xs text-gray-500">
                    Top Spending Category
                </Text>
                <Text className="text-lg font-bold mt-1">
                    {topCategory?.category || "-"}
                </Text>
                <Text className="text-lg font-bold mt-1">
                    {formattedRupiah(topCategory?.total || 0)}
                </Text>
            </View>
        </ScrollView>
    );
}
