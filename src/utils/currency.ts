
export const formattedRupiah = (amount: number | undefined | string) => {
    const value = amount ? amount : 0
    const format = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Rupiah is typically displayed without decimals
        maximumFractionDigits: 0
    }).format(Number(value))
    return format
}
