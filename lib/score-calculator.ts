import type { Activity } from "./types"

export function calculateDailyScore(activity: Activity): number {
  // Steps: 1000 steps = 10 points, max 40 points (4000 steps)
  const stepsScore = Math.min(Math.floor(activity.steps / 1000) * 10, 40)

  // Pushups: 10 pushups = 5 points, max 30 points (60 pushups)
  const pushupsScore = Math.min(Math.floor(activity.pushups / 10) * 5, 30)

  // Workout minutes: 10 minutes = 5 points, max 30 points (60 minutes)
  const workoutScore = Math.min(Math.floor(activity.workout_minutes / 10) * 5, 30)

  return stepsScore + pushupsScore + workoutScore
}

export function calculateStreak(activities: Activity[]): number {
  if (activities.length === 0) return 0

  // Sort activities by date descending
  const sorted = [...activities].sort(
    (a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime(),
  )

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < sorted.length; i++) {
    const activityDate = new Date(sorted[i].activity_date)
    activityDate.setHours(0, 0, 0, 0)

    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    expectedDate.setHours(0, 0, 0, 0)

    if (activityDate.getTime() === expectedDate.getTime()) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function calculateStreakBonus(streakDays: number): number {
  return Math.min(streakDays, 10)
}

export function calculateTotalCredit(activities: Activity[]): number {
  let totalCredit = 0

  activities.forEach((activity) => {
    const dailyScore = calculateDailyScore(activity)
    totalCredit += dailyScore
  })

  // Add streak bonus
  const streak = calculateStreak(activities)
  const streakBonus = calculateStreakBonus(streak)
  totalCredit += streakBonus

  return totalCredit
}
