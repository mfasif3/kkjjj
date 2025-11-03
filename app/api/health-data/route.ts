import { NextResponse } from "next/server"
import { encryptHealthData, generateHealthDataHash } from "@/utils/health-data-encryption"
import type { HealthDataResponse } from "@/types"

// This would be replaced with your actual database connection
// For demonstration, we're using a simple in-memory store
const healthData = new Map()

/**
 * API route handler for storing health data
 *
 * @param {Request} request - HTTP request object
 * @returns {Promise<NextResponse>} HTTP response
 */
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.memberId || !data.healthData) {
      return NextResponse.json<HealthDataResponse>(
        {
          success: false,
          memberId: "",
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Mock encryption with a placeholder public key
    const publicKey = "mock-public-key-for-" + data.memberId
    const encryptedData = await encryptHealthData(data.healthData, publicKey)

    // Generate a hash of the health data
    const dataHash = await generateHealthDataHash(data.healthData)

    // Store the encrypted data (in a real app, this would go to a secure database)
    healthData.set(data.memberId, {
      encryptedData,
      dataHash,
      timestamp: new Date().toISOString(),
    })

    // Return success response
    return NextResponse.json<HealthDataResponse>({
      success: true,
      memberId: data.memberId,
      dataHash,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error storing health data:", error)
    return NextResponse.json<HealthDataResponse>(
      {
        success: false,
        memberId: "",
        error: "Failed to store health data",
      },
      { status: 500 },
    )
  }
}

/**
 * API route handler for retrieving health data
 *
 * @param {Request} request - HTTP request object
 * @returns {Promise<NextResponse>} HTTP response
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const memberId = url.searchParams.get("memberId")

    if (!memberId) {
      return NextResponse.json<HealthDataResponse>(
        {
          success: false,
          memberId: "",
          error: "Missing memberId parameter",
        },
        { status: 400 },
      )
    }

    const memberHealthData = healthData.get(memberId)

    if (!memberHealthData) {
      return NextResponse.json<HealthDataResponse>(
        {
          success: false,
          memberId,
          error: "No health data found for this member",
        },
        { status: 404 },
      )
    }

    // Return the data hash and timestamp (but not the encrypted data itself)
    return NextResponse.json<HealthDataResponse>({
      success: true,
      memberId,
      dataHash: memberHealthData.dataHash,
      timestamp: memberHealthData.timestamp,
      hasData: true,
    })
  } catch (error) {
    console.error("Error retrieving health data:", error)
    return NextResponse.json<HealthDataResponse>(
      {
        success: false,
        memberId: "",
        error: "Failed to retrieve health data",
      },
      { status: 500 },
    )
  }
}
