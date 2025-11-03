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
    <div
      className="absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-[#1a0b2e] to-[#130822] p-1 shadow-xl"
      style={{ backfaceVisibility: "hidden" }}
    >
      {/* Card border glow */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(${glowAngle}deg, ${COLORS.gradient.glow})`,
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
          {/* Card pattern background */}
          <div className="absolute inset-0 opacity-40">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="card-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#888" opacity="0.3" />
                <circle cx="10" cy="10" r="1" fill="#888" opacity="0.3" />
                <circle cx="18" cy="18" r="1" fill="#888" opacity="0.3" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#card-dots)" />
            </svg>
          </div>

          {/* Avatar image */}
          {avatarUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Connected Avatar"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>
            </div>
          )}

          {children}
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
  )
}
