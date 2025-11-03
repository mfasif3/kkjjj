-- Create gen_ids table for storing generated GenID codes
create table if not exists public.gen_ids (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  short_id text unique not null,
  public_code text unique not null,
  created_at timestamp with time zone default now(),
  
  -- Ensure one GenID per user
  constraint one_genid_per_user unique(user_id)
);

-- Enable RLS
alter table public.gen_ids enable row level security;

-- Drop existing policies before creating to avoid duplicate errors
drop policy if exists "Anyone can view gen_ids" on public.gen_ids;
drop policy if exists "Users can insert their own gen_id" on public.gen_ids;
drop policy if exists "Users can update their own gen_id" on public.gen_ids;
drop policy if exists "Users can delete their own gen_id" on public.gen_ids;

-- RLS Policies for gen_ids table
create policy "Anyone can view gen_ids"
  on public.gen_ids for select
  using (true);

create policy "Users can insert their own gen_id"
  on public.gen_ids for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own gen_id"
  on public.gen_ids for update
  using (auth.uid() = user_id);

create policy "Users can delete their own gen_id"
  on public.gen_ids for delete
  using (auth.uid() = user_id);

-- Create indexes for fast lookups
create index if not exists gen_ids_user_id_idx on public.gen_ids(user_id);
create index if not exists gen_ids_short_id_idx on public.gen_ids(short_id);
create index if not exists gen_ids_public_code_idx on public.gen_ids(public_code);

-- Updated to generate 6-digit number (100000-999999) instead of 5-digit
create or replace function generate_short_id()
returns text as $$
declare
  result text;
  num integer;
begin
  -- Generate random 6-digit number between 100000 and 999999
  num := floor(random() * 900000 + 100000)::integer;
  result := num::text;
  return result;
end;
$$ language plpgsql;

-- Function to generate random public_code (12 characters)
create or replace function generate_public_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  result text := '';
  i integer;
begin
  for i in 1..12 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;
