"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  UserCheck, 
  Target, 
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
  Building,
  Activity,
  BarChart3,
  UserPlus,
  Eye
} from "lucide-react"

interface HodDashboardProps {
  userRole?: string
  userDepartment?: string
}

export function HodDashboard({ userRole = "Department HoD", userDepartment = "Information Technology" }: HodDashboardProps) {
  const isLDHod = userRole === "L&D HoD"
  
  const departmentStats = {
    totalMentors: isLDHod ? 28 : 8,
    activeMentors: isLDHod ? 24 : 6,
    pendingAssignments: isLDHod ? 15 : 4,
    avgCapacity: isLDHod ? 72 : 85,
    completionRate: isLDHod ? 94.2 : 96.5,
    departmentRequests: isLDHod ? 156 : 23
  }

  const mentorPerformance = [
    { name: "Vikram Gupta", capacity: 85, rating: 4.8, trainees: 3, maxCapacity: 4 },
    { name: "Suresh Reddy", capacity: 60, rating: 4.5, trainees: 2, maxCapacity: 3 },
    { name: "Kavita Nair", capacity: 100, rating: 4.9, trainees: 3, maxCapacity: 3 },
    { name: "Rajesh Patel", capacity: 40, rating: 4.6, trainees: 1, maxCapacity: 2 }
  ]

  const pendingAssignments = [
    { id: "REQ015", trainee: "Arjun Sharma", program: "Summer Internship", priority: "HIGH", submittedDate: "2024-01-15" },
    { id: "REQ016", trainee: "Priya Patel", program: "Technical Training", priority: "MEDIUM", submittedDate: "2024-01-14" },
    { id: "REQ017", trainee: "Vikram Singh", program: "Research Project", priority: "HIGH", submittedDate: "2024-01-13" },
    { id: "REQ018", trainee: "Sneha Reddy", program: "Industrial Training", priority: "MEDIUM", submittedDate: "2024-01-12" }
  ]

  const recentActivities = [
    { action: "Mentor Assigned", details: "Vikram Gupta assigned to REQ014", time: "30 mins ago" },
    { action: "Capacity Updated", details: "Suresh Reddy availability updated", time: "1 hour ago" },
    { action: "Assignment Complete", details: "REQ012 marked as completed", time: "2 hours ago" },
    { action: "New Request", details: "REQ015 received for processing", time: "3 hours ago" }
  ]

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
      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isLDHod ? "Total Mentors" : "Department Mentors"}
                </p>
                <p className="text-2xl font-bold text-gray-900">{departmentStats.totalMentors}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {isLDHod ? "Across all departments" : `In ${userDepartment}`}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Mentors</p>
                <p className="text-2xl font-bold text-gray-900">{departmentStats.activeMentors}</p>
                <p className="text-xs text-green-600 mt-1">
                  {((departmentStats.activeMentors/departmentStats.totalMentors)*100).toFixed(0)}% active
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{departmentStats.pendingAssignments}</p>
                <p className="text-xs text-orange-600 mt-1">Awaiting assignment</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{departmentStats.avgCapacity}%</p>
                <p className="text-xs text-purple-600 mt-1">Utilization rate</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentor Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {isLDHod ? "Top Performing Mentors" : "Department Mentor Performance"}
                </CardTitle>
                <CardDescription>Current mentor capacity and ratings</CardDescription>
              </div>
              {!isLDHod && (
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Mentor
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mentorPerformance.map((mentor, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{mentor.name}</span>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{mentor.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Capacity</span>
                          <span>{mentor.trainees}/{mentor.maxCapacity}</span>
                        </div>
                        <Progress value={mentor.capacity} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {!isLDHod && (
                      <Button size="sm">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest department activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignments */}
      {!isLDHod && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Mentor Assignments</CardTitle>
            <CardDescription>Requests awaiting mentor assignment in your department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAssignments.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{request.id}</span>
                      <span className="text-gray-600">{request.trainee}</span>
                      <Badge variant="outline" className="text-xs">{request.program}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">Submitted: {new Date(request.submittedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(request.priority)}
                    <Button size="sm">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Assign
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isLDHod ? "Strategic Overview" : "Department Performance Summary"}
          </CardTitle>
          <CardDescription>
            {isLDHod ? "Key metrics for strategic decision making" : "Performance metrics for your department"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{departmentStats.completionRate}%</p>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{departmentStats.departmentRequests}</p>
              <p className="text-sm text-gray-600">Total Requests</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{departmentStats.avgCapacity}%</p>
              <p className="text-sm text-gray-600">Avg Utilization</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">2.3h</p>
              <p className="text-sm text-gray-600">Avg Assignment Time</p>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Report
            </Button>
            {isLDHod && (
              <Button variant="outline">
                <Building className="h-4 w-4 mr-2" />
                All Departments
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}