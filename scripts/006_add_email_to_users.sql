-- Migration: Add email column to users table and populate from auth.users
-- This script is idempotent and can be run multiple times safely

-- Add email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.users ADD COLUMN email text;
    RAISE NOTICE 'Added email column to users table';
  ELSE
    RAISE NOTICE 'Email column already exists in users table';
  END IF;
END $$;

-- Populate email from auth.users for existing users
UPDATE public.users u
SET email = au.email
FROM auth.users au
WHERE u.id = au.id
AND u.email IS NULL;

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

-- Log completion
DO $$ 
BEGIN
  RAISE NOTICE 'Email migration completed. Updated % users', 
    (SELECT COUNT(*) FROM public.users WHERE email IS NOT NULL);
END $$;
