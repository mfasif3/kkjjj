-- ============================================================================
-- Migration Script: Fix GenID Format to 6-Digit Numeric Only
-- ============================================================================
-- This script ensures all GenIDs are 6-digit numbers (100000-999999)
-- Run this script to fix the database functions and update existing GenIDs
-- ============================================================================

-- Step 1: Drop old functions that may generate alphanumeric codes
drop function if exists generate_short_id() cascade;
drop function if exists generate_public_code() cascade;

-- Step 2: Create new function to generate ONLY 6-digit numeric IDs
create or replace function generate_short_id()
returns text as $$
declare
  result text;
  num integer;
  attempts integer := 0;
  max_attempts integer := 100;
begin
  loop
    -- Generate random 6-digit number: 100000 to 999999
    num := floor(random() * 900000 + 100000)::integer;
    result := num::text;
    
    -- Verify it's exactly 6 digits (safety check)
    if length(result) != 6 then
      raise exception 'Generated ID % is not 6 digits', result;
    end if;
    
    -- Check uniqueness
    if not exists (select 1 from public.gen_ids where short_id = result) then
      return result;
    end if;
    
    attempts := attempts + 1;
    if attempts >= max_attempts then
      raise exception 'Could not generate unique 6-digit ID after % attempts', max_attempts;
    end if;
  end loop;
end;
$$ language plpgsql;

-- Step 3: Create function for public_code (verification code, can be alphanumeric)
create or replace function generate_public_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  result text := '';
  i integer;
  attempts integer := 0;
  max_attempts integer := 100;
begin
  loop
    result := '';
    -- Generate 12-character code
    for i in 1..12 loop
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    end loop;
    
    -- Check uniqueness
    if not exists (select 1 from public.gen_ids where public_code = result) then
      return result;
    end if;
    
    attempts := attempts + 1;
    if attempts >= max_attempts then
      raise exception 'Could not generate unique public_code after % attempts', max_attempts;
    end if;
  end loop;
end;
$$ language plpgsql;

-- Step 4: Update existing GenIDs that don't match the 6-digit format
do $$
declare
  gen_id_record record;
  new_short_id text;
  updated_count integer := 0;
begin
  raise notice 'Starting GenID format migration...';
  
  -- Find all GenIDs that aren't exactly 6 numeric digits
  for gen_id_record in 
    select id, short_id, user_id
    from public.gen_ids 
    where short_id !~ '^[0-9]{6}$'
  loop
    -- Generate new 6-digit numeric ID
    new_short_id := generate_short_id();
    
    -- Update the record
    update public.gen_ids 
    set short_id = new_short_id 
    where id = gen_id_record.id;
    
    updated_count := updated_count + 1;
    raise notice 'Updated GenID for user %: % → %', 
      gen_id_record.user_id, gen_id_record.short_id, new_short_id;
  end loop;
  
  if updated_count = 0 then
    raise notice 'No GenIDs needed updating. All are in correct format.';
  else
    raise notice 'Successfully updated % GenID(s) to 6-digit numeric format.', updated_count;
  end if;
end $$;

-- Step 5: Add database constraint to enforce 6-digit format
alter table public.gen_ids 
drop constraint if exists short_id_format_check;

alter table public.gen_ids 
add constraint short_id_format_check 
check (short_id ~ '^[0-9]{6}$');

-- Step 6: Add helpful comments
comment on column public.gen_ids.short_id is 
  'Six-digit numeric identifier (100000-999999). Displayed as #XXXXXX to users.';
comment on column public.gen_ids.public_code is 
  'Twelve-character alphanumeric verification code for additional security.';

-- Step 7: Verify the migration
do $$
declare
  total_genids integer;
  valid_genids integer;
begin
  select count(*) into total_genids from public.gen_ids;
  select count(*) into valid_genids from public.gen_ids where short_id ~ '^[0-9]{6}$';
  
  raise notice '============================================';
  raise notice 'Migration Complete!';
  raise notice 'Total GenIDs: %', total_genids;
  raise notice 'Valid 6-digit GenIDs: %', valid_genids;
  raise notice 'All GenIDs are now in correct format: %', (total_genids = valid_genids);
  raise notice '============================================';
end $$;
