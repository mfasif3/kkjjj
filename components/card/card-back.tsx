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
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Card border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-75"
        style={{
          background: `conic-gradient(from ${glowAngle}deg at 50% 50%, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.8))`,
          filter: "blur(20px)",
        }}
      />

      {/* Card background */}
      <div className="absolute inset-[2px] rounded-2xl bg-[#0a0a0a] p-8">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-semibold">Blockchain Secured</span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black text-xs">QR Code</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ID:</span>
              <span className="text-white">#{id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Issue Date:</span>
              <span className="text-white">{issueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Health Score:</span>
              <span className="text-purple-400 font-semibold">{healthScore}/100</span>
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs mt-4">Tap to flip</div>
        </div>
      </div>
    </div>
  )
}
