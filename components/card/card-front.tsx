import type { ReactNode } from "react"
import Image from "next/image"
import { COLORS } from "@/constants/theme"

interface CardFrontProps {
  id: string
  name: string
  glowAngle: number
  avatarUrl?: string
  children?: ReactNode
}

/**
 * Card front component for the member card
 * Displays the front side of a GenID card with avatar and member info
 */
export function CardFront({ id, name, glowAngle, avatarUrl, children }: CardFrontProps) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Card border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-75"
        style={{
          background: `conic-gradient(from ${glowAngle}deg at 50% 50%, ${COLORS.gradient.glow})`,
          filter: "blur(20px)",
        }}
      />

      {/* Card background - Match exact inset and background from reference */}
      <div
        className="absolute inset-[2px] rounded-2xl"
        style={{
          background: COLORS.background.cardInner,
        }}
      >
        {/* GenID text - Match exact positioning: top-6 left-6 text-2xl */}
        <div className="absolute top-6 left-6 text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
          GenID
        </div>

        {/* Card pattern background */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Avatar image - Match exact sizing and positioning: w-48 h-48 centered */}
        {avatarUrl && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48">
            <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-gray-800">
              <Image src={avatarUrl || "/placeholder.svg"} alt="Member avatar" fill className="object-cover" />
            </div>
          </div>
        )}

        {children}

        {/* Bottom info - Match exact positioning: bottom-6 left-6 right-6 */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div className="text-white font-mono text-lg">#{id}</div>
          <div className="text-right">
            <div className="text-purple-400 font-semibold text-lg">{name}</div>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-500 text-xs">Tap to flip</div>
      </div>
    </div>
  )
}
