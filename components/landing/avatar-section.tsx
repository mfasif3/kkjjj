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
    <section className="py-16 md:py-24 bg-[#0a0118] purple-to-black">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="flex flex-col space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white">Connect Your Avatar</h2>
            <p className="text-gray-300">
              With GenID, you can connect your virtual avatar to the GrowGen world, creating a seamless experience
              between your real-world fitness journey and your virtual presence.
            </p>

            <ul className="space-y-2 mt-4">
              <li className="flex items-start">
                <div className="mr-2 text-purple-400">•</div>
                <span className="text-gray-300">Customize your avatar based on your real fitness achievements</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-purple-400">•</div>
                <span className="text-gray-300">
                  Unlock special avatar features as you progress in your fitness journey
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-purple-400">•</div>
                <span className="text-gray-300">Participate in virtual fitness challenges with your avatar</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 text-purple-400">•</div>
                <span className="text-gray-300">Connect with other fitness enthusiasts in the GrowGen world</span>
              </li>
            </ul>
            <div className="pt-4">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Learn More</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-[300px] h-[400px]">
              <Image
                src={avatarUrl || "/placeholder.svg"}
                alt="Fitness Avatar"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
