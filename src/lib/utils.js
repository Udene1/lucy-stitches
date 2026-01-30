import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount)
}

export function formatPhoneNumber(phone) {
    // Simple Nigerian format: +234 XXXXXXXXXX
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('234')) {
        return '+' + cleaned
    }
    if (cleaned.startsWith('0')) {
        return '+234' + cleaned.substring(1)
    }
    return cleaned
}

export function formatDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}
