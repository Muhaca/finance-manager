import {
  TransactionEntity,
} from "@/src/types/finance";
import { getSignedAmount } from "@/src/utils/balance";
import { db } from "../db";
import { accountRepo } from "./accountRepo";

export const transactionRepo = {
  // 📥 Get all
  getAll(): TransactionEntity[] {
    return db.getAllSync<TransactionEntity>(`
      SELECT
        t.id,
        t.type,
        t.amount,
        t.date,
        t.note,
        c.name AS category_name,
        a.name AS account_name
      FROM transactions t
      LEFT JOIN categories c
        ON c.id = t.category_id
      LEFT JOIN accounts a
        ON a.id = t.account_id
      ORDER BY t.date DESC
    `) as TransactionEntity[];
  },

  // 📥 Get by id
  getById(id: string): TransactionEntity | null {
    const row = db.getFirstSync<TransactionEntity>(
      `    SELECT
      t.id,
      t.type,
      t.amount,
      t.date,
      t.note,
      t.category_id,
      t.account_id
    FROM transactions t
    WHERE t.id = ?
  `, [id]
    );
    return row ?? null;
  },

  create(data: TransactionEntity) {
    db.runSync(
      `INSERT INTO transactions (
      id,
      account_id,
      category_id,
      amount,
      type,
      note,
      date
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.id,
        data.account_id,
        data.category_id ?? null,
        data.amount,
        data.type,
        data.note ?? null,
        data.date
      ]
    );

    // 🔥 Balance update
    const delta = getSignedAmount(
      data.type,
      data.amount
    );

    accountRepo.updateBalance(
      data.account_id,
      delta
    );
  },

  // ✏️ Update transaction (recalculate balance)
  update(data: TransactionEntity) {
    // 1️⃣ ambil data lama (Full)
    const old = db.getFirstSync<TransactionEntity>(
      `SELECT * FROM transactions WHERE id = ?`,
      [data.id]
    );

    if (!old) return;

    // 2️⃣ revert balance lama based on OLD data
    const oldDelta = -getSignedAmount(old.type, old.amount);

    accountRepo.updateBalance(
      old.account_id,
      oldDelta
    );

    // 3️⃣ Prepare merged data for update
    const newType = data.type ?? old.type;
    const newAmount = data.amount ?? old.amount;
    const newCategoryId = data.category_id ?? old.category_id;
    const newAccountId = data.account_id ?? old.account_id;
    const newDate = data.date ?? old.date;
    const newNote = data.note ?? old.note ?? '';

    // 3️⃣ update transaksi
    db.runSync(
      `UPDATE transactions SET
      type = ?,
      amount = ?,
      category_id = ?,
      account_id = ?,
      date = ?,
      note = ?
     WHERE id = ?`,
      [
        newType,
        newAmount,
        newCategoryId,
        newAccountId,
        newDate,
        newNote,
        data.id,
      ]
    );

    // 4️⃣ apply balance baru based on NEW data
    const newDelta = getSignedAmount(newType, newAmount);

    accountRepo.updateBalance(
      newAccountId,
      newDelta
    );
  },

  // ❌ Delete transaction + revert balance
  delete(id: string) {
    // 1️⃣ ambil transaksi dulu
    const tx = db.getFirstSync<Pick<TransactionEntity, "type" | "amount" | "account_id">>(
      `SELECT type, amount, account_id
     FROM transactions
     WHERE id = ?`,
      [id]
    );

    if (!tx) return;

    // 2️⃣ revert balance
    const delta =
      -getSignedAmount(tx.type, tx.amount);

    accountRepo.updateBalance(
      tx.account_id,
      delta
    );

    // 3️⃣ delete
    db.runSync(
      `DELETE FROM transactions WHERE id = ?`,
      [id]
    );
  },

  getTotalBalance(): number {
    const result = db.getFirstSync<{ total: number }>(`
    SELECT SUM(
      CASE 
        WHEN type = 'income' THEN amount
        ELSE -amount
      END
    ) as total
    FROM transactions
  `);

    return result?.total ?? 0;
  },

  getBalanceByAccount() {
    return db.getAllSync(`
    SELECT 
      a.id,
      a.name,
      SUM(
        CASE 
          WHEN t.type = 'income' THEN t.amount
          ELSE -t.amount
        END
      ) as balance
    FROM accounts a
    LEFT JOIN transactions t 
      ON t.account_id = a.id
    GROUP BY a.id
  `);
  },

  getSummaryCurrentMonth() {
    return db.getFirstSync<any>(`
    SELECT
      SUM(
        CASE 
          WHEN type = 'income' THEN amount 
          ELSE 0 
        END
      ) as total_income,
      
      SUM(
        CASE 
          WHEN type = 'expense' THEN amount 
          ELSE 0 
        END
      ) as total_expense
      
    FROM transactions
    WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
  `);
  },

  getRecent(limit = 5) {
    return db.getAllSync<any>(`
    SELECT 
      t.*,
      a.name as account_name,
      c.name as category_name
    FROM transactions t
    LEFT JOIN accounts a ON a.id = t.account_id
    LEFT JOIN categories c ON c.id = t.category_id
    ORDER BY t.date DESC
    LIMIT ${limit}
  `);
  },

  getTotalAccountBalance() {
    return db.getFirstSync<any>(`
    SELECT SUM(balance) as total FROM accounts
  `);
  },

  getMonthlySummary(year: number) {
    return db.getAllSync<any>(`
    SELECT
      strftime('%m', date) as month,

      SUM(
        CASE 
          WHEN type = 'income' 
          THEN amount 
          ELSE 0 
        END
      ) as income,

      SUM(
        CASE 
          WHEN type = 'expense' 
          THEN amount 
          ELSE 0 
        END
      ) as expense

    FROM transactions
    WHERE strftime('%Y', date) = '${year}'
    GROUP BY month
    ORDER BY month
  `);
  },

  getExpenseByCategory() {
    return db.getAllSync<any>(`
    SELECT 
      c.name as category,
      SUM(t.amount) as total
    FROM transactions t
    LEFT JOIN categories c 
      ON c.id = t.category_id
    WHERE t.type = 'expense'
    GROUP BY c.name
    ORDER BY total DESC
  `);
  },






};
