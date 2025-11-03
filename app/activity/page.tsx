import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ActivityForm } from "@/components/activity-form"

export default async function ActivityPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user has a profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/setup")
  }

  // Get today's activity if it exists
  const today = new Date().toISOString().split("T")[0]
  const { data: todayActivity } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .eq("activity_date", today)
    .single()

  return (
    <div className="min-h-svh p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <ActivityForm userId={user.id} existingActivity={todayActivity} />
      </div>
    </div>
  )
}
