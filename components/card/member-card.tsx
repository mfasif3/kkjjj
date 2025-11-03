"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { CardFront } from "./card-front"
import { CardBack } from "./card-back"
import type { CardData } from "@/types"

// Update the MemberCardProps interface to include healthScore
interface MemberCardProps extends CardData {
  className?: string
  showFlipHint?: boolean
  avatarUrl?: string
  healthScore?: number
}

/**
 * MemberCard component displays a flippable card with member information
 *
 * @param {string} id - Unique identifier for the member
 * @param {string} name - Member's name
 * @param {string} issueDate - Date when the card was issued
 * @param {string} [tokenId] - Blockchain token ID (optional)
 * @param {string} [chainId] - Blockchain chain ID (optional)
 * @param {number} [healthScore=72] - Health score out of 100
 * @param {string} [className] - Additional CSS classes
 * @param {boolean} [showFlipHint=true] - Whether to show the "Tap to flip" hint
 * @param {string} [avatarUrl] - URL to the member's avatar image
 */
export default function MemberCard({
  id,
  name,
  issueDate,
  tokenId,
  chainId,
  healthScore = 72,
  type = "Premium",
  className = "",
  showFlipHint = true,
  avatarUrl,
}: MemberCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [glowAngle, setGlowAngle] = useState(0)

  // Animate the glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowAngle((prev) => (prev + 1) % 360)
    }, 50)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  // Handle card flip
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev)
  }, [])

  return (
    <div
      className={`relative w-[320px] h-[420px] cursor-pointer perspective ${className}`}
      onClick={handleFlip}
      style={{
        filter: `drop-shadow(0 0 15px rgba(139, 92, 246, 0.5))`,
      }}
      role="button"
      aria-label={isFlipped ? "Flip card to front" : "Flip card to back"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleFlip()
        }
      }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <CardFront id={id} name={name} glowAngle={glowAngle} avatarUrl={avatarUrl} />
        <CardBack id={id} name={name} issueDate={issueDate} healthScore={healthScore} glowAngle={glowAngle} />
      </motion.div>
    </div>
  )
}
