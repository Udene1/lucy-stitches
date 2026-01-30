import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(request) {
    const secret = process.env.PAYSTACK_SECRET_KEY
    const hash = crypto.createHmac('sha512', secret).update(await request.text()).digest('hex')

    if (hash !== request.headers.get('x-paystack-signature')) {
        return new Response('Invalid signature', { status: 401 })
    }

    const event = await request.json()

    if (event.event === 'charge.success') {
        const { reference, metadata } = event.data
        const orderId = metadata.orderId

        // Update order status in Supabase
        await supabaseAdmin
            .from('orders')
            .update({ payment_status: 'paid', payment_reference: reference })
            .eq('id', orderId)
    }

    return NextResponse.json({ received: true })
}
