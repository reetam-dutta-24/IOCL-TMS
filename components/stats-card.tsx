import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  description: string
}

export function StatsCard({ title, value, change, trend, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="border-red-100 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className="bg-red-100 p-2 rounded-lg">
          <Icon className="h-4 w-4 text-red-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center space-x-2 text-xs mt-1">
          <span className={`font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {change}
          </span>
          <span className="text-gray-500">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
