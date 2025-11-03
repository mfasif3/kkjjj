"use client"

import { motion } from "framer-motion"
import type { FeatureData } from "@/types/landing"

interface FeaturesSectionProps {
  features: FeatureData[]
}

/**
 * Simplified Features section component for the landing page
 * Displays features in a clean grid layout
 */
export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="relative py-24 bg-[#0a0118] overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
        {/* Header section - Match exact spacing: mb-16 */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white">One ID, Unlimited Possibilities</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            GenID connects your fitness journey across platforms, securing your data while unlocking new experiences.
          </p>
        </div>

        {/* Features Grid - Match exact grid layout: md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1a0b2e] to-[#130822] border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button className="px-8 py-3 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  )
}
