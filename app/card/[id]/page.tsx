"use client"

import { useState, useEffect } from "react"
import MemberCard from "@/components/card/member-card"
import type { CardData } from "@/types"

/**
 * Fetches member data from the database
 *
 * @param {string} id - Member ID
 * @returns {Promise<CardData | null>} Member data or null if not found
 */
async function getMemberData(id: string): Promise<CardData | null> {
  try {
    // This is a placeholder - replace with actual database query
    // For demo purposes, we'll return mock data
    if (id === "12345") {
      return {
        id: "12345",
        name: "John Doe",
        email: "john@example.com",
        issueDate: "2025-03-20",
      }
    }

    // Simulate database lookup based on ID
    // In production, you would query your actual database
    return {
      id: id,
      name: "Member Name",
      email: "member@example.com",
      issueDate: "2025-03-20",
    }
  } catch (error) {
    console.error("Error fetching member data:", error)
    return null
  }
}

interface CardPageProps {
  params: {
    id: string
  }
}

/**
 * Card page component that displays a member's card
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - URL parameters
 * @param {string} props.params.id - Member ID from URL
 */
export default function CardPage({ params }: CardPageProps) {
  const [memberData, setMemberData] = useState<CardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const data = await getMemberData(params.id)

        if (!data) {
          setError("Member not found")
          return
        }

        setMemberData(data)
      } catch (error) {
        console.error("Error fetching member data:", error)
        setError("Failed to load member data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0118]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (error || !memberData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0118]">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || "Member not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0118] items-center justify-center p-4">
      <div className="max-w-md w-full text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Your GenID Card</h1>
        <p className="text-gray-400">
          This is your personal digital identity card. You can access it anytime using your unique ID.
        </p>
      </div>

      <MemberCard id={memberData.id} name={memberData.name} issueDate={memberData.issueDate} />

      <div className="mt-8 text-center">
        <p className="text-gray-400 mb-4">
          Your unique ID: <span className="text-purple-400 font-bold">{memberData.id}</span>
        </p>

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
          onClick={() => window.print()}
        >
          Download Card
        </button>
      </div>
    </div>
  )
}
