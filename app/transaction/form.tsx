import DateTimePicker from "@react-native-community/datetimepicker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import uuid from 'react-native-uuid';

import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
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


import { CategoryIcon } from "@/src/components/ui/CategoryIcons";
import { categoryTypeList } from "@/src/constants/cetegoryTypeList";
import {
    Account,
    Category,
    TransactionEntity,
    TransactionType
} from "@/src/types/finance";
import { formattedRupiah } from "@/src/utils/currency";
import { Ionicons } from "@expo/vector-icons";

export default function TransactionFormScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEdit = !!id;

    const [type, setType] =
        useState<TransactionType>("expense");
    const [amount, setAmount] = useState<number>();
    const [displayValue, setDisplayValue] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(new Date());
    const [inputHeight, setInputHeight] = useState(100);

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<Category>();
    const [modalVisible, setModalVisible] = useState(false);

    const [accountId, setAccountId] =
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

        const category = categories.find((cat) => cat.id === tx.category_id)

        setType(tx.type);
        setAmount(tx.amount);
        setDisplayValue(formattedRupiah(tx.amount));
        setNote(tx.note ?? "");
        setDate(new Date(tx.date));
        setAccountId(tx.account_id);
        setSelectedCategory(categories.find((cat) => cat.id === category?.parent_code));
        setSelectedSubCategory(category);
    }, [id, categories]);

    const handleSave = () => {
        if (!accountId || !selectedSubCategory || !amount) {
            Alert.alert("Validation", "Complete all fields");
            return;
        }

        const payload: TransactionEntity = {
            id: id ? id : uuid.v4(),
            account_id: accountId,
            category_id: selectedSubCategory?.id,
            amount: Number(amount),
            type: type,
            note: note,
            date: date.toISOString(),

        };

        if (isEdit) {
            transactionRepo.update(payload);
        } else {
            transactionRepo.create(payload);
        }

        router.back();
    };

    const handleDelete = () => {
        if (!id) return;

        transactionRepo.delete(id);
        router.back();
    };

    const getSubCategories = (parentId: string) => {
        return categories.filter(
            (cat) => cat.parent_code === parentId
        );
    };

    const handleChangeAmount = (text: string) => {
        // Hapus semua karakter selain angka
        const numeric = text.replace(/[^0-9]/g, "");

        const numberValue = Number(numeric);

        setAmount(numberValue);
        setDisplayValue(formattedRupiah(numberValue));
    };

    const handleSelectCategory = (category: Category) => {
        setSelectedCategory(category);
        if (category.id !== selectedCategory?.id) setSelectedSubCategory(undefined);
        if (category.type === "expense") {
            setModalVisible(true);
            return
        }
        setSelectedSubCategory(category);
    };

    const handleSelectSubCategory = (category: Category) => {
        setSelectedSubCategory(category);
        setModalVisible(false);
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
            <Stack.Screen
                options={{
                    title: isEdit ? "Edit Transaksi" : "Tambah Transaksi",
                }}
            />
            <ScrollView
                className="flex-1 bg-gray-50"
                contentContainerStyle={{
                    padding: 4,
                    paddingBottom: 200, // space FAB / button
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* FORM CONTENT */}
                <View className="flex-1 bg-white p-5 gap-4">
                    {/* TYPE */}
                    <View className="flex-row gap-3">
                        {categoryTypeList
                            .map((t) => (
                                <Pressable
                                    key={t.code}
                                    disabled={isEdit}
                                    onPress={() => setType(t.code as TransactionType)}
                                    className={`flex-1 p-3 rounded-xl border ${type === t.code
                                        ? "bg-[#C00B70] border-[#C00B70]"
                                        : "bg-white border-gray-300"
                                        }`}
                                >
                                    <Text
                                        className={`text-center font-semibold ${type === t.code
                                            ? "text-white"
                                            : "text-black"
                                            }`}
                                    >
                                        {t.label}
                                    </Text>
                                </Pressable>
                            ))}
                    </View>

                    {/* AMOUNT */}
                    <View>
                        <Text className="mb-1 font-medium">
                            Jumlah
                        </Text>
                        <TextInput
                            value={displayValue}
                            onChangeText={handleChangeAmount}
                            keyboardType="numeric"
                            placeholder="Rp 0"
                            className="border border-gray-300 rounded-xl p-3"
                        />
                    </View>

                    {/* CATEGORY */}
                    <View>
                        <Text className="font-medium">
                            Category
                        </Text>
                        <View className="flex-row flex-wrap -mx-2 mt-2">
                            {categories.filter((cat) => cat.parent_code === "cat_exp" || cat.parent_code === "cat_inc").map((cat) => (
                                <View key={cat.id} className="w-1/3 px-2 mb-3">
                                    <Pressable
                                        key={cat.id}
                                        onPress={() => handleSelectCategory(cat)}
                                        className={`p-3 rounded-xl h-24 border ${selectedCategory?.id === cat.id
                                            ? "bg-[#C00B70] border-[#C00B70]"
                                            : "bg-white border-gray-300"
                                            }`}
                                    >
                                        <View className="flex items-center">
                                            <CategoryIcon
                                                name={cat.name}
                                                size={24}
                                                color={selectedCategory?.id === cat.id ? "white" : "black"}
                                            />
                                            <Text
                                                className={
                                                    selectedCategory?.id === cat.id
                                                        ? "text-white"
                                                        : "text-black"
                                                }
                                            >
                                                {cat.name}
                                            </Text>
                                            {selectedCategory?.id === cat.id && (
                                                <Text
                                                    className="text-white text-xs italic"
                                                >
                                                    {selectedSubCategory?.name}
                                                </Text>
                                            )}

                                        </View>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Modal */}
                    <Modal
                        visible={modalVisible}
                        transparent
                        animationType="slide"
                    >
                        <View className="flex-1 bg-black/40 justify-end">
                            <View className="bg-white rounded-t-3xl max-h-[60%]">
                                <View className="flex h-[60px] rounded-s-3xl items-center bg-[#C00B70] p-2">
                                    <CategoryIcon
                                        name={selectedCategory?.name || ""}
                                        size={24}
                                        color="white"
                                    />
                                    <Text className="text-lg font-semibold mb-4 text-white">
                                        Pilih {selectedCategory?.name}
                                    </Text>
                                </View>

                                {selectedCategory &&
                                    getSubCategories(selectedCategory.id).map((sub) => (
                                        <Pressable
                                            key={sub.id}
                                            onPress={() => handleSelectSubCategory(sub)}
                                            className={` ${selectedSubCategory?.id === sub.id ? "bg-gray-200" : ""}`}
                                        >
                                            <View className="flex flex-row p-3 border-b border-gray-200 items-center gap-3">
                                                <CategoryIcon
                                                    name={sub.name}
                                                    size={24}
                                                    color="black"
                                                />
                                                <Text>{sub.name}</Text>
                                            </View>
                                        </Pressable>
                                    ))}

                                <Pressable
                                    onPress={() => setModalVisible(false)}
                                    className="mt-4 p-3 bg-gray-200"
                                >
                                    <Text className="text-center">Tutup</Text>
                                </Pressable>

                            </View>
                        </View>
                    </Modal>

                    {/* ACCOUNT */}
                    <View className="w-full">
                        <Text className="font-medium">
                            Akun
                        </Text>
                        <View className="flex-row flex-wrap -mx-2 mt-2">
                            {accounts.map((acc) => (
                                <View key={acc.id} className="w-1/2 px-2 mb-3">
                                    <Pressable
                                        key={acc.id}
                                        onPress={() => setAccountId(acc.id)}
                                        className={`p-3 rounded-xl border ${accountId === acc.id
                                            ? "bg-[#C00B70] border-[#C00B70]"
                                            : "bg-white border-gray-300"
                                            }`}
                                    >
                                        <View className="flex-row items-center gap-2">
                                            <Ionicons name="wallet-outline" size={24} color={accountId === acc.id ? "white" : "black"} />
                                            <View>
                                                <Text
                                                    className={
                                                        accountId === acc.id
                                                            ? "text-white"
                                                            : "text-black"
                                                    }
                                                >
                                                    {acc.name}
                                                </Text>
                                                <Text
                                                    className={
                                                        accountId === acc.id
                                                            ? "text-white"
                                                            : "text-black"
                                                    }
                                                >
                                                    {formattedRupiah(acc.balance)}
                                                </Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                </View>
                            ))}

                        </View>
                    </View>


                    {/* NOTE */}
                    <View>
                        <Text className="font-medium mb-1">
                            Note
                        </Text>
                        <TextInput
                            multiline
                            value={note}
                            onChangeText={setNote}
                            onContentSizeChange={(e) =>
                                setInputHeight(e.nativeEvent.contentSize.height)
                            }
                            style={{ height: Math.max(100, inputHeight) }}
                            textAlignVertical="top"
                            className="border border-gray-300 rounded-xl p-3"
                        />
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

                    <Pressable
                        className="mt-4 h-14 bg-[#C00B70] rounded-xl p-3"
                        onPress={handleSave}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {isEdit
                                ? "Update Transaksi"
                                : "Simpan Transaksi"}
                        </Text>
                    </Pressable>
                    {isEdit && (
                        <Pressable
                            className="h-14 bg-[#B41847] rounded-xl p-3"
                            onPress={handleDelete}
                        >
                            <Text className="text-white text-center font-bold text-lg">
                                Hapus Transaksi
                            </Text>
                        </Pressable>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>


    );
}
