import { NextResponse } from 'next/server'
import { paystack } from '@/lib/paystack'

export async function POST(request) {
    const { orderId, amount, email } = await request.json()

    try {
        const result = await paystack.initiate({
            orderId,
            amount,
            email,
            reference: `PAY-${Date.now()}`
        })

        if (result.status) {
            return NextResponse.json({ url: result.data.authorization_url })
        } else {
            throw new Error(result.message)
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
