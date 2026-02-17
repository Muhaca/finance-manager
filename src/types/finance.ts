//Account
export type Account = {
    id: number;
    name: string;
    balance: number;
    created_at: string;
};

export type CreateAccountPayload = {
    name: string;
    balance?: number;
};

export type UpdateAccountPayload = {
    id: number;
    name?: string;
    balance?: number;
};

//Category
export type CategoryType = "income" | "expense";

export type Category = {
    id: number;
    name: string;
    type: CategoryType;
};

export type CreateCategoryPayload = {
    name: string;
    type: CategoryType;
};

export type UpdateCategoryPayload = {
    id: number;
    name?: string;
    type?: CategoryType;
};

//Transaction
export type TransactionType = "income" | "expense";

export type Transaction = {
    id: string;
    account_id: number;
    category_id: number;
    amount: number;
    type: TransactionType;
    note?: string;
    date: string;
    created_at: string;
    notes?: string;

    // relation
    category_name: string;
    account_name: string;
};

export type CreateTransactionPayload = {
    id: string;
    account_id: number;
    category_id: number;
    amount: number;
    type: TransactionType;
    note?: string;
    date: string;
};

export type UpdateTransactionPayload = {
    id: string;
    account_id?: number;
    category_id?: number;
    amount?: number;
    type?: TransactionType;
    note?: string;
    date?: string;
};

export type TransactionItemProps = {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    accountName?: string;
    categoryName?: string;
    onPress?: () => void;
    onLongPress?: () => void;
};



