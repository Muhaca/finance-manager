import { db } from "./db";

export const initDB = () => {
    // Accounts
    db.execSync(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      balance REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

    // Categories
    db.execSync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('income','expense')) NOT NULL
    );
  `);

    // Transactions
    db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER,
      category_id INTEGER,
      amount REAL NOT NULL,
      type TEXT CHECK(type IN ('income','expense')) NOT NULL,
      note TEXT,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(account_id) REFERENCES accounts(id),
      FOREIGN KEY(category_id) REFERENCES categories(id)
    );
  `);
};
