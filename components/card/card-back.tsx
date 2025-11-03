import { Lock } from "lucide-react"

interface CardBackProps {
  id: string
  name: string
  issueDate: string
  healthScore?: number
  glowAngle: number
}

export function CardBack({ id, name, issueDate, healthScore = 72, glowAngle }: CardBackProps) {
  return (
    <div
      className="absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-[#1a0b2e] to-[#130822] p-1 shadow-xl"
      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
    >
      {/* Card border glow */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(${glowAngle}deg, rgba(139, 92, 246, 0.8), rgba(79, 70, 229, 0.8), rgba(236, 72, 153, 0.8))`,
          filter: "blur(1.5px)",
          zIndex: -1,
        }}
      />

      <div className="flex flex-col h-full text-white bg-[#0a0a0a] rounded-lg p-5">
        <div className="flex items-center mb-4">
          <Lock className="h-4 w-4 mr-2 text-purple-400" />
          <span className="text-sm font-semibold text-purple-300">Blockchain Secured</span>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="w-28 h-28 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
              <div className="text-gray-500 text-xs text-center">QR Code</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Name:</span>
            <span className="text-purple-300">{name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">ID:</span>
            <span className="text-purple-300">#{id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Issue Date:</span>
            <span className="text-purple-300">{issueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Health Score:</span>
            <span className="text-purple-300">{healthScore}/100</span>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="mt-4 text-xs text-center text-gray-400">Tap to flip</div>
      </div>
    </div>
  )
}
