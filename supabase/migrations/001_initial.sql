-- PropFirmPassing — Initial Schema
-- Run this in your Supabase SQL editor or via CLI

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  full_name   text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profiles: users can only read/update their own
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- ACCOUNT SUBMISSIONS
-- ─────────────────────────────────────────────
create table if not exists public.account_submissions (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  prop_firm         text not null,
  account_size      text not null,
  challenge_phase   text not null,
  trading_platform  text not null,
  login_id          text not null,
  password          text not null,
  server            text not null,
  investor_password text,
  notes             text,
  status            text not null default 'pending'
                    check (status in ('pending','in_progress','passed','failed','payment_pending','paid')),
  admin_notes       text,
  price_usd         numeric(10,2),
  payment_id        text,
  payment_status    text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.account_submissions enable row level security;

-- Users can only see their own submissions
create policy "Users can view own submissions"
  on public.account_submissions for select
  using (auth.uid() = user_id);

create policy "Users can insert own submissions"
  on public.account_submissions for insert
  with check (auth.uid() = user_id);

-- Admins can do everything
create policy "Admins can view all submissions"
  on public.account_submissions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all submissions"
  on public.account_submissions for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─────────────────────────────────────────────
-- UPDATED_AT trigger
-- ─────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger submissions_updated_at
  before update on public.account_submissions
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- ADMIN SETUP (run after creating your admin user)
-- Replace 'your-admin-email@example.com' with your actual admin email
-- ─────────────────────────────────────────────
-- update public.profiles set role = 'admin' where email = 'admin@propfirmpassing.online';
