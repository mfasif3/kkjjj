import { FeatureCard } from "./feature-card"
import type { FeatureData } from "@/types/landing"

interface FeaturesSectionProps {
  features: FeatureData[]
}

/**
 * Features section component for the landing page
 * Displays a grid of feature cards
 */
export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-[#0a0118] section-divider">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white">One ID, Unlimited Possibilities</h2>
          <p className="mt-4 text-gray-400 md:text-lg">
            GenID is more than just a fitness card - it's your gateway to the GrowGen ecosystem.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  )
}
