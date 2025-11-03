-- Query all GenIDs
SELECT 
  g.id,
  g.user_id,
  g.short_id,
  g.public_code,
  g.created_at,
  u.username,
  u.display_name
FROM gen_ids g
LEFT JOIN users u ON g.user_id = u.id
ORDER BY g.created_at DESC;
