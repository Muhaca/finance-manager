//Account
export type Account = {
    id: string;
    name: string;
    balance: number;
    created_at: string;
};

export type AccountPayload = {
    id: string;
    name: string;
    balance?: number;
};

//Category
export type CategoryType = "income" | "expense";

export type Category = {
    id: string;
    name: string;
    type: CategoryType;
    parent_code: string;
};

export type CreateCategoryPayload = {
    name: string;
    type: CategoryType;
};

export type UpdateCategoryPayload = {
    id: string;
    name?: string;
    type?: CategoryType;
};

//Transaction
export type TransactionType = "income" | "expense";

export type TransactionEntity = {
    id: string;
    account_id: string;
    category_id: string;
    amount: number;
    type: TransactionType;
    note?: string;
    date: string;
};

export type TransactionWithRelation = TransactionEntity & {
    category_name: string;
    account_name: string;
};

export type TransactionItemProps = {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    date: string;
    accountName?: string;
    categoryName?: string;
    onPress?: () => void;
    onLongPress?: () => void;
};



