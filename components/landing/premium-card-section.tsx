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
    <section className="py-16 md:py-24 bg-black black-to-purple">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white">The GenID Fitness Card</h2>
          <p className="mt-4 text-gray-400 md:text-lg">
            Experience the ultimate blockchain-secured digital fitness identity with our premium card
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="relative w-[280px] h-[380px] mb-6"
            style={{
              filter: `drop-shadow(0 0 15px rgba(139, 92, 246, 0.5))`,
            }}
          >
            <div className="absolute w-full h-full rounded-xl bg-gradient-to-br from-[#1a0b2e] to-[#130822] p-1 shadow-xl">
              {/* Card border glow */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(45deg, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.8))`,
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

                <div className="mt-4 border border-purple-900/50 rounded-lg h-[220px] relative overflow-hidden">
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
                </div>

                <div className="flex-grow"></div>

                <div className="mt-4 flex justify-between items-end">
                  <div className="text-sm text-gray-300">#86525</div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-400">John Doe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-purple-400 mb-3">Premium</h3>
          <div className="max-w-xl text-center">
            <p className="text-gray-300 mb-6">
              The GenID fitness card offers secure storage of your health data on-chain, with exclusive benefits and
              priority access to the GrowGen world.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mx-auto max-w-lg mb-8">
              {benefits.map((benefit, index) => (
                <BenefitItem key={index} text={benefit} />
              ))}
            </ul>
            <div className="relative inline-block">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">Get Your GenID</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
