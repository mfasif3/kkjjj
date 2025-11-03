import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BenefitItem } from "./benefit-item"

interface PremiumCardSectionProps {
  avatarUrl: string
  benefits: string[]
}

/**
 * Premium Card section component for the landing page
 * Displays a sample GenID card and benefits
 */
export function PremiumCardSection({ avatarUrl, benefits }: PremiumCardSectionProps) {
  return (
    <section className="relative py-24 bg-[#0a0118] overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Title and subtitle */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">The GenID Fitness Card</h2>
            <p className="text-lg text-gray-400 max-w-3xl">
              Experience the ultimate blockchain-secured <span className="text-purple-400">digital</span> fitness
              identity with our premium card
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full max-w-md aspect-[1.6/1]">
              {/* Enhanced card border glow with multiple layers for stronger neon effect */}
              <div className="absolute inset-0 rounded-2xl bg-purple-500/40 blur-3xl" />
              <div className="absolute inset-0 rounded-2xl bg-violet-500/30 blur-2xl" />
              <div className="absolute inset-0 rounded-2xl bg-purple-600/20 blur-xl" />

              {/* Card with pure black background and purple border */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <div className="absolute top-6 left-6 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  GenID
                </div>

                {/* Card pattern background */}
                <div className="absolute inset-0 opacity-5">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="card-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#card-grid)" />
                  </svg>
                </div>

                {/* Avatar image - square with dark border */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48">
                  <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-gray-900/80">
                    <Image src={avatarUrl || "/placeholder.svg"} alt="Member avatar" fill className="object-cover" />
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="text-white font-mono text-lg">#86525</div>
                  <div className="text-right">
                    <div className="text-purple-400 font-semibold text-lg">John Doe</div>
                  </div>
                </div>
              </div>
            </div>
            {/* </CHANGE> */}

            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Premium
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <p className="text-gray-400 leading-relaxed">
              The GenID fitness card offers secure storage of your health data on-chain, with exclusive benefits and
              priority access to the GrowGen world.
            </p>

            <div className="grid md:grid-cols-2 gap-4 text-left">
              {benefits.map((benefit, index) => (
                <BenefitItem key={index} text={benefit} />
              ))}
            </div>
          </div>

          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl"
            asChild
          >
            <a href="/auth/signup">Get Your GenID</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
