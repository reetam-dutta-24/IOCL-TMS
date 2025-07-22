"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Star,
  FileText,
  MessageSquare,
  ArrowRight,
  Eye
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import Link from "next/link"

export function MentorDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState({
    activeMentees: 5,
    completedMentorships: 12,
    averageRating: 4.7,
    totalHours: 156,
    pendingReports: 2,
    upcomingSessions: 3
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const quickActions = [
    {
      title: "My Mentees",
      description: "View and manage current mentees",
      href: "/mentees",
      icon: Users,
      color: "bg-blue-500",
      count: stats.activeMentees
    },
    {
      title: "Progress Reports",
      description: "Submit mentee progress reports",
      href: "/reports",
      icon: FileText,
      color: "bg-green-500",
      count: stats.pendingReports
    },
    {
      title: "Learning Resources",
      description: "Access training materials",
      href: "/resources",
      icon: BookOpen,
      color: "bg-purple-500"
    },
    {
      title: "Schedule Sessions",
      description: "Plan mentoring sessions",
      href: "/sessions",
      icon: Calendar,
      color: "bg-orange-500"
    }
  ]

  const activeMentees = [
    {
      id: 1,
      name: "Aarav Sharma",
      program: "Software Development Internship",
      startDate: "2024-01-15",
      progress: 75,
      status: "ON_TRACK",
      lastSession: "2024-01-20"
    },
    {
      id: 2,
      name: "Priya Patel",
      program: "Data Analytics Training",
      startDate: "2024-01-10",
      progress: 60,
      status: "NEEDS_ATTENTION",
      lastSession: "2024-01-18"
    },
    {
      id: 3,
      name: "Rohit Kumar",
      program: "Process Engineering",
      startDate: "2024-01-08",
      progress: 90,
      status: "EXCELLENT",
      lastSession: "2024-01-19"
    }
  ]

  const upcomingSessions = [
    {
      id: 1,
      mentee: "Aarav Sharma",
      date: "2024-01-25",
      time: "10:00 AM",
      topic: "API Development Best Practices"
    },
    {
      id: 2,
      mentee: "Priya Patel",
      date: "2024-01-25",
      time: "2:00 PM",
      topic: "Data Visualization Techniques"
    },
    {
      id: 3,
      mentee: "Rohit Kumar",
      date: "2024-01-26",
      time: "11:00 AM",
      topic: "Project Presentation Review"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ON_TRACK":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />On Track</Badge>
      case "NEEDS_ATTENTION":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Needs Attention</Badge>
      case "EXCELLENT":
        return <Badge className="bg-blue-100 text-blue-800"><Star className="h-3 w-3 mr-1" />Excellent</Badge>
      case "AT_RISK":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />At Risk</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const progressData = [
    { month: "Jan", hours: 24 },
    { month: "Feb", hours: 32 },
    { month: "Mar", hours: 28 },
    { month: "Apr", hours: 36 },
    { month: "May", hours: 30 },
    { month: "Jun", hours: 42 }
  ]

  const menteeCompletionData = [
    { name: "Completed", value: stats.completedMentorships, color: "#16a34a" },
    { name: "Active", value: stats.activeMentees, color: "#3b82f6" },
    { name: "On Hold", value: 2, color: "#eab308" }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Mentor Dashboard - Guide and support your mentees on their learning journey
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              Mentor
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{stats.averageRating}/5.0</span>
            </div>
          </div>
        </div>

        {/* Pending Actions Alert */}
        {stats.pendingReports > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium text-orange-800">
                    {stats.pendingReports} progress reports pending submission
                  </p>
                  <p className="text-sm text-orange-600">
                    Please submit pending progress reports to keep mentee records up to date.
                  </p>
                </div>
                <Link href="/reports" className="ml-auto">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Submit Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Mentees</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeMentees}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedMentorships}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</p>
                </div>
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common mentoring tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                      {action.count && (
                        <Badge variant="secondary">{action.count}</Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Active Mentees */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Mentees</CardTitle>
                <CardDescription>Current mentees and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeMentees.map((mentee) => (
                    <div key={mentee.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{mentee.name}</p>
                          {getStatusBadge(mentee.status)}
                        </div>
                        <p className="text-sm text-gray-500">{mentee.program}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{mentee.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${mentee.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-xs text-gray-400">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Started: {new Date(mentee.startDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-400">
                            Last session: {new Date(mentee.lastSession).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/mentees">
                    <Button variant="outline">
                      View All Mentees
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Scheduled mentoring sessions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    <Badge variant="outline">{session.time}</Badge>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{session.mentee}</h4>
                  <p className="text-sm text-gray-600 mb-2">{session.topic}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Join
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Mentoring Hours</CardTitle>
              <CardDescription>Your mentoring activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#dc2626" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Distribution</CardTitle>
              <CardDescription>Current and completed mentorships</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={menteeCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Mentoring Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Mentoring Best Practices</CardTitle>
            <CardDescription>Tips for effective mentoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Regular Check-ins</h4>
                <p className="text-sm text-blue-700">
                  Schedule consistent one-on-one sessions to track progress and provide continuous support.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Goal Setting</h4>
                <p className="text-sm text-green-700">
                  Help mentees set clear, achievable goals and create actionable plans to reach them.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Knowledge Sharing</h4>
                <p className="text-sm text-purple-700">
                  Share your experience and industry insights to accelerate their learning curve.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Feedback Culture</h4>
                <p className="text-sm text-orange-700">
                  Provide constructive feedback regularly and encourage open communication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}