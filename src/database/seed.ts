import { categoriesExpense, categoriesIncome } from "../constants/categories";
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

    categoriesExpense.forEach((category) => {
        db.runSync(
            `INSERT INTO categories (id, name, type, parent_code) VALUES (?, ?, 'expense', ?)`,
            [category.id, category.name, category.parent_code]
        );
    });

    categoriesIncome.forEach((category) => {
        db.runSync(
            `INSERT INTO categories (id, name, type, parent_code) VALUES (?, ?, 'income', ?)`,
            [category.id, category.name, category.parent_code]
        );
    });
};
