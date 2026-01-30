import { Resend } from 'resend'

export async function sendEmail({ to, subject, html }) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('Skipping email send: RESEND_API_KEY is not set')
        return { success: false, error: 'Resend API key missing' }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    try {
        const data = await resend.emails.send({
            from: 'TailorPro <notifications@resend.dev>', // Use verified domain in prod
            to: [to],
            subject,
            html,
        })
        return { success: true, data }
    } catch (error) {
        console.error('Email error:', error)
        return { success: false, error }
    }
}
