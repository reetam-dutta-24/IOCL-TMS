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
  Mail,
  ArrowRight,
  Activity
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import Link from "next/link"

interface CoordinatorStats {
  totalRequests: number
  pendingRequests: number
  activeRequests: number
  completedRequests: number
  departmentRequests: number
  monthlyProcessed: number
  avgProcessingTime: string
  urgentRequests: number
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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      console.log("🔍 Fetching L&D Coordinator dashboard data...")
      
      // Mock data for L&D Coordinator specific metrics
      setStats({
        totalRequests: 142,
        pendingRequests: 18,
        activeRequests: 34,
        completedRequests: 90,
        departmentRequests: 25,
        monthlyProcessed: 47,
        avgProcessingTime: "2.3 days",
        urgentRequests: 6
      })

      setMetrics({
        statusDistribution: [
          { name: "Pending Review", value: 18, color: "#f59e0b" },
          { name: "Under Processing", value: 34, color: "#3b82f6" },
          { name: "Awaiting HoD", value: 12, color: "#8b5cf6" },
          { name: "Completed", value: 90, color: "#10b981" }
        ],
        monthlyTrends: [
          { month: "Jan", submitted: 28, processed: 25, routed: 22 },
          { month: "Feb", submitted: 35, processed: 31, routed: 28 },
          { month: "Mar", submitted: 42, processed: 38, routed: 35 },
          { month: "Apr", submitted: 38, processed: 40, routed: 37 },
          { month: "May", submitted: 45, processed: 43, routed: 41 },
          { month: "Jun", submitted: 47, processed: 45, routed: 42 }
        ],
        departmentBreakdown: [
          { department: "Engineering", pending: 5, active: 8, completed: 22 },
          { department: "Operations", pending: 4, active: 7, completed: 18 },
          { department: "IT", pending: 3, active: 6, completed: 15 },
          { department: "Finance", pending: 2, active: 4, completed: 12 },
          { department: "HR", pending: 4, active: 9, completed: 23 }
        ]
      })

      setRecentRequests([
        {
          id: 1,
          employeeId: "ENG001",
          applicantName: "Rahul Kumar",
          department: "Engineering",
          requestType: "Industrial Training",
          status: "Pending Review",
          submittedDate: "2024-01-15",
          urgency: "Normal",
          nextAction: "Initial Review Required"
        },
        {
          id: 2,
          employeeId: "OPS002",
          applicantName: "Priya Sharma",
          department: "Operations",
          requestType: "Project Internship",
          status: "Awaiting HoD Approval",
          submittedDate: "2024-01-14",
          urgency: "High",
          nextAction: "Route to Dept HoD"
        },
        {
          id: 3,
          employeeId: "IT003",
          applicantName: "Anil Singh",
          department: "IT",
          requestType: "Summer Internship",
          status: "Under Processing",
          submittedDate: "2024-01-13",
          urgency: "Normal",
          nextAction: "Documentation Review"
        },
        {
          id: 4,
          employeeId: "FIN004",
          applicantName: "Sneha Patel",
          department: "Finance",
          requestType: "Research Project",
          status: "Pending Review",
          submittedDate: "2024-01-12",
          urgency: "Urgent",
          nextAction: "Priority Review"
        }
      ])

    } catch (error) {
      console.error("💥 Failed to fetch coordinator dashboard data:", error)
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
    const statusConfig = {
      "Pending Review": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Under Processing": { color: "bg-blue-100 text-blue-800", icon: Activity },
      "Awaiting HoD Approval": { color: "bg-purple-100 text-purple-800", icon: Users },
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
    const urgencyConfig = {
      "Urgent": "bg-red-100 text-red-800",
      "High": "bg-orange-100 text-orange-800", 
      "Normal": "bg-green-100 text-green-800"
    }
    
    return <Badge className={urgencyConfig[urgency] || "bg-gray-100 text-gray-800"}>{urgency}</Badge>
  }

  const quickActions = [
    {
      title: "Review New Requests",
      description: "Process pending internship applications",
      href: "/requests?filter=pending",
      icon: FileText,
      color: "bg-blue-500",
      count: stats?.pendingRequests || 0
    },
    {
      title: "Active Monitoring",
      description: "Track ongoing internship progress",
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
              L&D Coordinator Dashboard - Internship request processing and coordination
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

        {/* Role Information */}
        <Alert className="border-blue-200 bg-blue-50">
          <Users className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>📋 Your Role:</strong> You handle initial processing of internship requests, coordinate between departments, monitor progress, and maintain documentation. You have access to view all requests, update statuses, generate reports, and communicate with stakeholders.
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
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalRequests || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">All time managed</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendingRequests || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Awaiting your action</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/requests?filter=pending">
                  <Button size="sm" className="w-full">
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
                  <p className="text-sm font-medium text-gray-600">Active Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeRequests || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Currently processing</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={stats ? (stats.activeRequests / stats.totalRequests) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.avgProcessingTime || "N/A"}</p>
                  <p className="text-xs text-green-600 mt-1">Response time</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Calendar className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">-0.5 days improved</span>
              </div>
            </CardContent>
          </Card>
        </div>

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
                      {action.count !== undefined && (
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
                <CardDescription>Latest internship applications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{request.applicantName}</h4>
                          <div className="flex items-center space-x-2">
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
                            <span className="font-medium">Type:</span> {request.requestType}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Status Distribution</CardTitle>
              <CardDescription>Current status breakdown of all requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics?.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {metrics?.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Processing Trends</CardTitle>
              <CardDescription>Request submission, processing, and routing trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics?.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={2} name="Submitted" />
                  <Line type="monotone" dataKey="processed" stroke="#10b981" strokeWidth={2} name="Processed" />
                  <Line type="monotone" dataKey="routed" stroke="#8b5cf6" strokeWidth={2} name="Routed to HoDs" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Department Request Overview</CardTitle>
            <CardDescription>Request status breakdown by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.departmentBreakdown.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">{dept.department}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-orange-600">{dept.pending}</p>
                      <p className="text-xs text-gray-500">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-blue-600">{dept.active}</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-600">{dept.completed}</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact HoD
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Your coordination efficiency this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Requests Processed</span>
                <span className="text-lg font-semibold">{stats?.monthlyProcessed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="text-lg font-semibold">{stats?.avgProcessingTime || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-lg font-semibold text-green-600">94%</span>
              </div>
              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Monthly Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Responsibilities</CardTitle>
              <CardDescription>Your primary coordination duties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm text-gray-700">Initial processing of internship requests</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Coordination between departments</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm text-gray-700">Request status monitoring and follow-up</span>
              </div>
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm text-gray-700">Documentation and record maintenance</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}