-- Query user statistics
SELECT 
  u.username,
  u.display_name,
  g.short_id as genid,
  COUNT(DISTINCT a.activity_date) as total_activity_days,
  SUM(a.steps) as total_steps,
  SUM(a.pushups) as total_pushups,
  SUM(a.workout_minutes) as total_workout_minutes
FROM users u
LEFT JOIN gen_ids g ON u.id = g.user_id
LEFT JOIN activities a ON u.id = a.user_id
GROUP BY u.id, u.username, u.display_name, g.short_id
ORDER BY total_activity_days DESC;
