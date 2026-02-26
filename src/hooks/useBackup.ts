import { useEffect, useState } from 'react';
import { BackupScheduler } from '../database/data-transfer/backup.scheduler';
import { BackupService } from '../database/data-transfer/backup.service';

export const useBackup = () => {
    const [lastBackup, setLastBackup] = useState<number | null>(null);
    const [autoEnabled, setAutoEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const date = await BackupService.getLastBackupDate();
        const auto = await BackupScheduler.isAutoBackupEnabled();
        setLastBackup(date ?? null);
        setAutoEnabled(auto);
    };

    const exportNow = async (data: any) => {
        setLoading(true);
        await BackupService.exportToFile(data);
        await init();
        setLoading(false);
    };

    const toggleAutoBackup = async (value: boolean) => {
        await BackupScheduler.setAutoBackup(value);
        setAutoEnabled(value);
    };

    return {
        lastBackup,
        autoEnabled,
        loading,
        exportNow,
        toggleAutoBackup,
    };
};