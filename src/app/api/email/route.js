import { sendEmail } from '@/lib/resend'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const { to, subject, type, data } = await request.json()

  let html = ''
  if (type === 'order_update') {
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #064e3b;">TailorPro Order Update</h2>
        <p>Hello ${data.clientName},</p>
        <p>Your order <strong>#${data.orderId}</strong> status has been updated to: <strong>${data.status}</strong>.</p>
        <p>View your order details here: <a href="${process.env.NEXT_PUBLIC_APP_URL}/order/${data.orderId}">Order Portal</a></p>
        <br/>
        <p>Thank you for choosing TailorPro!</p>
      </div>
    `
  }

  try {
    const result = await sendEmail({ to, subject, html })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
