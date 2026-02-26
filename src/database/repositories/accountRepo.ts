import {
    Account,
    AccountPayload
} from "@/src/types/finance";
import { db } from "../db";

export const accountRepo = {
    // 📥 Get all accounts
    getAll(): Account[] {
        const rows = db.getAllSync<Account>(
            `SELECT * FROM accounts ORDER BY created_at DESC`
        );
        return rows;
    },

    // 📥 Get account by ID
    getById(id: string): Account | null {
        const row = db.getFirstSync<Account>(
            `SELECT * FROM accounts WHERE id = ?`,
            [id]
        );
        return row ?? null;
    },

    // ➕ Create account
    create(payload: AccountPayload) {
        db.runSync(
            `INSERT INTO accounts (id, name, balance) VALUES (?, ?, ?)`,
            [payload.id, payload.name, payload.balance ?? 0]
        );
    },

    // ✏️ Update account
    update(payload: AccountPayload) {
        const fields: string[] = [];
        const values: any[] = [];

        if (payload.name !== undefined) {
            fields.push("name = ?");
            values.push(payload.name);
        }

        if (payload.balance !== undefined) {
            fields.push("balance = ?");
            values.push(payload.balance);
        }

        if (!fields.length) return;

        values.push(payload.id);

        db.runSync(
            `UPDATE accounts SET ${fields.join(", ")} WHERE id = ?`,
            values
        );
    },

    // ❌ Delete account
    delete(id: number) {
        db.runSync(`DELETE FROM accounts WHERE id = ?`, [id]);
    },

    // ✏️ Update balance
    updateBalance(accountId: string, delta: number) {
        db.runSync(
            `UPDATE accounts
     SET balance = balance + ?
     WHERE id = ?`,
            [delta, accountId]
        );
    },
};
