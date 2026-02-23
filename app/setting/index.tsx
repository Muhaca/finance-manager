import { BackupService } from '@/src/database/data-transfer/backup.service';
import { ImportService } from '@/src/database/data-transfer/buckup.import';
import { db } from '@/src/database/db';
import { transactionRepo } from '@/src/database/repositories/transactionRepo';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from "expo-sharing";
import { Pressable, Text, View } from 'react-native';

export default function DataBackupScreen() {

    const handleExport = async () => {
        const transactions = transactionRepo.getAll();

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
        <View className="flex-1 bg-white p-6">
            <Text className="text-xl font-bold mb-6">
                Data & Backup
            </Text>

            {/* Export Section */}
            <View className="mb-8">
                <Text className="text-base font-semibold mb-2">
                    Export Data
                </Text>

                <Text className="text-sm text-gray-500 mb-3">
                    Last Backup: Never
                    {/* Last Backup: {lastBackup ? new Date(lastBackup * 1000).toLocaleString() : 'Never'} */}
                </Text>

                <Pressable
                    onPress={handleExport}
                    className="bg-blue-600 py-3 rounded-xl items-center"
                >
                    <Text className="text-white font-semibold">
                        Export Now
                    </Text>
                </Pressable>
            </View>

            {/* Import Section */}
            <View className="mb-8">
                <Text className="text-base font-semibold mb-2">
                    Import Data
                </Text>

                <Pressable
                    onPress={handleImport}
                    className="bg-red-600 py-3 rounded-xl items-center"
                >
                    <Text className="text-white font-semibold">
                        Import Backup
                    </Text>
                </Pressable>
            </View>

            {/* Auto Backup Section */}
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-base font-semibold">
                        Auto Monthly Backup
                    </Text>
                    <Text className="text-sm text-gray-500">
                        Automatically backup every month
                    </Text>
                </View>

                {/* <Switch
                    value={autoEnabled}
                    onValueChange={toggleAutoBackup}
                /> */}
            </View>
        </View>
    );
}