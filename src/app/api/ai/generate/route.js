```javascript
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const supabase = await createClient()
    const { prompt } = await request.json()

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    try {
        // Get current user for attribution
        const { data: { user } } = await supabase.auth.getUser()

        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: {
                    Authorization: `Bearer ${ process.env.HUGGINGFACE_API_TOKEN } `,
                    "Content-Type": "application/json",
                    "x-wait-for-model": "true"
                },
                method: "POST",
                body: JSON.stringify({ inputs: `fashion photography, masterpiece, highly detailed, nigerian traditional style, ${ prompt } ` }),
            }
        )

        if (!response.ok) {
            const responseText = await response.text()
            console.error('Hugging Face Response Error:', response.status, responseText)

            let errorMessage = 'Hugging Face API error'
            try {
                const parsed = JSON.parse(responseText)
                errorMessage = parsed.error || errorMessage
            } catch (e) {
                errorMessage = responseText || `Error ${ response.status }: ${ response.statusText } `
            }

            if (response.status === 503) {
                return NextResponse.json({
                    error: 'Model is loading... please try again in 30 seconds.'
                }, { status: 503 })
            }

            throw new Error(errorMessage)
        }

        const blob = await response.blob()
        const buffer = Buffer.from(await blob.arrayBuffer())

        // Upload to Supabase Storage using Admin client to bypass RLS
        const fileName = `generated - ${ Date.now() }.png`
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('designs')
            .upload(fileName, buffer, { contentType: 'image/png' })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('designs')
            .getPublicUrl(fileName)

        // Save to DB using Admin client
        const { data: designData, error: dbError } = await supabaseAdmin
            .from('designs')
            .insert([{
                prompt,
                image_url: publicUrl,
                user_id: user?.id
            }])
            .select()

        if (dbError) throw dbError

        return NextResponse.json({ success: true, design: designData[0] })
    } catch (error) {
        console.error('AI error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
```
