import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const formData = await request.formData()

        const customer_name = formData.get('customer_name')
        const whatsapp_number = formData.get('whatsapp_number')
        const ai_prompt = formData.get('ai_prompt')
        const ai_generated_url = formData.get('ai_generated_url')

        // Handle file uploads
        const material_file = formData.get('material_photo')
        const sample_file = formData.get('sample_design')

        let material_photo_url = null
        let sample_design_url = null

        if (material_file && material_file.size > 0) {
            const buffer = Buffer.from(await material_file.arrayBuffer())
            const fileName = `material-${Date.now()}-${material_file.name}`
            const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
                .from('designs') // Using existing 'designs' bucket for simplicity, or create a new one
                .upload(fileName, buffer, { contentType: material_file.type })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabaseAdmin.storage
                .from('designs')
                .getPublicUrl(fileName)

            material_photo_url = publicUrl
        }

        if (sample_file && sample_file.size > 0) {
            const buffer = Buffer.from(await sample_file.arrayBuffer())
            const fileName = `sample-${Date.now()}-${sample_file.name}`
            const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
                .from('designs')
                .upload(fileName, buffer, { contentType: sample_file.type })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabaseAdmin.storage
                .from('designs')
                .getPublicUrl(fileName)

            sample_design_url = publicUrl
        }

        // Insert into database
        const { data: bookingData, error: dbError } = await supabaseAdmin
            .from('bookings')
            .insert([{
                customer_name,
                whatsapp_number,
                material_photo_url,
                sample_design_url,
                ai_prompt,
                ai_generated_url,
                status: 'pending'
            }])
            .select()

        if (dbError) throw dbError

        return NextResponse.json({ success: true, booking: bookingData[0] })
    } catch (error) {
        console.error('Booking error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
