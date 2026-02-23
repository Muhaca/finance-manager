// src/modules/backup/backup.import.ts

import * as FileSystem from "expo-file-system";
import { BackupPayload } from "./buckup.types";

export class ImportService {
  /**
   * Read & parse backup file
   */
  static async readBackupFile<T>(
    fileUri: string
  ): Promise<BackupPayload<T>> {
    const file = new FileSystem.File(fileUri);

    const exists = await file.exists;
    if (!exists) {
      throw new Error("Backup file not found");
    }

    const content = await file.text();

    let parsed: BackupPayload<T>;

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("Invalid JSON format");
    }

    this.validatePayload(parsed);

    return parsed;
  }

  /**
   * Validate structure
   */
  private static validatePayload<T>(
    payload: any
  ): asserts payload is BackupPayload<T> {
    if (!payload.version) {
      throw new Error("Invalid backup version");
    }

    if (!payload.exportDate) {
      throw new Error("Missing export date");
    }

    if (payload.data === undefined) {
      throw new Error("Missing backup data");
    }
  }

  /**
   * Restore into database
   */
  static async restoreTransactions(
    fileUri: string,
    db: any
  ) {
    const backup = await this.readBackupFile<any[]>(fileUri);

    const transactions = backup.data;

    if (!Array.isArray(transactions)) {
      throw new Error("Backup data format invalid");
    }

    // 🔥 IMPORTANT: Use transaction for safety
    db.execSync("BEGIN TRANSACTION");

    try {
      // Optional: clear old data
      db.execSync("DELETE FROM transactions");

      for (const trx of transactions) {
        db.runSync(
          `INSERT INTO transactions (amount, type, date)
           VALUES (?, ?, ?)`,
          [trx.amount, trx.type, trx.date]
        );
      }

      db.execSync("COMMIT");
    } catch (error) {
      db.execSync("ROLLBACK");
      throw error;
    }
  }
}