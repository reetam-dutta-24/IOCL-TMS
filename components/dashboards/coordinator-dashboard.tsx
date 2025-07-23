"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Route,
  Building,
  Activity,
  TrendingUp,
  Calendar,
  Plus,
  RefreshCw
} from "lucide-react"

export function CoordinatorDashboard() {
  const coordinationStats = {
    totalRequests: 89,
    processingQueue: 12,
    routedToday: 8,
    avgProcessingTime: "2.3 hours",
    departmentLoad: {
      "IT": 65,
      "Engineering": 78,
      "Operations": 45,
      "Finance": 32
    }
  }

  const recentRequests = [
    { id: "REQ015", trainee: "Arjun Sharma", institution: "IIT Delhi", status: "PENDING", priority: "HIGH", department: "IT" },
    { id: "REQ016", trainee: "Priya Patel", institution: "NIT Surathkal", status: "ROUTED", priority: "MEDIUM", department: "Engineering" },
    { id: "REQ017", trainee: "Vikram Singh", institution: "BITS Pilani", status: "PENDING", priority: "LOW", department: "Operations" },
    { id: "REQ018", trainee: "Sneha Reddy", institution: "Anna University", status: "PROCESSING", priority: "HIGH", department: "IT" }
  ]

  const departmentWorkload = [
    { name: "Information Technology", requests: 23, mentors: 8, capacity: 85 },
    { name: "Engineering", requests: 19, mentors: 6, capacity: 78 },
    { name: "Operations", requests: 15, mentors: 5, capacity: 60 },
    { name: "Finance", requests: 8, mentors: 3, capacity: 45 }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>
      case "PROCESSING":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case "ROUTED":
        return <Badge className="bg-blue-100 text-blue-800">Routed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "LOW":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Coordination Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{coordinationStats.totalRequests}</p>
                <p className="text-xs text-blue-600 mt-1">Across all departments</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Queue</p>
                <p className="text-2xl font-bold text-gray-900">{coordinationStats.processingQueue}</p>
                <p className="text-xs text-orange-600 mt-1">Needs attention</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Routed Today</p>
                <p className="text-2xl font-bold text-gray-900">{coordinationStats.routedToday}</p>
                <p className="text-xs text-green-600 mt-1">Successfully processed</p>
              </div>
              <Route className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold text-gray-900">{coordinationStats.avgProcessingTime}</p>
                <p className="text-xs text-green-600 mt-1">Below target</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Processing Queue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Processing Queue</CardTitle>
                <CardDescription>Requests requiring immediate attention</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Process Batch
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{request.id}</span>
                      <span className="text-gray-600">{request.trainee}</span>
                      <Badge variant="outline" className="text-xs">{request.department}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{request.institution}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(request.priority)}
                    {getStatusBadge(request.status)}
                    <Button size="sm" variant="outline">
                      <Route className="h-3 w-3 mr-1" />
                      Process
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Workload */}
        <Card>
          <CardHeader>
            <CardTitle>Department Workload</CardTitle>
            <CardDescription>Current capacity utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentWorkload.map((dept, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{dept.name.split(' ')[0]}</span>
                    <span className="text-sm text-gray-600">{dept.capacity}%</span>
                  </div>
                  <Progress value={dept.capacity} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{dept.requests} requests</span>
                    <span>{dept.mentors} mentors</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coordination Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Coordination Tools</CardTitle>
          <CardDescription>Quick access to coordination functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Route className="h-6 w-6 mb-2" />
              Route Request
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Building className="h-6 w-6 mb-2" />
              Dept. Overview
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Mentor Status
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Priority Alerts */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="font-medium text-red-800">
                  5 high-priority requests in queue
                </p>
                <p className="text-sm text-red-600">
                  These requests have been pending for more than 24 hours
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              Process Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}