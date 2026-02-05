-- Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    material_photo_url TEXT,
    sample_design_url TEXT,
    ai_prompt TEXT,
    ai_generated_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewed, converted, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public to insert bookings
CREATE POLICY "Allow public insert bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

-- Allow authenticated (Admin) full access
CREATE POLICY "Allow authenticated full access to bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create Storage Buckets for bookings if they don't exist
-- Note: This usually needs to be done via the Supabase UI or API
-- But we can assume the 'designs' bucket exists from the AI feature
-- We might need a 'materials' bucket
