import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUp, ArrowDown, Minus, LucideIcon } from "lucide-react"

interface TraineeStatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: LucideIcon
  description: string
  progress?: number
}

export function TraineeStatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  progress
}: TraineeStatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-600" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{value}</div>
          {progress !== undefined && (
            <Progress value={progress} className="h-2" />
          )}
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            {change && (
              <>
                {getTrendIcon()}
                <span className={getTrendColor()}>{change}</span>
              </>
            )}
            <span>{description}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}