"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Eye,
  TrendingUp,
  AlertCircle,
  Calendar,
  ArrowRight
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"

export function CoordinatorDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState({
    myRequests: 12,
    pendingReview: 3,
    approvedRequests: 8,
    rejectedRequests: 1,
    availableMentors: 15
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const quickActions = [
    {
      title: "Create New Request",
      description: "Submit new internship request",
      href: "/requests/create",
      icon: Plus,
      color: "bg-red-500"
    },
    {
      title: "My Requests",
      description: "View all my submitted requests",
      href: "/requests",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      title: "Browse Mentors",
      description: "View available mentors",
      href: "/mentors",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Generate Reports",
      description: "Create coordination reports",
      href: "/reports",
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ]

  const recentRequests = [
    {
      id: 1,
      title: "Summer Internship Program 2024",
      submittedDate: "2024-01-15",
      status: "UNDER_REVIEW",
      department: "IT"
    },
    {
      id: 2,
      title: "Winter Training Module",
      submittedDate: "2024-01-10",
      status: "APPROVED",
      department: "Operations"
    },
    {
      id: 3,
      title: "Project Management Training",
      submittedDate: "2024-01-08",
      status: "PENDING_MENTOR",
      department: "Engineering"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "UNDER_REVIEW":
        return <Badge className="bg-blue-100 text-blue-800"><Eye className="h-3 w-3 mr-1" />Under Review</Badge>
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "PENDING_MENTOR":
        return <Badge className="bg-orange-100 text-orange-800"><Users className="h-3 w-3 mr-1" />Pending Mentor</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const monthlyData = [
    { month: "Jan", requests: 4 },
    { month: "Feb", requests: 6 },
    { month: "Mar", requests: 3 },
    { month: "Apr", requests: 8 },
    { month: "May", requests: 5 },
    { month: "Jun", requests: 7 }
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
              L&D Coordinator Dashboard - Manage training requests and coordinate with mentors
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <FileText className="h-4 w-4 mr-2" />
              L&D Coordinator
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.myRequests}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReview}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approvedRequests}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejectedRequests}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Mentors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableMentors}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
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
                <CardDescription>Common tasks and operations</CardDescription>
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
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Your latest internship request submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{request.title}</p>
                        <p className="text-sm text-gray-500">Department: {request.department}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-xs text-gray-400">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(request.submittedDate).toLocaleDateString()}
                          </span>
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/requests">
                    <Button variant="outline">
                      View All Requests
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Request Submission Trends</CardTitle>
            <CardDescription>Your monthly request submission activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tips and Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Tips & Guidelines</CardTitle>
            <CardDescription>Best practices for L&D coordination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Request Preparation</h4>
                <p className="text-sm text-blue-700">
                  Ensure all required documents and approvals are ready before submitting requests to avoid delays.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Mentor Coordination</h4>
                <p className="text-sm text-green-700">
                  Maintain regular communication with assigned mentors for smooth program execution.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Progress Tracking</h4>
                <p className="text-sm text-purple-700">
                  Monitor trainee progress regularly and provide timely updates to stakeholders.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Documentation</h4>
                <p className="text-sm text-orange-700">
                  Keep detailed records of all training activities for future reference and reporting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}