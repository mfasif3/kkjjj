interface StepCardProps {
  number: number
  title: string
  description: string
}

/**
 * Step card component for the "How It Works" section
 * Displays a step with a number, title, and description
 */
export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
