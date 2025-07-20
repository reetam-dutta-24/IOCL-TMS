"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

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
    <Card className="border-orange-200 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-red-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Badge
            variant="secondary"
            className={`flex items-center space-x-1 ${
              trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{change}</span>
          </Badge>
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
