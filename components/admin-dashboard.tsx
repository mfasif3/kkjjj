"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { calculateDailyScore, calculateStreak, calculateTotalCredit } from "@/lib/score-calculator"
import type { User, Activity, GenID } from "@/lib/types"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, AlertCircle, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react"
import { deleteUserCompletely, verifyUserDeletion } from "@/app/admin/actions"

interface AdminDashboardProps {
  users: User[]
  genIds: (GenID & { users: { username: string; display_name: string; email: string } | null })[]
  activities: (Activity & { users: { username: string; display_name: string } | null })[]
  adminEmail: string
}

export function AdminDashboard({ users, genIds, activities, adminEmail }: AdminDashboardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState("overview")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [editActivity, setEditActivity] = useState<Activity | null>(null)
  const [deleteActivity, setDeleteActivity] = useState<Activity | null>(null)
  const [deleteGenId, setDeleteGenId] = useState<GenID | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [editUserForm, setEditUserForm] = useState({
    username: "",
    display_name: "",
    email: "",
  })

  const [editActivityForm, setEditActivityForm] = useState({
    steps: 0,
    pushups: 0,
    workout_minutes: 0,
    activity_date: "",
  })

  const [deletionStep, setDeletionStep] = useState<"confirm" | "deleting" | "verifying" | "complete">("confirm")
  const [deletionResult, setDeletionResult] = useState<any>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const isValidGenIdFormat = (id: string): boolean => {
    return /^\d{6}$/.test(id)
  }

  const invalidFormatGenIds = genIds.filter((g) => !isValidGenIdFormat(g.short_id))
  const validFormatGenIds = genIds.filter((g) => isValidGenIdFormat(g.short_id))

  const handleRefresh = async () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const formatGenId = (id: string) => {
    if (!isValidGenIdFormat(id)) {
      return id
    }
    return id.padStart(6, "0")
  }

  console.log("[v0] Admin Dashboard - Users:", users.length, "GenIDs:", genIds.length, "Activities:", activities.length)
  console.log("[v0] GenID Format Status - Valid:", validFormatGenIds.length, "Invalid:", invalidFormatGenIds.length)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const openEditUser = (user: User) => {
    setEditUser(user)
    setEditUserForm({
      username: user.username,
      display_name: user.display_name,
      email: user.email,
    })
  }

  const handleUpdateUser = async () => {
    if (!editUser) return
    setIsLoading(true)

    const { error } = await supabase
      .from("users")
      .update({
        username: editUserForm.username,
        display_name: editUserForm.display_name,
        email: editUserForm.email,
      })
      .eq("id", editUser.id)

    setIsLoading(false)

    if (error) {
      alert(`Error updating user: ${error.message}`)
    } else {
      setEditUser(null)
      router.refresh()
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteUser) return
    setDeletionStep("deleting")

    try {
      // Perform deletion
      const result = await deleteUserCompletely(deleteUser.id, deleteUser.email)
      setDeletionResult(result)

      // Verify deletion
      setDeletionStep("verifying")
      const verification = await verifyUserDeletion(deleteUser.id, deleteUser.email)
      setVerificationResult(verification)

      setDeletionStep("complete")

      // Auto-close and refresh if successful
      if (result.success && verification.isClean) {
        setTimeout(() => {
          setDeleteUser(null)
          setDeletionStep("confirm")
          setDeletionResult(null)
          setVerificationResult(null)
          router.refresh()
        }, 3000)
      }
    } catch (error) {
      setDeletionResult({
        success: false,
        message: "Unexpected error",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      })
      setDeletionStep("complete")
    }
  }

  const openEditActivity = (activity: Activity) => {
    setEditActivity(activity)
    setEditActivityForm({
      steps: activity.steps,
      pushups: activity.pushups,
      workout_minutes: activity.workout_minutes,
      activity_date: activity.activity_date,
    })
  }

  const handleUpdateActivity = async () => {
    if (!editActivity) return
    setIsLoading(true)

    const { error } = await supabase
      .from("activities")
      .update({
        steps: editActivityForm.steps,
        pushups: editActivityForm.pushups,
        workout_minutes: editActivityForm.workout_minutes,
        activity_date: editActivityForm.activity_date,
      })
      .eq("id", editActivity.id)

    setIsLoading(false)

    if (error) {
      alert(`Error updating activity: ${error.message}`)
    } else {
      setEditActivity(null)
      router.refresh()
    }
  }

  const handleDeleteActivity = async () => {
    if (!deleteActivity) return
    setIsLoading(true)

    const { error } = await supabase.from("activities").delete().eq("id", deleteActivity.id)

    setIsLoading(false)

    if (error) {
      alert(`Error deleting activity: ${error.message}`)
    } else {
      setDeleteActivity(null)
      router.refresh()
    }
  }

  const handleDeleteGenId = async () => {
    if (!deleteGenId) return
    setIsLoading(true)

    const { error } = await supabase.from("gen_ids").delete().eq("id", deleteGenId.id)

    setIsLoading(false)

    if (error) {
      alert(`Error deleting GenID: ${error.message}`)
    } else {
      setDeleteGenId(null)
      router.refresh()
    }
  }

  return (
    <div className="min-h-svh bg-muted/30 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage GenID users and data</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">My Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Admin Info */}
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Badge variant="default">Admin</Badge>
              <span className="text-sm text-muted-foreground">{adminEmail}</span>
            </div>
          </CardContent>
        </Card>

        {invalidFormatGenIds.length > 0 && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-yellow-800 dark:text-yellow-200">GenID Format Issue Detected</CardTitle>
              </div>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                {invalidFormatGenIds.length} GenID{invalidFormatGenIds.length > 1 ? "s are" : " is"} using the old
                alphanumeric format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                The system has been updated to use 6-digit numeric GenIDs (format: #000000). The following GenIDs need
                to be migrated:
              </p>
              <div className="space-y-1">
                {invalidFormatGenIds.map((g) => (
                  <div key={g.id} className="text-sm font-mono text-yellow-700 dark:text-yellow-300">
                    • #{g.short_id} ({g.users?.username})
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">To fix this issue:</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>
                    Run migration script:{" "}
                    <code className="rounded bg-yellow-200 px-1 py-0.5 dark:bg-yellow-800">
                      scripts/005_fix_genid_format.sql
                    </code>
                  </li>
                  <li>This will automatically convert all GenIDs to the new 6-digit numeric format</li>
                  <li>Click the Refresh button above to see the updated GenIDs</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">GenIDs Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{genIds.length}</div>
              <p className="text-xs text-muted-foreground">{users.length - genIds.length} pending</p>
              {invalidFormatGenIds.length > 0 && (
                <p className="text-xs text-yellow-600">{invalidFormatGenIds.length} need format update</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activities.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Avg Activities/User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.length > 0 ? (activities.length / users.length).toFixed(1) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="genids">
              GenIDs ({genIds.length})
              {invalidFormatGenIds.length > 0 && <AlertTriangle className="ml-1 h-3 w-3 text-yellow-600" />}
            </TabsTrigger>
            <TabsTrigger value="activities">Activities ({activities.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Quick summary of your GenID platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">User Engagement</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Users with GenID:</span>{" "}
                        <span className="font-medium">{genIds.length}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Users without GenID:</span>{" "}
                        <span className="font-medium">{users.length - genIds.length}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Adoption Rate:</span>{" "}
                        <span className="font-medium">
                          {users.length > 0 ? ((genIds.length / users.length) * 100).toFixed(1) : 0}%
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Activity Stats</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Total Logged Activities:</span>{" "}
                        <span className="font-medium">{activities.length}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Active Users:</span>{" "}
                        <span className="font-medium">{new Set(activities.map((a) => a.user_id)).size}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete list of registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => {
                    const userActivities = activities.filter((a) => a.user_id === user.id)
                    const userGenId = genIds.find((g) => g.user_id === user.id)
                    const streak = calculateStreak(userActivities)
                    const totalCredit = calculateTotalCredit(userActivities)
                    const hasInvalidFormat = userGenId && !isValidGenIdFormat(userGenId.short_id)

                    return (
                      <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{user.display_name}</p>
                            {userGenId && (
                              <Badge variant={hasInvalidFormat ? "destructive" : "secondary"}>
                                #{formatGenId(userGenId.short_id)}
                                {hasInvalidFormat && <AlertTriangle className="ml-1 h-3 w-3" />}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm">
                              <span className="font-medium">{totalCredit}</span> credits
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">{streak}</span> day streak
                            </p>
                            <p className="text-xs text-muted-foreground">{userActivities.length} activities</p>
                            <Button asChild variant="link" size="sm" className="h-auto p-0">
                              <Link href={`/g/${user.username}`}>View Profile</Link>
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => openEditUser(user)} title="Edit user">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeleteUser(user)}
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {users.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">No users registered yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="genids" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generated GenIDs</CardTitle>
                <CardDescription>All created GenID codes • Expected format: 6-digit numeric (#000000)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {genIds.map((genId) => {
                    const hasInvalidFormat = !isValidGenIdFormat(genId.short_id)

                    return (
                      <div
                        key={genId.id}
                        className={`flex items-center justify-between border-b pb-4 last:border-0 ${hasInvalidFormat ? "bg-yellow-50 dark:bg-yellow-950/20 -mx-4 px-4 rounded-lg" : ""}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={`font-mono text-xl font-bold ${hasInvalidFormat ? "text-yellow-700 dark:text-yellow-300" : ""}`}
                            >
                              #{formatGenId(genId.short_id)}
                            </p>
                            {hasInvalidFormat && (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Old Format
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {genId.users?.display_name} (@{genId.users?.username})
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">{genId.public_code}</p>
                          {hasInvalidFormat && (
                            <p className="text-xs text-yellow-700 dark:text-yellow-300">
                              ⚠ This GenID uses the old alphanumeric format. Run migration script 005 to update.
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm text-muted-foreground">
                            <p>Created: {new Date(genId.created_at).toLocaleDateString()}</p>
                            {genId.users && (
                              <Button asChild variant="link" size="sm" className="h-auto p-0">
                                <Link href={`/g/${genId.users.username}`}>View Profile</Link>
                              </Button>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeleteGenId(genId)}
                            title="Delete GenID"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                  {genIds.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">No GenIDs created yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest 100 activity logs across all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {activity.users?.display_name} (@{activity.users?.username})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.activity_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          {activity.steps} steps • {activity.pushups} pushups • {activity.workout_minutes} min workout
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">{calculateDailyScore(activity)}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditActivity(activity)}
                            title="Edit activity"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeleteActivity(activity)}
                            title="Delete activity"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">No activities logged yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={editUserForm.username}
                onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-display-name">Display Name</Label>
              <Input
                id="edit-display-name"
                value={editUserForm.display_name}
                onChange={(e) => setEditUserForm({ ...editUserForm, display_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editUserForm.email}
                onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteUser}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteUser(null)
            setDeletionStep("confirm")
            setDeletionResult(null)
            setVerificationResult(null)
          }
        }}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deletionStep === "confirm" && "Delete User - Complete Removal"}
              {deletionStep === "deleting" && "Deleting User..."}
              {deletionStep === "verifying" && "Verifying Deletion..."}
              {deletionStep === "complete" && "Deletion Complete"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {deletionStep === "confirm" && (
                  <>
                    <p>
                      You are about to permanently delete <strong>{deleteUser?.display_name}</strong> (
                      {deleteUser?.email}).
                    </p>
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                      <h4 className="mb-2 font-semibold text-destructive">This will permanently remove:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✓ User profile and username (@{deleteUser?.username})</li>
                        <li>✓ Email address ({deleteUser?.email})</li>
                        <li>✓ Authentication account</li>
                        <li>✓ GenID and all associated codes</li>
                        <li>
                          ✓ All activity logs ({activities.filter((a) => a.user_id === deleteUser?.id).length}{" "}
                          activities)
                        </li>
                      </ul>
                    </div>
                    <p className="text-sm">
                      After deletion, the username and email will be available for new registrations. This action cannot
                      be undone.
                    </p>
                  </>
                )}

                {deletionStep === "deleting" && (
                  <div className="flex items-center gap-3 py-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Removing user data from all systems...</span>
                  </div>
                )}

                {deletionStep === "verifying" && (
                  <div className="flex items-center gap-3 py-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Verifying complete removal...</span>
                  </div>
                )}

                {deletionStep === "complete" && deletionResult && (
                  <div className="space-y-4">
                    <div
                      className={`flex items-start gap-3 rounded-lg border p-4 ${
                        deletionResult.success && verificationResult?.isClean
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-yellow-500/50 bg-yellow-500/10"
                      }`}
                    >
                      {deletionResult.success && verificationResult?.isClean ? (
                        <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                      )}
                      <div className="flex-1 space-y-2">
                        <p className="font-semibold">{deletionResult.message}</p>

                        <div className="space-y-1 text-sm">
                          <h4 className="font-semibold">Deletion Summary:</h4>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2">
                              {deletionResult.details.activitiesDeleted > 0 ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                              Activities: {deletionResult.details.activitiesDeleted} deleted
                            </li>
                            <li className="flex items-center gap-2">
                              {deletionResult.details.genIdDeleted ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                              GenID: {deletionResult.details.genIdDeleted ? "Deleted" : "Not found"}
                            </li>
                            <li className="flex items-center gap-2">
                              {deletionResult.details.userDeleted ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              User Profile: {deletionResult.details.userDeleted ? "Deleted" : "Failed"}
                            </li>
                            <li className="flex items-center gap-2">
                              {deletionResult.details.authUserDeleted ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              Auth Account: {deletionResult.details.authUserDeleted ? "Deleted" : "Failed"}
                            </li>
                          </ul>
                        </div>

                        {verificationResult && (
                          <div className="mt-3 space-y-1 text-sm">
                            <h4 className="font-semibold">Verification Results:</h4>
                            {verificationResult.isClean ? (
                              <p className="text-green-600">✓ All user data completely removed</p>
                            ) : (
                              <div className="space-y-1 text-yellow-600">
                                <p>⚠ Some data remnants detected:</p>
                                <ul className="ml-4 space-y-1">
                                  {verificationResult.remnants.activities > 0 && (
                                    <li>{verificationResult.remnants.activities} activities remaining</li>
                                  )}
                                  {verificationResult.remnants.genIds > 0 && (
                                    <li>{verificationResult.remnants.genIds} GenIDs remaining</li>
                                  )}
                                  {verificationResult.remnants.userExists && <li>User profile still exists</li>}
                                  {verificationResult.remnants.authUserExists && <li>Auth account still exists</li>}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {deletionResult.errors.length > 0 && (
                          <div className="mt-3 space-y-1 text-sm">
                            <h4 className="font-semibold text-red-600">Errors:</h4>
                            <ul className="ml-4 space-y-1 text-red-600">
                              {deletionResult.errors.map((error: string, i: number) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {verificationResult?.isClean && (
                      <p className="text-sm text-muted-foreground">
                        Username and email are now available for new registrations.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {deletionStep === "confirm" && (
              <>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Permanently
                </AlertDialogAction>
              </>
            )}
            {deletionStep === "complete" && (
              <Button
                onClick={() => {
                  setDeleteUser(null)
                  setDeletionStep("confirm")
                  setDeletionResult(null)
                  setVerificationResult(null)
                  router.refresh()
                }}
              >
                Close
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editActivity} onOpenChange={(open) => !open && setEditActivity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>Update activity data</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-steps">Steps</Label>
              <Input
                id="edit-steps"
                type="number"
                value={editActivityForm.steps}
                onChange={(e) =>
                  setEditActivityForm({ ...editActivityForm, steps: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pushups">Pushups</Label>
              <Input
                id="edit-pushups"
                type="number"
                value={editActivityForm.pushups}
                onChange={(e) =>
                  setEditActivityForm({ ...editActivityForm, pushups: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-workout">Workout Minutes</Label>
              <Input
                id="edit-workout"
                type="number"
                value={editActivityForm.workout_minutes}
                onChange={(e) =>
                  setEditActivityForm({ ...editActivityForm, workout_minutes: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editActivityForm.activity_date}
                onChange={(e) => setEditActivityForm({ ...editActivityForm, activity_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditActivity(null)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateActivity} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteActivity} onOpenChange={(open) => !open && setDeleteActivity(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this activity from{" "}
              {deleteActivity && new Date(deleteActivity.activity_date).toLocaleDateString()}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteActivity}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Activity"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteGenId} onOpenChange={(open) => !open && setDeleteGenId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete GenID</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete GenID <strong>#{deleteGenId?.short_id}</strong>? The user will be able to
              generate a new one. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGenId}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete GenID"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
