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
  Award,
  TrendingUp,
  AlertCircle,
  Calendar,
  ArrowRight,
  Eye,
  UserCheck,
  Building,
  BookOpen
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import Link from "next/link"

interface HodDashboardProps {
  user: any
  roleType: "LD_HOD" | "DEPT_HOD"
}

export function HodDashboard({ user, roleType }: HodDashboardProps) {
  const [stats, setStats] = useState({
    totalRequests: 45,
    pendingApproval: 8,
    approvedRequests: 32,
    rejectedRequests: 5,
    activeMentors: 18,
    completedPrograms: 24
  })

  const isLDHod = roleType === "LD_HOD"

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getQuickActions = () => {
    const baseActions = [
      {
        title: "Review Requests",
        description: `${isLDHod ? "All pending" : "Department"} requests requiring approval`,
        href: "/requests",
        icon: FileText,
        color: "bg-blue-500",
        count: stats.pendingApproval
      },
      {
        title: "Manage Mentors",
        description: `${isLDHod ? "All mentors" : "Department mentors"} management`,
        href: isLDHod ? "/mentors" : "/mentors/assign",
        icon: isLDHod ? Users : UserCheck,
        color: "bg-green-500",
        count: stats.activeMentors
      }
    ]

    if (isLDHod) {
      baseActions.push(
        {
          title: "Closure Approvals",
          description: "Final program closure approvals",
          href: "/closures",
          icon: Award,
          color: "bg-purple-500"
        },
        {
          title: "Policy Management",
          description: "Training policies and guidelines",
          href: "/policies",
          icon: BookOpen,
          color: "bg-indigo-500"
        },
        {
          title: "System Reports",
          description: "Comprehensive system analytics",
          href: "/reports",
          icon: TrendingUp,
          color: "bg-orange-500"
        }
      )
    } else {
      baseActions.push(
        {
          title: "Department Reports",
          description: "Department-specific analytics",
          href: "/reports",
          icon: TrendingUp,
          color: "bg-orange-500"
        }
      )
    }

    return baseActions
  }

  const recentRequests = [
    {
      id: 1,
      title: "AI/ML Internship Program",
      submittedBy: "Priya Sharma",
      submittedDate: "2024-01-15",
      status: "PENDING_APPROVAL",
      department: "IT",
      priority: "HIGH"
    },
    {
      id: 2,
      title: "Process Optimization Training",
      submittedBy: "Rajesh Kumar",
      submittedDate: "2024-01-12",
      status: "APPROVED",
      department: "Operations",
      priority: "MEDIUM"
    },
    {
      id: 3,
      title: "Safety Management Course",
      submittedBy: "Amit Singh",
      submittedDate: "2024-01-10",
      status: "UNDER_REVIEW",
      department: "Engineering",
      priority: "HIGH"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Approval</Badge>
      case "UNDER_REVIEW":
        return <Badge className="bg-blue-100 text-blue-800"><Eye className="h-3 w-3 mr-1" />Under Review</Badge>
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
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

  const departmentData = [
    { department: "IT", requests: 12, approved: 10, pending: 2 },
    { department: "Operations", requests: 15, approved: 12, pending: 3 },
    { department: "Engineering", requests: 10, approved: 8, pending: 2 },
    { department: "Finance", requests: 8, approved: 7, pending: 1 }
  ]

  const statusData = [
    { name: "Approved", value: stats.approvedRequests, color: "#16a34a" },
    { name: "Pending", value: stats.pendingApproval, color: "#eab308" },
    { name: "Rejected", value: stats.rejectedRequests, color: "#dc2626" }
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
              {isLDHod 
                ? "L&D Head Dashboard - Strategic oversight and policy management"
                : "Department Head Dashboard - Departmental coordination and mentor assignment"
              }
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge className={`px-3 py-1 ${isLDHod ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
              <Building className="h-4 w-4 mr-2" />
              {isLDHod ? "L&D HoD" : "Department HoD"}
            </Badge>
          </div>
        </div>

        {/* Priority Alerts */}
        {stats.pendingApproval > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-yellow-800">
                    {stats.pendingApproval} requests require your approval
                  </p>
                  <p className="text-sm text-yellow-600">
                    Please review and approve pending requests to avoid delays in training programs.
                  </p>
                </div>
                <Link href="/requests" className="ml-auto">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Review Now
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
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApproval}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Mentors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeMentors}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedPrograms}</p>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
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
                <CardDescription>{isLDHod ? "Strategic" : "Departmental"} management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {getQuickActions().map((action, index) => (
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

          {/* Recent Requests Requiring Attention */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Requests Requiring Attention</CardTitle>
                <CardDescription>Recent submissions needing your approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{request.title}</p>
                          {getPriorityBadge(request.priority)}
                        </div>
                        <p className="text-sm text-gray-500">Submitted by: {request.submittedBy}</p>
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

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{isLDHod ? "Department-wise" : "Monthly"} Requests</CardTitle>
              <CardDescription>
                {isLDHod ? "Request distribution across departments" : "Request trends over time"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="approved" fill="#16a34a" name="Approved" />
                  <Bar dataKey="pending" fill="#eab308" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Status Distribution</CardTitle>
              <CardDescription>Overall status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Key Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>Key Responsibilities</CardTitle>
            <CardDescription>
              {isLDHod ? "Strategic leadership and policy oversight" : "Departmental coordination tasks"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLDHod ? (
                <>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Policy Oversight</h4>
                    <p className="text-sm text-purple-700">
                      Define and maintain training policies, standards, and best practices across the organization.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Strategic Planning</h4>
                    <p className="text-sm text-blue-700">
                      Plan and oversee long-term learning and development strategies aligned with organizational goals.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Final Approvals</h4>
                    <p className="text-sm text-green-700">
                      Provide final approval for training programs and closure of completed internships.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Mentor Assignment</h4>
                    <p className="text-sm text-green-700">
                      Assign suitable mentors to trainees based on expertise and availability within your department.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Department Coordination</h4>
                    <p className="text-sm text-blue-700">
                      Coordinate training activities and ensure smooth execution within your department.
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Progress Monitoring</h4>
                    <p className="text-sm text-orange-700">
                      Monitor progress of departmental training programs and provide feedback to L&D team.
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}