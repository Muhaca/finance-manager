import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import uuid from 'react-native-uuid';

import { accountRepo } from "@/src/database/repositories/accountRepo";
import { formattedRupiah } from "@/src/utils/currency";

export default function AccountFormScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    const isEdit = !!id;

    const [name, setName] = useState("");
    const [balance, setBalance] = useState<number>();
    const [displayValue, setDisplayValue] = useState("");

    // Load detail kalau edit
    useEffect(() => {
        if (id) {
            const data = accountRepo.getById(id);
            if (data) {
                setName(data.name);
                setBalance(data.balance)
            }
        }
    }, [id]);

    const handleSave = () => {
        if (!name) {
            Alert.alert("Validation", "Account name required");
            return;
        }

        const payload = {
            id: id ? id : uuid.v4(),
            name: name,
            balance: Number(balance),
        }

        if (isEdit) {
            accountRepo.update(payload);
        } else {
            accountRepo.create(payload);
        }

        router.back();
    };

    const handleDelete = () => {
        Alert.alert("Delete", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    accountRepo.delete(Number(id));
                    router.back();
                },
            },
        ]);
    };

    const handleChangeAmount = (text: string) => {
        // Hapus semua karakter selain angka
        const numeric = text.replace(/[^0-9]/g, "");

        const numberValue = Number(numeric);

        setBalance(numberValue);
        setDisplayValue(formattedRupiah(numberValue));
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
                    title: isEdit ? "Edit Account" : "Tambah Account",
                }}
            />
            <View style={{ flex: 1, padding: 20, gap: 16 }}>
                <Text>Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Cash / BCA / E-Wallet"
                    style={{
                        borderWidth: 1,
                        padding: 12,
                        borderRadius: 8,
                    }}
                />

                <Text>Balance</Text>
                <TextInput
                    value={displayValue}
                    onChangeText={handleChangeAmount}
                    keyboardType="numeric"
                    placeholder="Rp 0"
                    className="border border-gray-300 rounded-xl p-3"
                />

                <Pressable
                    className="mt-4 h-14 bg-[#C00B70] rounded-xl p-3"
                    onPress={handleSave}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {isEdit
                            ? "Update Account"
                            : "Simpan Account"}
                    </Text>
                </Pressable>

                {isEdit && (
                    <Pressable
                        className="h-14 bg-red-700 rounded-xl p-3"
                        onPress={handleDelete}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            Delete Account
                        </Text>
                    </Pressable>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
