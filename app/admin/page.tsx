import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
  const isAdmin = adminEmails.includes(user.email || "")

  if (!isAdmin) {
    redirect("/dashboard")
  }

  console.log("[v0] Admin page - Fetching data for admin:", user.email)

  // Fetch all data for admin view with error handling
  const [usersResult, genIdsResult, activitiesResult] = await Promise.all([
    supabase.from("users").select("*").order("created_at", { ascending: false }),
    supabase
      .from("gen_ids")
      .select(
        `
      *,
      users (username, display_name, email)
    `,
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("activities")
      .select(
        `
      *,
      users (username, display_name)
    `,
      )
      .order("activity_date", { ascending: false })
      .limit(100),
  ])

  console.log("[v0] Users query result:", {
    count: usersResult.data?.length,
    error: usersResult.error,
  })
  console.log("[v0] GenIDs query result:", {
    count: genIdsResult.data?.length,
    error: genIdsResult.error,
    data: genIdsResult.data,
  })
  console.log("[v0] Activities query result:", {
    count: activitiesResult.data?.length,
    error: activitiesResult.error,
  })

  // Check for database setup issues
  const hasGenIdsTable = !genIdsResult.error || genIdsResult.error.code !== "42P01" // 42P01 = undefined_table
  const hasUsernameColumn = !usersResult.error || usersResult.error.code !== "42703" // 42703 = undefined_column

  // If gen_ids table doesn't exist, show setup instructions
  if (!hasGenIdsTable) {
    return (
      <div className="min-h-svh bg-muted/30 p-6 md:p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel - Setup Required</h1>
            <p className="text-muted-foreground">Database schema needs to be updated</p>
          </div>

          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Database Setup Incomplete</CardTitle>
              </div>
              <CardDescription>The gen_ids table is missing from your database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Required Actions:</h3>
                <ol className="list-decimal space-y-2 pl-5 text-sm">
                  <li>
                    <strong>Run Migration Script (003):</strong> Execute{" "}
                    <code className="rounded bg-muted px-1 py-0.5">scripts/003_migrate_handle_to_username.sql</code> to
                    rename the handle column to username
                  </li>
                  <li>
                    <strong>Create GenIDs Table (004):</strong> Execute{" "}
                    <code className="rounded bg-muted px-1 py-0.5">scripts/004_create_gen_ids_table.sql</code> to create
                    the gen_ids table with 6-digit GenID format
                  </li>
                  <li>
                    <strong>Refresh Page:</strong> After running both scripts, refresh this page to access the admin
                    panel
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">How to Run Scripts:</h3>
                <p className="text-sm text-muted-foreground">
                  The scripts are located in the <code className="rounded bg-muted px-1 py-0.5">scripts/</code> folder.
                  v0 can execute them for you automatically, or you can run them manually in the Supabase SQL Editor.
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  <strong>Note:</strong> Your existing users and activities data will be preserved. The migration only
                  adds the new gen_ids table and renames the handle column to username.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <AdminDashboard
      users={usersResult.data || []}
      genIds={genIdsResult.data || []}
      activities={activitiesResult.data || []}
      adminEmail={user.email || ""}
    />
  )
}
