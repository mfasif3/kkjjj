import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
}

/**
 * Feature card component for the landing page
 * Displays a feature with an icon, title, and description
 */
export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-[#1a0b2e] border-purple-900 shadow-lg shadow-purple-900/20">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-900/30 mb-4">
          <Icon className="h-6 w-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
}
