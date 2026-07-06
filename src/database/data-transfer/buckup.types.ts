// modules/data-transfer/types.ts

export interface BackupPayload<T = any> {
    version: number;
    app: string;
    exportDate: string;
    data: T;
}