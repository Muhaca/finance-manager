export const createBackupFileName = () => {
    const date = new Date().toISOString().split("T")[0];
    return `finance-backup-${date}.json`;
};