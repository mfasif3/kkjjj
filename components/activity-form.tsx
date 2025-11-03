"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Activity } from "@/lib/types"
import { calculateDailyScore } from "@/lib/score-calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface ActivityFormProps {
  userId: string
  existingActivity?: Activity | null
}

export function ActivityForm({ userId, existingActivity }: ActivityFormProps) {
  const [date, setDate] = useState(existingActivity?.activity_date || new Date().toISOString().split("T")[0])
  const [steps, setSteps] = useState(existingActivity?.steps.toString() || "0")
  const [pushups, setPushups] = useState(existingActivity?.pushups.toString() || "0")
  const [workoutMinutes, setWorkoutMinutes] = useState(existingActivity?.workout_minutes.toString() || "0")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Calculate preview score
  const previewActivity: Activity = {
    id: "",
    user_id: userId,
    activity_date: date,
    steps: Number.parseInt(steps) || 0,
    pushups: Number.parseInt(pushups) || 0,
    workout_minutes: Number.parseInt(workoutMinutes) || 0,
    created_at: "",
    updated_at: "",
  }
  const previewScore = calculateDailyScore(previewActivity)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const activityData = {
        user_id: userId,
        activity_date: date,
        steps: Number.parseInt(steps) || 0,
        pushups: Number.parseInt(pushups) || 0,
        workout_minutes: Number.parseInt(workoutMinutes) || 0,
        updated_at: new Date().toISOString(),
      }

      if (existingActivity) {
        // Update existing activity
        const { error: updateError } = await supabase
          .from("activities")
          .update(activityData)
          .eq("id", existingActivity.id)

        if (updateError) throw updateError
      } else {
        // Insert new activity
        const { error: insertError } = await supabase.from("activities").insert(activityData)

        if (insertError) {
          if (insertError.code === "23505") {
            throw new Error("Activity for this date already exists")
          }
          throw insertError
        }
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Log Activity</h1>
          <p className="text-muted-foreground">Track your daily fitness activities</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
          <CardDescription>Enter your fitness data for the selected date</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="steps">Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  min="0"
                  required
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">1000 steps = 10 points (max 40 points at 4000 steps)</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pushups">Pushups</Label>
                <Input
                  id="pushups"
                  type="number"
                  min="0"
                  required
                  value={pushups}
                  onChange={(e) => setPushups(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">10 pushups = 5 points (max 30 points at 60 pushups)</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="workoutMinutes">Workout Minutes</Label>
                <Input
                  id="workoutMinutes"
                  type="number"
                  min="0"
                  required
                  value={workoutMinutes}
                  onChange={(e) => setWorkoutMinutes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">10 minutes = 5 points (max 30 points at 60 minutes)</p>
              </div>

              {/* Score Preview */}
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estimated Score:</span>
                    <span className="text-2xl font-bold">{previewScore} points</span>
                  </div>
                </CardContent>
              </Card>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : existingActivity ? "Update Activity" : "Log Activity"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
