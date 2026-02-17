import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { accountRepo } from "@/src/database/repositories/accountRepo";
import { categoryRepo } from "@/src/database/repositories/categoryRepo";
import { transactionRepo } from "@/src/database/repositories/transactionRepo";


import {
    Account,
    Category,
    TransactionType,
} from "@/src/types/finance";

export default function TransactionFormScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEdit = !!id;

    const [type, setType] =
        useState<TransactionType>("expense");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(new Date());

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [accountId, setAccountId] =
        useState<number>();
    const [categoryId, setCategoryId] =
        useState<number>();

    const [showDate, setShowDate] = useState(false);

    useEffect(() => {
        setAccounts(accountRepo.getAll());
    }, []);

    useEffect(() => {
        setCategories(categoryRepo.getByType(type));
    }, [type]);

    useEffect(() => {
        if (!id) return;

        const tx = transactionRepo.getById(String(id));
        if (!tx) return;

        setType(tx.type);
        setAmount(String(tx.amount));
        setNote(tx.note ?? "");
        setDate(new Date(tx.date));
        setAccountId(tx.account_id);
        setCategoryId(tx.category_id);
    }, [id]);

    const handleSave = () => {
        if (!accountId || !categoryId || !amount) {
            Alert.alert("Validation", "Complete all fields");
            return;
        }

        const payload = {
            account_id: accountId,
            category_id: categoryId,
            amount: Number(amount),
            type,
            note,
            date: date.toISOString(),
        };

        if (isEdit) {
            transactionRepo.update({
                id: String(id),
                ...payload,
            });
        } else {
            transactionRepo.create({
                id: String(id),
                ...payload,
            });
        }

        router.back();
    };

    return (

        <KeyboardAvoidingView
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
            className="flex-1"
        >
            <ScrollView
                className="flex-1 bg-gray-50"
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 120, // space FAB / button
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* FORM CONTENT */}
                <View className="flex-1 bg-white p-5 gap-4">
                    {/* TYPE */}
                    <View className="flex-row gap-3">
                        {(["expense", "income"] as TransactionType[])
                            .map((t) => (
                                <Pressable
                                    key={t}
                                    onPress={() => setType(t)}
                                    className={`flex-1 p-3 rounded-xl border ${type === t
                                        ? "bg-green-500 border-green-500"
                                        : "bg-white border-gray-300"
                                        }`}
                                >
                                    <Text
                                        className={`text-center font-semibold ${type === t
                                            ? "text-white"
                                            : "text-black"
                                            }`}
                                    >
                                        {t.toUpperCase()}
                                    </Text>
                                </Pressable>
                            ))}
                    </View>

                    {/* AMOUNT */}
                    <View>
                        <Text className="mb-1 font-medium">
                            Amount
                        </Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholder="0"
                            className="border border-gray-300 rounded-xl p-3"
                        />
                    </View>

                    {/* ACCOUNT */}
                    <View>
                        <Text className="font-medium">
                            Account
                        </Text>

                        {accounts.map((acc) => (
                            <Pressable
                                key={acc.id}
                                onPress={() => setAccountId(acc.id)}
                                className={`p-3 rounded-xl border mt-2 ${accountId === acc.id
                                    ? "bg-blue-500 border-blue-500"
                                    : "bg-white border-gray-300"
                                    }`}
                            >
                                <Text
                                    className={
                                        accountId === acc.id
                                            ? "text-white"
                                            : "text-black"
                                    }
                                >
                                    {acc.name} — {acc.balance}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* CATEGORY */}
                    <View>
                        <Text className="font-medium">
                            Category
                        </Text>

                        {categories.map((cat) => (
                            <Pressable
                                key={cat.id}
                                onPress={() => setCategoryId(cat.id)}
                                className={`p-3 rounded-xl border mt-2 ${categoryId === cat.id
                                    ? "bg-orange-500 border-orange-500"
                                    : "bg-white border-gray-300"
                                    }`}
                            >
                                <Text
                                    className={
                                        categoryId === cat.id
                                            ? "text-white"
                                            : "text-black"
                                    }
                                >
                                    {cat.name}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* DATE */}
                    <View>
                        <Text className="font-medium mb-1">
                            Date
                        </Text>

                        <Pressable
                            onPress={() => setShowDate(true)}
                            className="border border-gray-300 rounded-xl p-3"
                        >
                            <Text>{date.toDateString()}</Text>
                        </Pressable>

                        {showDate && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                onChange={(_, d) => {
                                    setShowDate(false);
                                    if (d) setDate(d);
                                }}
                            />
                        )}
                    </View>

                    {/* NOTE */}
                    <View>
                        <Text className="font-medium mb-1">
                            Note
                        </Text>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="Optional"
                            className="border border-gray-300 rounded-xl p-3"
                        />
                    </View>

                    <Button
                        title={
                            isEdit
                                ? "Update Transaction"
                                : "Create Transaction"
                        }
                        onPress={handleSave}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>


    );
}
