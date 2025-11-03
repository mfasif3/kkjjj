"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

interface DeletionResult {
  success: boolean
  message: string
  details: {
    activitiesDeleted: number
    genIdDeleted: boolean
    userDeleted: boolean
    authUserDeleted: boolean
  }
  errors: string[]
}

interface VerificationResult {
  isClean: boolean
  remnants: {
    activities: number
    genIds: number
    userExists: boolean
    authUserExists: boolean
  }
}

export async function deleteUserCompletely(userId: string, userEmail: string): Promise<DeletionResult> {
  const supabase = await createClient()
  const errors: string[] = []
  const details = {
    activitiesDeleted: 0,
    genIdDeleted: false,
    userDeleted: false,
    authUserDeleted: false,
  }

  try {
    // Step 1: Delete all activities
    const { data: activities, error: activitiesError } = await supabase
      .from("activities")
      .delete()
      .eq("user_id", userId)
      .select()

    if (activitiesError) {
      errors.push(`Activities deletion error: ${activitiesError.message}`)
    } else {
      details.activitiesDeleted = activities?.length || 0
    }

    // Step 2: Delete GenID
    const { error: genIdError } = await supabase.from("gen_ids").delete().eq("user_id", userId)

    if (genIdError) {
      errors.push(`GenID deletion error: ${genIdError.message}`)
    } else {
      details.genIdDeleted = true
    }

    // Step 3: Delete from users table
    const { error: userError } = await supabase.from("users").delete().eq("id", userId)

    if (userError) {
      errors.push(`User table deletion error: ${userError.message}`)
    } else {
      details.userDeleted = true
    }

    // Step 4: Delete from Supabase Auth using service role
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const adminClient = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
        )

        const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

        if (authError) {
          errors.push(`Auth deletion error: ${authError.message}`)
        } else {
          details.authUserDeleted = true
        }
      } catch (error) {
        errors.push(`Auth deletion exception: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    } else {
      errors.push("Service role key not configured - auth user not deleted")
    }

    // Revalidate admin page
    revalidatePath("/admin")

    const success = details.userDeleted && details.authUserDeleted && errors.length === 0

    return {
      success,
      message: success
        ? `User completely deleted. ${details.activitiesDeleted} activities removed.`
        : "User deletion completed with some errors. See details below.",
      details,
      errors,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unexpected error during deletion",
      details,
      errors: [...errors, error instanceof Error ? error.message : "Unknown error"],
    }
  }
}

export async function verifyUserDeletion(userId: string, userEmail: string): Promise<VerificationResult> {
  const supabase = await createClient()
  const remnants = {
    activities: 0,
    genIds: 0,
    userExists: false,
    authUserExists: false,
  }

  // Check for remaining activities
  const { data: activities } = await supabase.from("activities").select("id").eq("user_id", userId)
  remnants.activities = activities?.length || 0

  // Check for remaining GenIDs
  const { data: genIds } = await supabase.from("gen_ids").select("id").eq("user_id", userId)
  remnants.genIds = genIds?.length || 0

  // Check if user still exists in users table
  const { data: user } = await supabase.from("users").select("id").eq("id", userId).single()
  remnants.userExists = !!user

  // Check if auth user still exists
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      )

      const { data: authUser } = await adminClient.auth.admin.getUserById(userId)
      remnants.authUserExists = !!authUser.user
    } catch {
      // User not found is expected after deletion
      remnants.authUserExists = false
    }
  }

  const isClean = remnants.activities === 0 && remnants.genIds === 0 && !remnants.userExists && !remnants.authUserExists

  return {
    isClean,
    remnants,
  }
}

export async function forceCleanupUser(userId: string): Promise<DeletionResult> {
  // This is a more aggressive cleanup that tries multiple times
  const result = await deleteUserCompletely(userId, "")

  // Verify and retry if needed
  const verification = await verifyUserDeletion(userId, "")

  if (!verification.isClean) {
    // Try one more time for any remnants
    const errors: string[] = []
    const supabase = await createClient()

    if (verification.remnants.activities > 0) {
      await supabase.from("activities").delete().eq("user_id", userId)
    }

    if (verification.remnants.genIds > 0) {
      await supabase.from("gen_ids").delete().eq("user_id", userId)
    }

    if (verification.remnants.userExists) {
      await supabase.from("users").delete().eq("id", userId)
    }

    revalidatePath("/admin")

    return {
      success: true,
      message: "Force cleanup completed. Verification recommended.",
      details: result.details,
      errors,
    }
  }

  return result
}

export async function checkAllUsersForRemnants(): Promise<
  Array<{
    userId: string
    username: string
    hasRemnants: boolean
    remnants: VerificationResult["remnants"]
  }>
> {
  const supabase = await createClient()

  // Get all auth users
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return []
  }

  const adminClient = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { data: authUsers } = await adminClient.auth.admin.listUsers()

  if (!authUsers.users) {
    return []
  }

  const results = []

  for (const authUser of authUsers.users) {
    const { data: user } = await supabase.from("users").select("username").eq("id", authUser.id).single()

    const verification = await verifyUserDeletion(authUser.id, authUser.email || "")

    if (!verification.isClean) {
      results.push({
        userId: authUser.id,
        username: user?.username || "Unknown",
        hasRemnants: true,
        remnants: verification.remnants,
      })
    }
  }

  return results
}
