import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "request_submitted",
      user: "Arjun Reddy",
      action: "submitted a new internship request",
      time: "2 hours ago",
      status: "new",
    },
    {
      id: 2,
      type: "mentor_assigned",
      user: "Vikram Gupta",
      action: "was assigned as mentor for Sneha Agarwal",
      time: "4 hours ago",
      status: "assigned",
    },
    {
      id: 3,
      type: "request_approved",
      user: "Rajesh Kumar",
      action: "approved internship request REQ003",
      time: "6 hours ago",
      status: "approved",
    },
    {
      id: 4,
      type: "report_submitted",
      user: "Meera Joshi",
      action: "submitted weekly progress report",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: 5,
      type: "request_rejected",
      user: "L&D Department",
      action: "rejected internship request REQ001",
      time: "2 days ago",
      status: "rejected",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "default" as const, label: "New" },
      assigned: { variant: "secondary" as const, label: "Assigned" },
      approved: { variant: "default" as const, label: "Approved" },
      completed: { variant: "secondary" as const, label: "Completed" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["new"]
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system activities and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${activity.user}`} />
                <AvatarFallback className="text-xs">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  {getStatusBadge(activity.status)}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
