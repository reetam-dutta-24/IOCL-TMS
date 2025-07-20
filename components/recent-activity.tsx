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
      new: { 
        className: "bg-red-100 text-red-800 hover:bg-red-200", 
        label: "New" 
      },
      assigned: { 
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200", 
        label: "Assigned" 
      },
      approved: { 
        className: "bg-green-100 text-green-800 hover:bg-green-200", 
        label: "Approved" 
      },
      completed: { 
        className: "bg-gray-100 text-gray-800 hover:bg-gray-200", 
        label: "Completed" 
      },
      rejected: { 
        className: "bg-red-100 text-red-800 hover:bg-red-200", 
        label: "Rejected" 
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["new"]
    return (
      <Badge className={`text-xs ${config.className}`}>
        {config.label}
      </Badge>
    )
  }

  return (
    <Card className="border-red-100">
      <CardHeader>
        <CardTitle className="text-red-900">Recent Activity</CardTitle>
        <CardDescription>Latest system activities and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${activity.user}`} />
                <AvatarFallback className="text-xs bg-red-100 text-red-600">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">{activity.user}</span>{" "}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  {getStatusBadge(activity.status)}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1 text-red-400" />
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
