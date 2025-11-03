"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

interface MemberCardProps {
  id: string
  name: string
  issueDate: string
  // Future blockchain-related props
  tokenId?: string
  chainId?: string
}

export default function MemberCard({ id, name, issueDate, tokenId, chainId }: MemberCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [glowAngle, setGlowAngle] = useState(0)

  // Animate the glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowAngle((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="relative w-[320px] h-[420px] cursor-pointer perspective"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        filter: `drop-shadow(0 0 15px rgba(139, 92, 246, 0.5))`,
      }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-[#1a0b2e] to-[#130822] p-1 shadow-xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Card border glow */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `linear-gradient(${glowAngle}deg, rgba(139, 92, 246, 0.8), rgba(79, 70, 229, 0.8), rgba(236, 72, 153, 0.8))`,
              filter: "blur(1.5px)",
              zIndex: -1,
            }}
          />

          <div className="flex flex-col h-full text-white bg-[#0a0a0a] rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                GenID
              </div>
            </div>

            <div className="mt-4 border border-purple-900/50 rounded-lg h-[240px] relative overflow-hidden">
              {/* Circuit pattern background */}
              <div className="absolute inset-0 opacity-30">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="card-circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path
                      d="M0 25 L50 25 M25 0 L25 50 M12.5 12.5 L37.5 37.5 M37.5 12.5 L12.5 37.5"
                      stroke="#8b5cf6"
                      strokeWidth="0.5"
                      fill="none"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#card-circuit)" />
                </svg>
              </div>
            </div>

            <div className="flex-grow"></div>

            <div className="mt-4 flex justify-between items-end">
              <div className="text-sm text-gray-300">#{id}</div>
              <div className="text-right">
                <div className="text-sm font-bold text-purple-400">{name}</div>
              </div>
            </div>

            <div className="mt-2 text-xs text-center text-gray-400">Tap to flip</div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-[#1a0b2e] to-[#130822] p-1 shadow-xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Card border glow */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `linear-gradient(${glowAngle}deg, rgba(139, 92, 246, 0.8), rgba(79, 70, 229, 0.8), rgba(236, 72, 153, 0.8))`,
              filter: "blur(1.5px)",
              zIndex: -1,
            }}
          />

          <div className="flex flex-col h-full text-white bg-[#0a0a0a] rounded-lg p-5">
            <div className="flex items-center mb-4">
              <Lock className="h-4 w-4 mr-2 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">Blockchain Secured</span>
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="w-28 h-28 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
                  <div className="text-gray-500 text-xs text-center">QR Code</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-purple-300">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ID:</span>
                <span className="text-purple-300">#{id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issue Date:</span>
                <span className="text-purple-300">{issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-purple-300">Premium</span>
              </div>
            </div>

            <div className="flex-grow"></div>

            <div className="mt-4 text-xs text-center text-gray-400">Tap to flip</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
