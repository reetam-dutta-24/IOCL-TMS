"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Send,
  Eye,
  RefreshCw,
  Filter,
  MessageSquare,
  Calendar,
  Building,
  Route,
  BarChart3,
  Download,
  ArrowRight,
  Activity
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import Link from "next/link"
import { toast } from "sonner"


interface CoordinatorStats {
  // Access Request Stats
  totalRequests: number
  pendingRequests: number
  activeRequests: number
  completedRequests: number
  departmentRequests: number
  monthlyProcessed: number
  avgProcessingTime: string
  urgentRequests: number
  
  // Internship Application Stats
  totalInternshipApplications: number
  pendingInternshipApplications: number
  approvedInternshipApplications: number
  rejectedInternshipApplications: number
  
  // Combined Stats
  totalApplications: number
  totalPending: number
}

interface RequestMetrics {
  statusDistribution: { name: string; value: number; color: string }[]
  monthlyTrends: { month: string; submitted: number; processed: number; routed: number }[]
  departmentBreakdown: { department: string; pending: number; active: number; completed: number }[]
}

interface RecentRequest {
  id: number
  employeeId: string
  applicantName: string
  department: string
  requestType: string
  status: string
  submittedDate: string
  urgency: string
  nextAction: string
}

export function CoordinatorDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<CoordinatorStats | null>(null)
  const [metrics, setMetrics] = useState<RequestMetrics | null>(null)
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [internshipApplications, setInternshipApplications] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  


  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?userId=${user.id}&role=${user.role}`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user.id, user.role])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      setError(null)
      console.log("🔍 Fetching L&D Coordinator dashboard data...")
      
      const response = await fetch("/api/coordinator-dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      console.log("📊 Received dashboard data:", data)
      
      setStats(data.stats || {})
      setMetrics(data.metrics || {})
      setRecentRequests(data.recentRequests || [])
      setInternshipApplications(data.internshipApplications || [])

    } catch (error) {
      console.error("💥 Failed to fetch coordinator dashboard data:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard data")
      
      // Fallback to minimal data structure to prevent crashes
      setStats({
        totalRequests: 0,
        pendingRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        departmentRequests: 0,
        monthlyProcessed: 0,
        avgProcessingTime: "N/A",
        urgentRequests: 0,
        totalInternshipApplications: 0,
        pendingInternshipApplications: 0,
        approvedInternshipApplications: 0,
        rejectedInternshipApplications: 0,
        totalApplications: 0,
        totalPending: 0
      })
      setMetrics({
        statusDistribution: [],
        monthlyTrends: [],
        departmentBreakdown: []
      })
      setRecentRequests([])
      setInternshipApplications([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }


  const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { color: string; icon: any }> = {
    "Pending Review": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    "Under Processing": { color: "bg-blue-100 text-blue-800", icon: Activity },
    "Awaiting HoD Approval": { color: "bg-purple-100 text-purple-800", icon: Users },
    "Active User": { color: "bg-green-100 text-green-800", icon: CheckCircle },
    "Approved": { color: "bg-green-100 text-green-800", icon: CheckCircle },
    "Rejected": { color: "bg-red-100 text-red-800", icon: AlertTriangle },
    "Completed": { color: "bg-green-100 text-green-800", icon: CheckCircle }
  }
  
  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", icon: FileText }
  const Icon = config.icon
  
  return (
    <Badge className={config.color}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </Badge>
  )
}

  const getUrgencyBadge = (urgency: string) => {
  const urgencyConfig: Record<string, string> = {
    "Urgent": "bg-red-100 text-red-800",
    "High": "bg-orange-100 text-orange-800", 
    "Normal": "bg-green-100 text-green-800"
  }
  
  return <Badge className={urgencyConfig[urgency] || "bg-gray-100 text-gray-800"}>{urgency}</Badge>
}

  const quickActions = [
    {
      title: "Review New Requests",
      description: "Process pending access requests",
      href: "/requests?filter=pending",
      icon: FileText,
      color: "bg-blue-500",
      count: stats?.pendingRequests || 0
    },
    {
      title: "Active Monitoring",
      description: "Track approved user activities",
      href: "/requests?filter=active",
      icon: Activity,
      color: "bg-green-500",
      count: stats?.activeRequests || 0
    },
    {
      title: "Department Coordination",
      description: "Communicate with department HoDs",
      href: "/coordination",
      icon: Building,
      color: "bg-purple-500",
      count: stats?.departmentRequests || 0
    },
    {
      title: "Generate Reports",
      description: "Create status and progress reports",
      href: "/reports",
      icon: BarChart3,
      color: "bg-orange-500"
    },
    {
      title: "Route Requests",
      description: "Forward requests to appropriate HoDs",
      href: "/routing",
      icon: Route,
      color: "bg-indigo-500"
    },
    {
      title: "Communication Hub",
      description: "Messages and stakeholder updates",
      href: "/messages",
      icon: MessageSquare,
      color: "bg-teal-500"
    }
  ]

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading coordinator dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }









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
              L&D Coordinator Dashboard - Real-time access request processing and coordination
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              L&D Coordinator
            </Badge>
            <Button 
              onClick={fetchDashboardData} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Error:</strong> {error}
              <Button 
                onClick={fetchDashboardData} 
                variant="outline" 
                size="sm" 
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Role Information */}
        <Alert className="border-blue-200 bg-blue-50">
          <Users className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>📋 Your Role:</strong> You handle initial processing of access requests, coordinate between departments, monitor user activities, and maintain documentation. You have access to view all requests, update statuses, generate reports, and communicate with stakeholders.
          </AlertDescription>
        </Alert>

        {/* Urgent Items Alert */}
        {stats && stats.urgentRequests > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>{stats.urgentRequests} urgent requests</strong> require immediate attention.
              <Link href="/requests?filter=urgent" className="ml-2 underline font-medium">
                Review Now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Access + Internship</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">Live data</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalPending || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Awaiting your action</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/requests?filter=pending">
                  <Button size="sm" className="w-full" disabled={!stats?.totalPending}>
                    Review Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Internship Apps</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalInternshipApplications || 0}</p>
                  <p className="text-xs text-purple-600 mt-1">Student applications</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/internship-applications">
                  <Button size="sm" className="w-full" disabled={!stats?.totalInternshipApplications}>
                    View All
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeRequests || 0}</p>
                  <p className="text-xs text-green-600 mt-1">Currently active</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={stats && stats.totalRequests > 0 ? (stats.activeRequests / stats.totalRequests) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Notifications */}
        {notifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Recent Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Real-time updates for new applications and requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.status === "UNREAD" 
                        ? "bg-blue-50 border-blue-200" 
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">
                            {notification.title}
                          </h4>
                          {notification.priority === "HIGH" && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {notification.actionUrl && (
                        <Link href={notification.actionUrl}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {notifications.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    View All Notifications ({notifications.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common coordination tasks</CardDescription>
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
                      {action.count !== undefined && action.count > 0 && (
                        <Badge variant="secondary">{action.count}</Badge>
                      )}
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
                <CardDescription>Latest access requests and internship applications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                {(recentRequests.length > 0 || internshipApplications.length > 0) ? (
                  <div className="space-y-4">
                    {/* Show internship applications first (pending ones) */}
                    {internshipApplications.slice(0, 5).map((app) => (
                      <div key={`app-${app.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{app.firstName} {app.lastName}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">External</Badge>
                              {getStatusBadge(app.status === "PENDING" ? "Pending Review" : app.status === "APPROVED" ? "Approved" : "Rejected")}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Email:</span> {app.email}
                            </div>
                            <div>
                              <span className="font-medium">Institution:</span> {app.institutionName}
                            </div>
                            <div>
                              <span className="font-medium">Course:</span> {app.courseName}
                            </div>
                            <div>
                              <span className="font-medium">Department:</span> {app.preferredDepartment}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <ArrowRight className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-blue-600 font-medium">
                              {app.status === "PENDING" ? "Review Required" : 
                               app.status === "APPROVED" ? "Approved - Assign Mentor" : 
                               "Request Completed"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <Link href={`/internship-applications/${app.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href="/requests">
                            <Button size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show access requests */}
                    {recentRequests.slice(0, 5).map((request) => (
                      <div key={`req-${request.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{request.applicantName}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-gray-100 text-gray-800 text-xs">Internal</Badge>
                              {getUrgencyBadge(request.urgency)}
                              {getStatusBadge(request.status)}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">ID:</span> {request.employeeId}
                            </div>
                            <div>
                              <span className="font-medium">Department:</span> {request.department}
                            </div>
                            <div>
                              <span className="font-medium">Role:</span> {request.requestType}
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span> {new Date(request.submittedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <ArrowRight className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-blue-600 font-medium">{request.nextAction}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent requests found</p>
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Link href="/requests">
                    <Button variant="outline">
                      View All Requests
                      <Eye className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics and Charts */}
        {/* Removed 'Request Status Distribution' and 'Monthly Processing Trends' sections as per user request */}

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Removed 'Monthly Performance' section as per user request */}
          <Card>
            <CardHeader>
              <CardTitle>Key Responsibilities</CardTitle>
              <CardDescription>Your primary coordination duties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm text-gray-700">Initial processing of access requests</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Coordination between departments</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm text-gray-700">User activity monitoring and follow-up</span>
              </div>
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm text-gray-700">Documentation and record maintenance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Internship Applications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Internship Applications</CardTitle>
            <CardDescription>All trainee applications (pending first, then approved)</CardDescription>
          </CardHeader>
          <CardContent>
            {internshipApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {internshipApplications.map((app) => (
                      <TableRow key={app.id} className={app.status === "PENDING" ? "bg-yellow-50" : app.status === "APPROVED" ? "bg-green-50" : ""}>
                        <TableCell>{app.applicationNumber}</TableCell>
                        <TableCell>{app.firstName} {app.lastName}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.institutionName}</TableCell>
                        <TableCell>{app.courseName}</TableCell>
                        <TableCell>{app.preferredDepartment}</TableCell>
                        <TableCell>
                          <Badge className={app.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : app.status === "APPROVED" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Link href={`/internship-applications/${app.id}`}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No internship applications found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


    </DashboardLayout>
  )
}