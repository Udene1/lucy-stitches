import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const supabase = createClient()
    const { prompt } = await request.json()

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    try {
        const response = await fetch(
            "https://router.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ inputs: `fashion photography, highly detailed, nigerian traditional style, ${prompt}` }),
            }
        )

        if (!response.ok) {
            const hfError = await response.json()
            console.error('Hugging Face Response Error:', hfError)

            if (response.status === 503) {
                return NextResponse.json({
                    error: 'Model is loading... please try again in 30 seconds.'
                }, { status: 503 })
            }

            throw new Error(hfError.error || 'Hugging Face API error')
        }

        const blob = await response.blob()
        const buffer = Buffer.from(await blob.arrayBuffer())

        // Upload to Supabase Storage
        const fileName = `generated-${Date.now()}.png`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('designs')
            .upload(fileName, buffer, { contentType: 'image/png' })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('designs')
            .getPublicUrl(fileName)

        // Save to DB
        const { data: designData, error: dbError } = await supabase
            .from('designs')
            .insert([{ prompt, image_url: publicUrl }])
            .select()

        if (dbError) throw dbError

        return NextResponse.json({ success: true, design: designData[0] })
    } catch (error) {
        console.error('AI error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
