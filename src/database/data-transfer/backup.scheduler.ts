import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTO_BACKUP_KEY = 'auto_backup_enabled';

export const BackupScheduler = {
    async setAutoBackup(enabled: boolean) {
        await AsyncStorage.setItem(AUTO_BACKUP_KEY, String(enabled));
    },

    async isAutoBackupEnabled() {
        const value = await AsyncStorage.getItem(AUTO_BACKUP_KEY);
        return value === 'true';
    },
};