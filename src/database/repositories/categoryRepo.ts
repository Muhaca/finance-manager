import {
    Category,
    CategoryType,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "@/src/types/finance";
import { db } from "../db";

export const categoryRepo = {
    // 📥 Get all
    getAll(): Category[] {
        return db.getAllSync<Category>(
            `SELECT * FROM categories ORDER BY name ASC`
        );
    },

    // 📥 Get by type
    getByType(type: CategoryType): Category[] {
        return db.getAllSync<Category>(
            `SELECT * FROM categories WHERE type = ? ORDER BY name ASC`,
            [type]
        );
    },

    // 📥 Get by id
    getById(id: number): Category | null {
        const row = db.getFirstSync<Category>(
            `SELECT * FROM categories WHERE id = ?`,
            [id]
        );
        return row ?? null;
    },

    // ➕ Create
    create(payload: CreateCategoryPayload) {
        db.runSync(
            `INSERT INTO categories (name, type) VALUES (?, ?)`,
            [payload.name, payload.type]
        );
    },

    // ✏️ Update
    update(payload: UpdateCategoryPayload) {
        const fields: string[] = [];
        const values: any[] = [];

        if (payload.name !== undefined) {
            fields.push("name = ?");
            values.push(payload.name);
        }

        if (payload.type !== undefined) {
            fields.push("type = ?");
            values.push(payload.type);
        }

        if (!fields.length) return;

        values.push(payload.id);

        db.runSync(
            `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`,
            values
        );
    },

    // ❌ Delete
    delete(id: number) {
        db.runSync(`DELETE FROM categories WHERE id = ?`, [id]);
    },
};
