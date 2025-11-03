-- Check current database schema status
-- Run this to see what tables exist and their structure

-- Check if users table exists and its columns
select 
  'users table' as check_name,
  case 
    when exists (select from pg_tables where schemaname = 'public' and tablename = 'users') 
    then 'EXISTS' 
    else 'MISSING' 
  end as status;

-- Check users table columns
select 
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public' 
  and table_name = 'users'
order by ordinal_position;

-- Check if gen_ids table exists
select 
  'gen_ids table' as check_name,
  case 
    when exists (select from pg_tables where schemaname = 'public' and tablename = 'gen_ids') 
    then 'EXISTS' 
    else 'MISSING' 
  end as status;

-- Check if activities table exists
select 
  'activities table' as check_name,
  case 
    when exists (select from pg_tables where schemaname = 'public' and tablename = 'activities') 
    then 'EXISTS' 
    else 'MISSING' 
  end as status;

-- Count records in each table
select 'users' as table_name, count(*) as record_count from public.users
union all
select 'activities' as table_name, count(*) as record_count from public.activities
union all
select 'gen_ids' as table_name, count(*) as record_count from public.gen_ids;
