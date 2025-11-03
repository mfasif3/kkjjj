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
    <section className="py-16 md:py-24 bg-black relative black-to-purple">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
        {/* Header section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">One ID, Unlimited Possibilities</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            GenID connects your fitness journey across platforms, securing your data while unlocking new experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:bg-zinc-900/70 h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-zinc-700 transition-colors duration-300">
                  <feature.icon className="h-7 w-7 text-purple-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-100 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <button className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105">
              Explore All Features
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
