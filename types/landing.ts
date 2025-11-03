import type React from "react"

/**
 * Feature data for the Features section
 */
export interface FeatureData {
  icon: React.ElementType
  title: string
  description: string
}

/**
 * Step data for the How It Works section
 */
export interface StepData {
  number: number
  title: string
  description: string
}
