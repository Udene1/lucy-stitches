export const paystack = {
    async initiate(data) {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                amount: Math.round(data.amount * 100), // Paystack expects kobo
                reference: data.reference,
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/callback`,
                metadata: {
                    orderId: data.orderId,
                },
            }),
        })
        return response.json()
    },

    async verify(reference) {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        })
        return response.json()
    },
}
