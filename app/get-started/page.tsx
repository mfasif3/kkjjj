import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GetStartedPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 bg-[#0a0118]">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
          GenID
        </h1>
        <p className="text-lg text-gray-400">
          Your digital health passport. Track your fitness, build streaks, and earn credits.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-purple-500/30 text-purple-400 bg-transparent">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
