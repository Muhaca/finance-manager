import { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";


import { transactionRepo } from "@/src/database/repositories/transactionRepo";

const screenWidth = Dimensions.get("window").width;
const colors = [
    "#4F46E5",
    "#22C55E",
    "#EF4444",
    "#F59E0B",
    "#06B6D4",
    "#A855F7",
];

export default function ReportScreen() {
    const [data, setData] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);


    useEffect(() => {
        const year = new Date().getFullYear();
        const result = transactionRepo.getMonthlySummary(year);
        const category = transactionRepo.getExpenseByCategory();
        setData(result);
        setCategoryData(category);
    }, []);

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
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <Text className="text-lg font-bold mb-4">
                Monthly Report
            </Text>

            <View className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
                <Text className="text-gray-500 text-xs">
                    Net Balance This Year
                </Text>

                <Text className="text-xl font-bold mt-1">
                    Rp {balance.toLocaleString("id-ID")}
                </Text>
            </View>


            <LineChart
                data={{
                    labels,
                    datasets: [
                        { data: incomeData },
                        { data: expenseData },
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
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={{
                        color: () => `#000`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="8"
                    absolute
                />
            ) : (
                <Text className="text-gray-400 text-sm">
                    No expense data yet
                </Text>
            )}

            <View className="bg-white rounded-2xl p-4 mt-6 border border-gray-100">
                <Text className="text-xs text-gray-500">
                    Top Spending Category
                </Text>

                <Text className="text-lg font-bold mt-1">
                    {topCategory?.category || "-"}
                </Text>
            </View>


        </ScrollView>
    );
}
