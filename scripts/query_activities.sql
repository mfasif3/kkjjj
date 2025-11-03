-- Query all activities with calculated scores
SELECT 
  a.id,
  a.user_id,
  u.username,
  a.activity_date,
  a.steps,
  a.pushups,
  a.workout_minutes,
  a.created_at
FROM activities a
LEFT JOIN users u ON a.user_id = u.id
ORDER BY a.activity_date DESC, a.created_at DESC
LIMIT 50;
