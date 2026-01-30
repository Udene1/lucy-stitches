-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS (Managed by Supabase Auth, but we can extend if needed)
-- We'll assume public.users table exists or we rely on auth.users from Supabase

-- CLIENTS TABLE
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text,
  email text,
  measurements jsonb default '{}'::jsonb,
  photo_url text, -- For client profile photo
  user_id uuid references auth.users(id) -- link to admin who created it
);

-- Enable RLS for Clients
alter table public.clients enable row level security;

create policy "Admins can view all clients"
  on public.clients for select
  to authenticated
  using (true);

create policy "Admins can insert clients"
  on public.clients for insert
  to authenticated
  with check (true);

create policy "Admins can update their clients"
  on public.clients for update
  to authenticated
  using (true);

create policy "Admins can delete clients"
  on public.clients for delete
  to authenticated
  using (true);


-- ORDERS TABLE
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references public.clients(id) not null,
  description text not null,
  status text check (status in ('pending', 'in-progress', 'ready', 'delivered')) default 'pending',
  price numeric default 0,
  deadline timestamp with time zone,
  payment_status text check (payment_status in ('unpaid', 'partially-paid', 'paid')) default 'unpaid',
  notes text,
  progress_photos text[], -- Array of URLs
  user_id uuid references auth.users(id)
);

-- Enable RLS for Orders
alter table public.orders enable row level security;

create policy "Admins can view all orders"
  on public.orders for select
  to authenticated
  using (true);

create policy "Admins can insert orders"
  on public.orders for insert
  to authenticated
  with check (true);

create policy "Admins can update orders"
  on public.orders for update
  to authenticated
  using (true);

-- INVENTORY TABLE
create table public.inventory (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  item_name text not null,
  quantity numeric default 0,
  unit text default 'yards',
  supplier text,
  low_stock_threshold numeric default 5,
  price_per_unit numeric default 0,
  user_id uuid references auth.users(id)
);

-- Enable RLS for Inventory
alter table public.inventory enable row level security;

create policy "Admins can view inventory"
  on public.inventory for select
  to authenticated
  using (true);

create policy "Admins can manage inventory"
  on public.inventory for all
  to authenticated
  using (true);

-- DESIGNS TABLE (For AI Suggester)
create table public.designs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  prompt text,
  image_url text,
  user_id uuid references auth.users(id)
);

alter table public.designs enable row level security;

create policy "Admins can view designs"
  on public.designs for select
  to authenticated
  using (true);

create policy "Admins can insert designs"
  on public.designs for insert
  to authenticated
  with check (true);

-- STORAGE BUCKETS (Must be created via UI or specific extensions, but logically defined here)
-- Bucket: 'designs' (public)
-- Bucket: 'progress-photos' (public)
