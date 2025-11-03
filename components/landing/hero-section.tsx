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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0118] py-20">
      {/* Background circuit pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="white" />
              <line x1="50" y1="0" x2="50" y2="50" stroke="white" strokeWidth="1" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-purple-400 text-sm font-medium">Digital Fitness Identity</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
                GenID
              </span>
            </h1>

            <h2 className="text-3xl md:text-4xl font-bold text-white">Create Your Unique Fitness Identity</h2>

            <p className="text-lg text-gray-400 leading-relaxed">
              Your Gen ID is your gateway to the GrowGen ecosystem. Track your progress, earn rewards, and unlock new
              features as you level up both in the real and virtual world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl"
                asChild
              >
                <a href="/auth/signup">Get Your GenID</a>
              </Button>
            </div>
          </div>

          {/* Right content - Card - Match exact card container: w-full max-w-md */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <MemberCard
                id="86525"
                name="John Doe"
                issueDate="2024-01-15"
                healthScore={72}
                avatarUrl={avatarUrl}
                showFlipHint={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
