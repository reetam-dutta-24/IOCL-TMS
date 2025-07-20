"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, UserPlus, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Activity {
  id: number
  type: "request_submitted" | "mentor_assigned" | "request_approved" | "request_pending"
  title: string
  description: string
  timestamp: string
  user: {
    name: string
    avatar?: string
  }
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/dashboard/activity")
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      } else {
        // Fallback to mock data
        setActivities([
          {
            id: 1,
            type: "request_submitted",
            title: "New Request Submitted",
            description: "Arjun Reddy submitted internship request",
            timestamp: "2 hours ago",
            user: { name: "Arjun Reddy" },
          },
          {
            id: 2,
            type: "mentor_assigned",
            title: "Mentor Assigned",
            description: "Dr. Sharma assigned to Sneha Agarwal",
            timestamp: "4 hours ago",
            user: { name: "Dr. Sharma" },
          },
          {
            id: 3,
            type: "request_approved",
            title: "Request Approved",
            description: "Rohit Kumar's request was approved",
            timestamp: "1 day ago",
            user: { name: "Priya Sharma" },
          },
          {
            id: 4,
            type: "request_pending",
            title: "Pending Review",
            description: "3 requests awaiting approval",
            timestamp: "2 days ago",
            user: { name: "System" },
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "request_submitted":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "mentor_assigned":
        return <UserPlus className="h-4 w-4 text-green-600" />
      case "request_approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "request_pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityBadge = (type: Activity["type"]) => {
    switch (type) {
      case "request_submitted":
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>
      case "mentor_assigned":
        return <Badge className="bg-green-100 text-green-800">Assigned</Badge>
      case "request_approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "request_pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <Card className="border-orange-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-red-700">Recent Activity</CardTitle>
          <CardDescription>Latest updates and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-orange-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-red-700">Recent Activity</CardTitle>
        <CardDescription>Latest updates and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-red-100 text-red-700">{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getActivityIcon(activity.type)}
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  </div>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
