import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SetupForm } from "@/components/setup-form"

export default async function SetupPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user already has a profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // If profile exists, redirect to dashboard
  if (profile) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <SetupForm userId={user.id} />
    </div>
  )
}
