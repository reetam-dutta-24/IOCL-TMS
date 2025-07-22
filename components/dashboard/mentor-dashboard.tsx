"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Target, 
  Award,
  CheckCircle,
  Clock,
  FileText,
  Star,
  Calendar,
  MessageSquare,
  BookOpen,
  TrendingUp,
  User,
  Eye,
  Edit
} from "lucide-react"

export function MentorDashboard() {
  const mentorStats = {
    currentTrainees: 3,
    maxCapacity: 4,
    totalMentored: 15,
    avgRating: 4.8,
    completionRate: 93.3,
    activeProjects: 3
  }

  const currentTrainees = [
    {
      id: "T001",
      name: "Arjun Reddy",
      program: "Summer Internship 2024",
      institution: "IIT Delhi",
      progress: 75,
      startDate: "2024-01-15",
      nextMeeting: "Tomorrow, 2:00 PM",
      status: "ON_TRACK",
      project: "API Development"
    },
    {
      id: "T002", 
      name: "Ananya Iyer",
      program: "Industrial Training",
      institution: "Anna University",
      progress: 90,
      startDate: "2024-01-08",
      nextMeeting: "Today, 4:00 PM",
      status: "EXCELLENT",
      project: "Database Optimization"
    },
    {
      id: "T003",
      name: "Rohit Mehta",
      program: "Technical Training",
      institution: "DTU Delhi",
      progress: 45,
      startDate: "2024-01-20",
      nextMeeting: "Friday, 10:00 AM",
      status: "NEEDS_ATTENTION",
      project: "System Integration"
    }
  ]

  const recentActivities = [
    { type: "MEETING", description: "Progress review with Ananya Iyer", time: "2 hours ago" },
    { type: "SUBMISSION", description: "Weekly report submitted for all trainees", time: "1 day ago" },
    { type: "FEEDBACK", description: "Provided feedback on Arjun's API project", time: "2 days ago" },
    { type: "ASSIGNMENT", description: "New trainee Rohit Mehta assigned", time: "3 days ago" }
  ]

  const upcomingTasks = [
    { task: "Review Ananya's project proposal", due: "Today", priority: "HIGH" },
    { task: "Submit monthly progress report", due: "Tomorrow", priority: "MEDIUM" },
    { task: "Conduct mid-term evaluation for Arjun", due: "This Week", priority: "HIGH" },
    { task: "Prepare training materials for new batch", due: "Next Week", priority: "LOW" }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "EXCELLENT":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "ON_TRACK":
        return <Badge className="bg-blue-100 text-blue-800">On Track</Badge>
      case "NEEDS_ATTENTION":
        return <Badge className="bg-orange-100 text-orange-800">Needs Attention</Badge>
      case "AT_RISK":
        return <Badge className="bg-red-100 text-red-800">At Risk</Badge>
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "MEETING":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "SUBMISSION":
        return <FileText className="h-4 w-4 text-green-600" />
      case "FEEDBACK":
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      case "ASSIGNMENT":
        return <User className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Mentor Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Trainees</p>
                <p className="text-2xl font-bold text-gray-900">{mentorStats.currentTrainees}/{mentorStats.maxCapacity}</p>
                <p className="text-xs text-blue-600 mt-1">Active assignments</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mentored</p>
                <p className="text-2xl font-bold text-gray-900">{mentorStats.totalMentored}</p>
                <p className="text-xs text-green-600 mt-1">Lifetime achievement</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{mentorStats.avgRating}</p>
                <p className="text-xs text-yellow-600 mt-1">Out of 5.0</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{mentorStats.completionRate}%</p>
                <p className="text-xs text-purple-600 mt-1">Success rate</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Trainees */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Trainees</CardTitle>
            <CardDescription>Track progress and manage your assigned trainees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentTrainees.map((trainee, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {trainee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{trainee.name}</h4>
                        <p className="text-sm text-gray-600">{trainee.institution}</p>
                        <p className="text-xs text-gray-500">{trainee.program}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(trainee.status)}
                      <p className="text-xs text-gray-500 mt-1">Started: {new Date(trainee.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Project: {trainee.project}</span>
                      <span>{trainee.progress}% Complete</span>
                    </div>
                    <Progress value={trainee.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Next: {trainee.nextMeeting}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Your pending tasks and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-gray-500">Due: {task.due}</p>
                  </div>
                  <div className="ml-2">
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest mentoring activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Your mentoring performance metrics and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{mentorStats.currentTrainees}</p>
              <p className="text-sm text-gray-600">Active Trainees</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{mentorStats.completionRate}%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{mentorStats.avgRating}</p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{mentorStats.totalMentored}</p>
              <p className="text-sm text-gray-600">Total Mentored</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Training Resources
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}