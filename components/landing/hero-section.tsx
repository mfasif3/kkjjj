"use client"

import { Button } from "@/components/ui/button"
import MemberCard from "@/components/card/member-card"

interface HeroSectionProps {
  avatarUrl: string
  onCardFlip: () => void
}

/**
 * Hero section component for the landing page
 * Displays the main heading, description, and a member card
 */
export function HeroSection({ avatarUrl, onCardFlip }: HeroSectionProps) {
  return (
    <section className="relative py-32 md:py-48 overflow-hidden bg-[#0a0118] purple-to-black">
      {/* Background circuit pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M0 50 L100 50 M50 0 L50 100 M25 25 L75 75 M75 25 L25 75"
              stroke="#8b5cf6"
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-8">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-600">
                GenID
              </h1>
              <h2 className="text-2xl font-semibold text-white">Create Your Unique Fitness Identity</h2>
              <p className="max-w-[600px] text-gray-300 md:text-lg mb-8">
                Your Gen ID is your gateway to the GrowGen ecosystem. Track your progress, earn rewards, and unlock new
                features as you level up both in the real and virtual world.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <div className="relative inline-block">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">Get Your GenID</Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <MemberCard id="86525" name="John Doe" issueDate="03/19/2025" avatarUrl={avatarUrl} onClick={onCardFlip} />
          </div>
        </div>
      </div>
    </section>
  )
}
