import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

import { accountRepo } from "@/src/database/repositories/accountRepo";

export default function AccountFormScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    const isEdit = !!id;

    const [name, setName] = useState("");
    const [balance, setBalance] = useState("0");

    // Load detail kalau edit
    useEffect(() => {
        if (id) {
            const data = accountRepo.getById(Number(id));
            if (data) {
                setName(data.name);
                setBalance(String(data.balance));
            }
        }
    }, [id]);

    const handleSave = () => {
        if (!name) {
            Alert.alert("Validation", "Account name required");
            return;
        }

        if (isEdit) {
            accountRepo.update({
                id: Number(id),
                name,
                balance: Number(balance),
            });
        } else {
            accountRepo.create({
                name,
                balance: Number(balance),
            });
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

    return (
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
                value={balance}
                onChangeText={setBalance}
                keyboardType="numeric"
                style={{
                    borderWidth: 1,
                    padding: 12,
                    borderRadius: 8,
                }}
            />

            <Button
                title={isEdit ? "Update Account" : "Create Account"}
                onPress={handleSave}
            />

            {isEdit && (
                <Button
                    title="Delete"
                    color="red"
                    onPress={handleDelete}
                />
            )}
        </View>
    );
}
