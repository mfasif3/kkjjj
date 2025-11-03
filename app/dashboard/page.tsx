import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  // Check if user has a profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // If no profile, redirect to setup
  if (!profile) {
    redirect("/setup")
  }

  const { data: genId } = await supabase.from("gen_ids").select("*").eq("user_id", user.id).single()

  // Fetch user's activities
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false })

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
  const isAdmin = adminEmails.includes(user.email || "")

  return <DashboardContent profile={profile} activities={activities || []} genId={genId || null} isAdmin={isAdmin} />
}
