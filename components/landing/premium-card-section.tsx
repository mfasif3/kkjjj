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
      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content - Card */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md aspect-[1.6/1]">
              {/* Card border glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/50 to-violet-500/50 blur-2xl opacity-75" />

              {/* Card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0a0a0a] border-2 border-purple-500/30">
                <div className="absolute top-6 left-6 text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
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

                {/* Avatar image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48">
                  <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-gray-800">
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

              {/* Premium badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg">
                Premium
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">The GenID Fitness Card</h2>
            <p className="text-xl text-purple-400 font-semibold">
              Experience the ultimate blockchain-secured digital fitness identity with our premium card
            </p>
            <p className="text-gray-400 leading-relaxed">
              The GenID fitness card offers secure storage of your health data on-chain, with exclusive benefits and
              priority access to the GrowGen world.
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <BenefitItem key={index} text={benefit} />
              ))}
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
      </div>
    </section>
  )
}
