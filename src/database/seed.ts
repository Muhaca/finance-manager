import { db } from "./db";

export const seedCategories = () => {
    const count = db.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM categories`
    );

    // Kalau sudah ada → skip
    if ((count?.count ?? 0) > 0) {
        console.log("Categories already seeded");
        return;
    }

    console.log("Seeding categories...");

    // Expense
    const expenses = [
        "Makan",
        "Belanja",
        "Transport",
        "Tagihan",
        "Hiburan",
        "Kesehatan",
    ];

    // Income
    const incomes = [
        "Gaji",
        "Bonus",
        "Freelance",
        "Gift",
        "Investasi",
    ];

    expenses.forEach((name) => {
        db.runSync(
            `INSERT INTO categories (name, type) VALUES (?, 'expense')`,
            [name]
        );
    });

    incomes.forEach((name) => {
        db.runSync(
            `INSERT INTO categories (name, type) VALUES (?, 'income')`,
            [name]
        );
    });
};
