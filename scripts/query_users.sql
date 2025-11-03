-- Join with auth.users to get email instead of selecting from users table
SELECT 
  u.id,
  u.username,
  u.display_name,
  COALESCE(u.email, au.email) as email,
  u.created_at
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;
