-- Rename handle column to username in users table
alter table public.users rename column handle to username;

-- Update index name
drop index if exists users_handle_idx;
create index if not exists users_username_idx on public.users(username);

-- Update comments
comment on column public.users.username is 'Unique username for user profile URL slug';
