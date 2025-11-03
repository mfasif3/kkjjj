import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { GenIDCard } from "@/components/genid-card"
import { calculateStreak, calculateTotalCredit } from "@/lib/score-calculator"

interface PageProps {
  params: Promise<{ username: string }> // Fixed from handle to username
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params // Fixed from handle to username
  const supabase = await createClient()

  const { data: profile } = await supabase.from("users").select("*").eq("username", username.toLowerCase()).single()

  if (!profile) {
    notFound()
  }

  // Fetch user's activities
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", profile.id)
    .order("activity_date", { ascending: false })

  const { data: genIdData } = await supabase.from("gen_ids").select("short_id").eq("user_id", profile.id).single()

  // Calculate stats
  const streak = calculateStreak(activities || [])
  const totalCredit = calculateTotalCredit(activities || [])

  // Determine badges based on achievements
  const badges = []
  if (totalCredit >= 100) badges.push("Centurion")
  if (streak >= 7) badges.push("Week Warrior")
  if (streak >= 30) badges.push("Month Master")

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <GenIDCard
        displayName={profile.display_name}
        username={profile.username} // Fixed from handle to username
        credit={totalCredit}
        streak={streak}
        badges={badges}
        genId={genIdData?.short_id} // Pass GenID to card
      />
    </div>
  )
}
