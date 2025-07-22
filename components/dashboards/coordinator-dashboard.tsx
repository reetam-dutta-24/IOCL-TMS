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
  ArrowRight,
  Route,
  MessageSquare,
  BarChart3,
  RefreshCw
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"

export function CoordinatorDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState({
    totalRequests: 45,      // View all internship requests
    pendingProcessing: 8,   // Initial processing queue
    inProgress: 12,         // Monitoring progress
    completedThisMonth: 15, // Documentation tracking
    departmentRouting: 6    // Routing between departments
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const quickActions = [
    {
      title: "Process New Requests",
      description: "Initial processing of internship requests",
      href: "/requests/pending",
      icon: FileText,
      color: "bg-red-500",
      count: stats.pendingProcessing
    },
    {
      title: "All Requests",
      description: "View all internship requests in system",
      href: "/requests",
      icon: Eye,
      color: "bg-blue-500",
      count: stats.totalRequests
    },
    {
      title: "Route to Departments",
      description: "Coordinate between different departments", 
      href: "/requests/routing",
      icon: Route,
      color: "bg-green-500",
      count: stats.departmentRouting
    },
    {
      title: "Monitor Progress",
      description: "Request status monitoring and follow-up",
      href: "/requests/monitoring",
      icon: TrendingUp,
      color: "bg-purple-500"
    },
    {
      title: "Communication Hub",
      description: "Facilitate communication between parties",
      href: "/communication",
      icon: MessageSquare,
      color: "bg-orange-500"
    },
    {
      title: "Generate Reports",
      description: "Documentation and analytics reports",
      href: "/reports",
      icon: BarChart3,
      color: "bg-indigo-500"
    }
  ]

  const pendingRequests = [
    {
      id: 1,
      title: "Summer Internship Program 2024",
      submittedDate: "2024-01-15",
      status: "PENDING_PROCESSING",
      department: "Engineering",
      priority: "HIGH",
      submittedBy: "HR Department"
    },
    {
      id: 2,
      title: "Data Analytics Training Module",
      submittedDate: "2024-01-12",
      status: "ROUTING_TO_DEPT",
      department: "IT",
      priority: "MEDIUM",
      submittedBy: "Technical Team"
    },
    {
      id: 3,
      title: "Process Optimization Workshop",
      submittedDate: "2024-01-10",
      status: "MONITORING_PROGRESS",
      department: "Operations",
      priority: "MEDIUM",
      submittedBy: "Operations Team"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PROCESSING":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Pending Processing</Badge>
      case "ROUTING_TO_DEPT":
        return <Badge className="bg-yellow-100 text-yellow-800"><Route className="h-3 w-3 mr-1" />Routing to Dept</Badge>
      case "MONITORING_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800"><Eye className="h-3 w-3 mr-1" />Monitoring</Badge>
      case "AWAITING_HOD_APPROVAL":
        return <Badge className="bg-purple-100 text-purple-800"><Clock className="h-3 w-3 mr-1" />With HoD</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "LOW":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const monthlyProcessingData = [
    { month: "Jan", processed: 14, routed: 12 },
    { month: "Feb", processed: 18, routed: 16 },
    { month: "Mar", processed: 12, routed: 11 },
    { month: "Apr", processed: 22, routed: 20 },
    { month: "May", processed: 16, routed: 15 },
    { month: "Jun", processed: 19, routed: 18 }
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
              L&D Coordinator Dashboard - Initial processing, routing, and coordination hub
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <FileText className="h-4 w-4 mr-2" />
              L&D Coordinator
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Priority Alert */}
        {stats.pendingProcessing > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-800">
                    {stats.pendingProcessing} requests pending initial processing
                  </p>
                  <p className="text-sm text-red-600">
                    These requests require immediate attention for routing to appropriate departments.
                  </p>
                </div>
                <Link href="/requests/pending" className="ml-auto">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Process Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards - Aligned with L&D Coordinator Responsibilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">All Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                  <p className="text-xs text-blue-600 mt-1">System-wide view</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Processing</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingProcessing}</p>
                  <p className="text-xs text-red-600 mt-1">Needs initial review</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  <p className="text-xs text-purple-600 mt-1">Monitoring phase</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dept Routing</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.departmentRouting}</p>
                  <p className="text-xs text-green-600 mt-1">Cross-department</p>
                </div>
                <Route className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedThisMonth}</p>
                  <p className="text-xs text-green-600 mt-1">This month</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - L&D Coordinator Specific */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Coordination Tasks</CardTitle>
                <CardDescription>Core L&D coordination responsibilities</CardDescription>
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

          {/* Pending Requests for Processing */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Requests Queue</CardTitle>
                <CardDescription>Internship requests at various processing stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{request.title}</p>
                          {getPriorityBadge(request.priority)}
                        </div>
                        <p className="text-sm text-gray-500">Department: {request.department}</p>
                        <p className="text-sm text-gray-500">Submitted by: {request.submittedBy}</p>
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

        {/* Processing Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Processing & Routing Analytics</CardTitle>
            <CardDescription>Monthly coordination and routing performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProcessingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="processed" stroke="#dc2626" strokeWidth={2} name="Processed" />
                <Line type="monotone" dataKey="routed" stroke="#16a34a" strokeWidth={2} name="Routed" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Coordination Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>L&D Coordination Guidelines</CardTitle>
            <CardDescription>Best practices for effective coordination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Initial Processing</h4>
                <p className="text-sm text-blue-700">
                  Review completeness, validate requirements, and ensure all documentation is proper before routing.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Department Coordination</h4>
                <p className="text-sm text-green-700">
                  Maintain active communication with all departments to ensure smooth workflow and timely responses.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Progress Monitoring</h4>
                <p className="text-sm text-purple-700">
                  Regular follow-ups and status updates throughout the internship lifecycle for stakeholder visibility.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Communication Hub</h4>
                <p className="text-sm text-orange-700">
                  Facilitate clear communication between all parties - mentors, HoDs, trainees, and departments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}