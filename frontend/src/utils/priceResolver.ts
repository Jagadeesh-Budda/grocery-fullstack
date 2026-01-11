export type PriceResult = {
    amount?: number;
    currency?: string;
    formatted?: string | null;
};

function toNumber(value: any): number | undefined {
    if (value == null) return undefined;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const n = Number(value.replace(/[^\d.-]/g, ''));
        return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
}

export function resolvePrice(input: any, options?: { locale?: string; currency?: string }): PriceResult {
    const locale = options?.locale ?? 'en-IN';
    const fallbackCurrency = options?.currency;
    const finalCurrency = fallbackCurrency ?? 'INR';


    if (input == null) return { formatted: null };

    // candidate extractors (handles price, unitPrice, pricePerUnit, amount, nested pricing, etc.)
    const candidates: any[] = [
        input,
        input?.price,
        input?.sellingPrice,
        input?.mrp,
        input?.basePrice,
        input?.pricePerKg,
        input?.unitPrice,
        input?.pricePerUnit,
        input?.amount,
        input?.pricing,
        input?.pricing?.price,
        input?.pricing?.sellingPrice,
        input?.pricing?.mrp,
        input?.pricing?.basePrice,
        input?.pricing?.unitPrice,
        input?.pricing?.pricePerUnit,
        input?.pricing?.amount,
    ];

    for (const c of candidates) {
        if (c == null) continue;

        // If candidate is a primitive number/string
        const num = toNumber(c);
        if (num !== undefined) {
            const currency = fallbackCurrency;
            const formatted = new Intl.NumberFormat(locale, currency ? { style: 'currency', currency } : { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
            return { amount: num, currency, formatted };
        }

        // If candidate is an object with amount and optionally currency
        if (typeof c === 'object') {
            const amountCandidate = 
                c.amount ?? 
                c.value ?? 
                c.price ?? 
                c.sellingPrice ?? 
                c.mrp ??
                c.basePrice ??
                c.pricePerKg ??
                c.unitPrice ?? 
                c.pricePerUnit;
            
            const amount = toNumber(amountCandidate);
            const currency = (c.currency ?? c.currencyCode ?? c.curr) ?? fallbackCurrency;
            if (amount !== undefined) {
                const formatted = currency
                    ? new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
                    : new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
                return { amount, currency, formatted };
            }
        }
    }

    return { formatted: null };
}