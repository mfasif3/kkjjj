import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">GenID Not Found</h1>
        <p className="text-muted-foreground">This GenID handle doesn&apos;t exist or has been removed.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
