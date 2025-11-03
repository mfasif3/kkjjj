import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GenIDCardProps {
  displayName: string
  username: string
  credit: number
  streak: number
  badges: string[]
  genId?: string | null
}

export function GenIDCard({ displayName, username, credit, streak, badges, genId }: GenIDCardProps) {
  const formatGenId = (id: string) => {
    return id.padStart(6, "0")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-2 pb-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">@{username}</p>
          {genId && <p className="font-mono text-lg font-bold text-primary">#{formatGenId(genId)}</p>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 text-center">
            <div className="text-3xl font-bold">{credit}</div>
            <div className="text-sm text-muted-foreground">Total Credit</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-3xl font-bold">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Badges</h3>
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {badges.slice(0, 3).map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No badges earned yet</p>
          )}
        </div>

        {/* GenID Branding */}
        <div className="border-t pt-4 text-center">
          <p className="text-xs text-muted-foreground">Digital Health Passport powered by GenID</p>
        </div>
      </CardContent>
    </Card>
  )
}
