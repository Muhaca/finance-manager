import { BackupService } from '@/src/database/data-transfer/backup.service';
import { ImportService } from '@/src/database/data-transfer/buckup.import';
import { db } from '@/src/database/db';
import { transactionRepo } from '@/src/database/repositories/transactionRepo';
import * as DocumentPicker from 'expo-document-picker';
import { Stack } from 'expo-router';
import * as Sharing from "expo-sharing";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

export default function DataBackupScreen() {
    const handleExport = async () => {
        const transactions = transactionRepo.getBackup();

        const file = await BackupService.exportToFile(transactions);
        await Sharing.shareAsync(file.uri);
    };

    const handleImport = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: "application/json",
        });

        if (result.canceled) return;

        const fileUri = result.assets[0].uri;

        try {
            await ImportService.restoreTransactions(fileUri, db);
            alert("Import successful!");
        } catch (err: any) {
            alert(err.message);
        }
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
                    title: "Setting",
                }}
            />
            <View className='flex-1 bg-white'>
                <View className="flex flex-col gap-2 p-6">
                    <Text className="text-xl font-bold">
                        Data & Backup
                    </Text>
                    <View className="flex flex-col gap-3">
                        {/* Export Section */}
                        <View className="flex flex-col gap-2">
                            <Text className="text-base font-semibold">
                                Export Data
                            </Text>
                            <Pressable
                                onPress={handleExport}
                                className="bg-[#F86DA0] py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-semibold">
                                    Export Now
                                </Text>
                            </Pressable>
                        </View>

                        {/* Import Section */}
                        <View className="flex flex-col gap-2">
                            <Text className="text-base font-semibold">
                                Import Data
                            </Text>

                            <Pressable
                                onPress={handleImport}
                                className="bg-[#C00B70] py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-semibold">
                                    Import Backup
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}