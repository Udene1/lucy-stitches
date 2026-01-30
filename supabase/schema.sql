-- TailorPro Database Schema

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    measurements JSONB DEFAULT '{}'::jsonb,
    photo_urls TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, in-progress, ready, delivered
    deadline DATE,
    price NUMERIC(10, 2) DEFAULT 0.00,
    payment_status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid, partial, paid
    payment_reference TEXT,
    progress_photos TEXT[] DEFAULT '{}'::text[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'yards', -- yards, pieces, rolls
    supplier TEXT,
    low_stock_threshold INTEGER DEFAULT 5,
    price_per_unit NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Designs Table (AI Suggestions)
CREATE TABLE IF NOT EXISTS public.designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Clients: Authenticated (Admin) full access
CREATE POLICY "Allow authenticated full access to clients" ON public.clients
    FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Authenticated (Admin) full access
CREATE POLICY "Allow authenticated full access to orders" ON public.orders
    FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Public read access for client portal (restricted by ID in app)
CREATE POLICY "Allow public read access to orders" ON public.orders
    FOR SELECT USING (true);

-- Inventory: Authenticated (Admin) full access
CREATE POLICY "Allow authenticated full access to inventory" ON public.inventory
    FOR ALL USING (auth.role() = 'authenticated');

-- Designs: Authenticated (Admin) full access
CREATE POLICY "Allow authenticated full access to designs" ON public.designs
    FOR ALL USING (auth.role() = 'authenticated');

-- Functions for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
