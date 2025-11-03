interface BenefitItemProps {
  text: string
}

/**
 * Benefit item component for the premium card section
 * Displays a bullet point with text
 */
export function BenefitItem({ text }: BenefitItemProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-purple-400 mt-1">•</span>
      <span className="text-gray-300">{text}</span>
    </div>
  )
}
