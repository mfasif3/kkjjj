-- Create users table with GenID handle and display name
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  display_name text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- RLS Policies for users table
create policy "Users can view all profiles"
  on public.users for select
  using (true);

create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can delete their own profile"
  on public.users for delete
  using (auth.uid() = id);

-- Create index on handle for fast lookups
create index if not exists users_handle_idx on public.users(handle);
