import * as FileSystem from "expo-file-system";
import { BackupPayload } from "./buckup.types";
import { createBackupFileName } from "./buckup.utils";

export class BackupService {
    static async exportToFile<T>(data: T) {
        const payload: BackupPayload<T> = {
            version: 1,
            app: "Finance App",
            exportDate: new Date().toISOString(),
            data,
        };

        const fileName = createBackupFileName();

        const file = new FileSystem.File(
            FileSystem.Paths.document,
            fileName
        );

        await file.write(JSON.stringify(payload));

        return file;
    }

    static async exportAsString<T>(data: T) {
        const file = await this.exportToFile(data);
        return await file.text();
    }

    static async getAllBackups() {
        const dir = new FileSystem.Directory(
            FileSystem.Paths.document
        );

        const files = await dir.list();

        return files.filter(file =>
            file.name.startsWith("finance-backup")
        );
    }

    static async deleteBackup(fileName: string) {
        const file = new FileSystem.File(
            FileSystem.Paths.document,
            fileName
        );

        await file.delete();
    }

    static async getLastBackupDate() {
        const file = new FileSystem.File(
            FileSystem.Paths.document,
            "finance-backup.json"
        );

        if (!file.exists) return null;

        return file.modificationTime ?? null;
    }
}