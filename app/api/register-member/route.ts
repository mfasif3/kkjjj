import { NextResponse } from "next/server"
import type { RegisterMemberResponse } from "@/types"

// This would be replaced with your actual database connection
// For demonstration, we're using a simple in-memory store
const members = new Map()

/**
 * API route handler for registering a new member
 *
 * @param {Request} request - HTTP request object
 * @returns {Promise<NextResponse>} HTTP response
 */
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.email || !data.name) {
      return NextResponse.json<RegisterMemberResponse>(
        {
          success: false,
          memberId: "",
          cardUrl: "",
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Generate a unique ID for the member
    const memberId = generateMemberId()

    // Create member record
    const member = {
      id: memberId,
      name: data.name,
      email: data.email,
      issueDate: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      createdAt: new Date().toISOString(),
    }

    // Store member data (replace with your database logic)
    members.set(memberId, member)

    // Return success with the member ID and card access info
    return NextResponse.json<RegisterMemberResponse>({
      success: true,
      memberId: memberId,
      cardUrl: `/card/${memberId}`,
    })
  } catch (error) {
    console.error("Error registering member:", error)
    return NextResponse.json<RegisterMemberResponse>(
      {
        success: false,
        memberId: "",
        cardUrl: "",
        error: "Failed to register member",
      },
      { status: 500 },
    )
  }
}

/**
 * Generates a unique member ID
 *
 * @returns {string} Unique member ID
 */
function generateMemberId(): string {
  return `${Math.floor(10000 + Math.random() * 90000)}` // 5-digit number
}
