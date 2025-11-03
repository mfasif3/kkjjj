interface BenefitItemProps {
  text: string
}

/**
 * Benefit item component for the premium card section
 * Displays a bullet point with text
 */
export function BenefitItem({ text }: BenefitItemProps) {
  return (
    <li className="flex items-start">
      <div className="mr-2 mt-1 text-purple-400">•</div>
      <span className="text-gray-300">{text}</span>
    </li>
  )
}
