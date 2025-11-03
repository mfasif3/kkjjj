"use client"

import type { User, Activity, GenID } from "@/lib/types"
import {
  calculateDailyScore,
  calculateStreak,
  calculateStreakBonus,
  calculateTotalCredit,
} from "@/lib/score-calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Shield, AlertTriangle, RefreshCw } from "lucide-react"

interface DashboardContentProps {
  profile: User
  activities: Activity[]
  genId: GenID | null
  isAdmin?: boolean
}

export function DashboardContent({ profile, activities, genId, isAdmin = false }: DashboardContentProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsDatabaseUpdate, setNeedsDatabaseUpdate] = useState(false)

  const streak = calculateStreak(activities)
  const totalCredit = calculateTotalCredit(activities)

  const today = new Date().toISOString().split("T")[0]
  const todayActivity = activities.find((a) => a.activity_date === today)
  const todayScore = todayActivity ? calculateDailyScore(todayActivity) : 0

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const generateNumericId = (): string => {
    const num = Math.floor(Math.random() * 900000 + 100000)
    return num.toString()
  }

  const checkIdExists = async (shortId: string): Promise<boolean> => {
    const { data, error } = await supabase.from("gen_ids").select("short_id").eq("short_id", shortId).single()

    return !error && data !== null
  }

  const generateUniqueNumericId = async (): Promise<string> => {
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const id = generateNumericId()
      const exists = await checkIdExists(id)

      if (!exists) {
        return id
      }

      attempts++
    }

    throw new Error("Could not generate unique ID after multiple attempts")
  }

  const handleGenerateGenID = async () => {
    setIsGenerating(true)
    setError(null)
    setNeedsDatabaseUpdate(false)

    console.log("[v0] Starting GenID generation for user:", profile.id)

    try {
      let shortId: string
      let publicCode: string

      try {
        const { data: shortIdData, error: shortIdError } = await supabase.rpc("generate_short_id")
        console.log("[v0] Database generated short_id:", shortIdData, "Error:", shortIdError)

        if (shortIdError || !shortIdData || !/^\d{6}$/.test(shortIdData)) {
          console.warn("[v0] Database function returned invalid format, using client-side fallback")
          setNeedsDatabaseUpdate(true)
          shortId = await generateUniqueNumericId()
          console.log("[v0] Client-side generated short_id:", shortId)
        } else {
          shortId = shortIdData
        }
      } catch (dbError) {
        console.warn("[v0] Database function failed, using client-side fallback:", dbError)
        setNeedsDatabaseUpdate(true)
        shortId = await generateUniqueNumericId()
        console.log("[v0] Client-side generated short_id:", shortId)
      }

      try {
        const { data: publicCodeData, error: publicCodeError } = await supabase.rpc("generate_public_code")
        console.log("[v0] Generated public_code:", publicCodeData, "Error:", publicCodeError)

        if (publicCodeError || !publicCodeData) {
          publicCode = Math.random().toString(36).substring(2, 14).toUpperCase()
        } else {
          publicCode = publicCodeData
        }
      } catch (err) {
        publicCode = Math.random().toString(36).substring(2, 14).toUpperCase()
      }

      const { error: insertError } = await supabase.from("gen_ids").insert({
        user_id: profile.id,
        short_id: shortId,
        public_code: publicCode,
      })

      console.log("[v0] Insert result - Error:", insertError)
      if (insertError) throw insertError

      console.log("[v0] GenID created successfully, refreshing page...")
      router.refresh()
    } catch (err) {
      console.error("[v0] GenID generation error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate GenID")
    } finally {
      setIsGenerating(false)
    }
  }

  const formatGenId = (id: string) => {
    if (!/^\d{6}$/.test(id)) {
      console.warn("[v0] Invalid GenID format detected:", id)
      return "INVALID"
    }
    return id.padStart(6, "0")
  }

  const needsRegeneration = genId && !/^\d{6}$/.test(genId.short_id)

  return (
    <div className="min-h-svh p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{profile.display_name}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button asChild variant="outline">
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {needsDatabaseUpdate && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Database Update Required</AlertTitle>
            <AlertDescription>
              Your GenID was created successfully using a fallback method, but your database functions need to be
              updated.
              {isAdmin ? (
                <span className="mt-2 block">
                  Please run <code className="rounded bg-muted px-1 py-0.5">scripts/005_fix_genid_format.sql</code> to
                  update the database functions.
                </span>
              ) : (
                <span className="mt-2 block">Please contact your administrator to update the database functions.</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {!genId && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Generate Your GenID</CardTitle>
              <CardDescription>
                Create your unique GenID code to unlock your digital health passport features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGenerateGenID} disabled={isGenerating} size="lg">
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate GenID"
                )}
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Generation Failed</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>{error}</p>
                    {error.includes("Invalid GenID format") && (
                      <div className="mt-3 space-y-2 rounded-lg bg-destructive/10 p-3">
                        <p className="font-medium">How to fix this:</p>
                        <ol className="ml-4 list-decimal space-y-1 text-sm">
                          <li>Your database functions are generating IDs in the old format</li>
                          <li>
                            Run the migration script:{" "}
                            <code className="rounded bg-muted px-1 py-0.5">scripts/005_fix_genid_format.sql</code>
                          </li>
                          <li>This will update the functions to generate 6-digit numeric IDs</li>
                          <li>After running the script, try generating your GenID again</li>
                        </ol>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 bg-transparent"
                            onClick={() => router.push("/admin")}
                          >
                            Go to Admin Panel
                          </Button>
                        )}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateGenID}
                      disabled={isGenerating}
                      className="mt-2 bg-transparent"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {genId && (
          <Card className={needsRegeneration ? "border-yellow-500" : ""}>
            <CardHeader>
              <CardTitle>Your GenID</CardTitle>
              <CardDescription>
                {needsRegeneration
                  ? "Your GenID needs to be updated to the new format"
                  : "Your unique digital health passport identifier"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">GenID</p>
                <p className="font-mono text-3xl font-bold">
                  {needsRegeneration ? (
                    <span className="text-yellow-600">#{genId.short_id} (Old Format)</span>
                  ) : (
                    `#${formatGenId(genId.short_id)}`
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verification Code</p>
                <p className="font-mono text-sm">{genId.public_code}</p>
              </div>
              {needsRegeneration && (
                <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
                  <p className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Format Update Required
                  </p>
                  <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-300">
                    Your GenID is in the old alphanumeric format. Please run migration script 005 to update to the new
                    6-digit numeric format (#000000).
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Contact your administrator to run: scripts/005_fix_genid_format.sql
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Today&apos;s Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayScore}</div>
              <p className="text-xs text-muted-foreground">points earned today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{streak}</div>
              <p className="text-xs text-muted-foreground">consecutive days (+{calculateStreakBonus(streak)} bonus)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCredit}</div>
              <p className="text-xs text-muted-foreground">lifetime points</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/activity">Log Activity</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/g/${profile.username}`}>View Public Profile</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest fitness logs</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activities logged yet. Start tracking your fitness!</p>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{new Date(activity.activity_date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.steps} steps • {activity.pushups} pushups • {activity.workout_minutes} min workout
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{calculateDailyScore(activity)}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
