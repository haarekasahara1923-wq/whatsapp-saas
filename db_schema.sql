-- Database Schema for WhatsApp Store SaaS
-- Run this in your Supabase SQL Editor to set up the database.

-- 1. Create Users Table
create table if not exists users (
  id text primary key, -- maintaining compatibility with string IDs from app
  name text,
  email text unique not null,
  whatsapp_number text,
  store_name text,
  store_slug text unique,
  address text,
  role text default 'USER',
  password text, -- Security Note: Integrate Supabase Auth for production
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Stores Table
create table if not exists stores (
  id text primary key,
  user_id text references users(id),
  template_id text,
  status text default 'ACTIVE',
  subscription_type text,
  expiry_date timestamp with time zone,
  setup_paid boolean default false,
  settings jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create Products Table
create table if not exists products (
  id text primary key,
  store_id text references stores(id),
  name text not null,
  description text,
  price numeric,
  discount_price numeric,
  images text[],
  video_url text,
  category text,
  stock integer default 0,
  variants jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
alter table users enable row level security;
alter table stores enable row level security;
alter table products enable row level security;

-- 5. Access Policies (Open for Demo, tighten for Production)
-- Allow public read access to stores and products
create policy "Public stores are viewable by everyone" on stores for select using (true);
create policy "Public products are viewable by everyone" on products for select using (true);

-- Allow users to read their own data (Adjust based on how you handle auth)
create policy "Users can read own data" on users for select using (true); 
create policy "Users can insert own data" on users for insert with check (true);
create policy "Users can update own data" on users for update using (true);

create policy "Users can insert stores" on stores for insert with check (true);
create policy "Users can update stores" on stores for update using (true);

create policy "Users can insert products" on products for insert with check (true);
create policy "Users can update products" on products for update using (true);
create policy "Users can delete products" on products for delete using (true);
