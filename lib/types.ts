export interface User {
  id: string
  username: string
  display_name: string
  created_at: string
}

export interface Activity {
  id: string
  user_id: string
  activity_date: string
  steps: number
  pushups: number
  workout_minutes: number
  created_at: string
  updated_at: string
}

export interface DailyScore {
  date: string
  steps: number
  pushups: number
  workout_minutes: number
  score: number
}

export interface UserStats {
  total_credit: number
  current_streak: number
  today_score: number
}

export interface GenID {
  id: string
  user_id: string
  short_id: string
  public_code: string
  created_at: string
}
