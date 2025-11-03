import { StepCard } from "./step-card"
import type { StepData } from "@/types/landing"

interface HowItWorksSectionProps {
  steps: StepData[]
}

/**
 * How It Works section component for the landing page
 * Displays a grid of step cards
 */
export function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#0a0118] to-[#0c0124] section-divider">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white">How GenID Works</h2>
          <p className="mt-4 text-gray-400 md:text-lg">
            Simple, secure, and connected - get started in just a few steps
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <StepCard key={index} number={step.number} title={step.title} description={step.description} />
          ))}
        </div>
      </div>
    </section>
  )
}
