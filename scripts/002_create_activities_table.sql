-- Create activities table for tracking daily fitness activities
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  activity_date date not null,
  steps integer default 0,
  pushups integer default 0,
  workout_minutes integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.activities enable row level security;

-- RLS Policies for activities table
create policy "Users can view their own activities"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "Users can insert their own activities"
  on public.activities for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own activities"
  on public.activities for update
  using (auth.uid() = user_id);

create policy "Users can delete their own activities"
  on public.activities for delete
  using (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate entries for same user and date
create unique index if not exists activities_user_date_idx 
  on public.activities(user_id, activity_date);

-- Create index for faster queries
create index if not exists activities_user_id_idx on public.activities(user_id);
create index if not exists activities_date_idx on public.activities(activity_date);
