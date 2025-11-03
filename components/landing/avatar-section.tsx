import Image from "next/image"
import { Button } from "@/components/ui/button"

interface AvatarSectionProps {
  avatarUrl: string
}

/**
 * Avatar Connection section component for the landing page
 * Displays information about connecting your avatar with an image
 */
export function AvatarSection({ avatarUrl }: AvatarSectionProps) {
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Connect Your Avatar</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              With GenID, you can connect your virtual avatar to the GrowGen world, creating a seamless experience
              between your real-world fitness journey and your virtual presence.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-gray-300">Customize your avatar based on your real fitness achievements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-gray-300">
                  Unlock special avatar features as you progress in your fitness journey
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-gray-300">Participate in virtual fitness challenges with your avatar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-gray-300">Connect with other fitness enthusiasts in the GrowGen world</span>
              </li>
            </ul>

            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl">
              Learn More
            </Button>
          </div>

          {/* Right content - Avatar image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-3xl blur-3xl" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-purple-500/20">
                <Image src={avatarUrl || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
