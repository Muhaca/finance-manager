export function getSignedAmount(
    type: 'income' | 'expense',
    amount: number
) {
    return type === 'income' ? amount : -amount;
}
