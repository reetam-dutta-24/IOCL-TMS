"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  BookOpen,
  MessageSquare,
  Star,
  Eye,
  RefreshCw,
  BarChart3,
  Download,
  UserCheck,
  ArrowRight,
  Calendar,
  Target,
  Clock,
  Award,
  Clipboard,
  Send,
  Edit,
  PieChart,
  Activity,
  Building2,
  UserPlus,
  ChevronRight,
  Settings,
  Shield,
  Briefcase,
  TrendingDown,
  UserMinus,
  Hash,
  DollarSign,
  Zap,
  MonitorSpeaker
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from "recharts"
import Link from "next/link"

interface DepartmentHoDStats {
  totalRequests: number
  pendingAssignments: number
  activeAssignments: number
  availableMentors: number
  assignedMentors: number
  mentorUtilization: number
  avgMentorWorkload: number
  requestsByStatus: {
    submitted: number
    underReview: number
    approved: number
    assigned: number
  }
}

interface DepartmentHoDMetrics {
  monthlyTrends: { month: string; requests: number; assignments: number; efficiency: number }[]
  mentorWorkloads: { mentorId: number; mentorName: string; role: string; currentAssignments: number; capacity: number; utilizationRate: number; availability: string }[]
  performanceDistribution: { name: string; value: number; color: string }[]
  departmentEfficiency: number
}

interface RecentActivity {
  id: number
  activity: string
  type: string
  date: string
  status: string
  priority: string
  action: string
}

interface DepartmentInfo {
  departmentName: string
  hodName: string
  teamSize: number
  totalRequests: number
  activeAssignments: number
}

interface DepartmentRequest {
  id: number
  requestNumber: string
  traineeName: string
  traineeEmail: string
  institutionName: string
  status: string
  createdAt: string
  mentorAssignments: any[]
}

interface MentorTeamMember {
  mentorId: number
  mentorName: string
  role: string
  currentAssignments: number
  capacity: number
  utilizationRate: number
  availability: string
}

export function DepartmentHoDDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<DepartmentHoDStats | null>(null)
  const [metrics, setMetrics] = useState<DepartmentHoDMetrics | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [departmentInfo, setDepartmentInfo] = useState<DepartmentInfo | null>(null)
  const [departmentRequests, setDepartmentRequests] = useState<DepartmentRequest[]>([])
  const [mentorTeam, setMentorTeam] = useState<MentorTeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      setError(null)
      console.log("🔍 Fetching Department HoD dashboard data...")
      
      const response = await fetch("/api/department-hod-dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      console.log("📊 Received Department HoD dashboard data:", data)
      
      setStats(data.stats)
      setMetrics(data.metrics)
      setRecentActivities(data.recentActivities || [])
      setDepartmentInfo(data.departmentInfo)
      setDepartmentRequests(data.departmentRequests || [])
      setMentorTeam(data.mentorTeam || [])

    } catch (error) {
      console.error("💥 Failed to fetch Department HoD dashboard data:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard data")
      
      // Fallback to minimal data structure
      setStats({
        totalRequests: 0,
        pendingAssignments: 0,
        activeAssignments: 0,
        availableMentors: 0,
        assignedMentors: 0,
        mentorUtilization: 0,
        avgMentorWorkload: 0,
        requestsByStatus: { submitted: 0, underReview: 0, approved: 0, assigned: 0 }
      })
      setMetrics({
        monthlyTrends: [],
        mentorWorkloads: [],
        performanceDistribution: [],
        departmentEfficiency: 0
      })
      setRecentActivities([])
      setDepartmentInfo({
        departmentName: 'Department',
        hodName: 'Current HoD',
        teamSize: 0,
        totalRequests: 0,
        activeAssignments: 0
      })
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
      "submitted": { color: "bg-blue-100 text-blue-800", icon: Send },
      "under_review": { color: "bg-yellow-100 text-yellow-800", icon: Eye },
      "approved": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "assigned": { color: "bg-purple-100 text-purple-800", icon: UserCheck },
      "active": { color: "bg-blue-100 text-blue-800", icon: Activity },
      "completed": { color: "bg-green-100 text-green-800", icon: CheckCircle }
    }
    
    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", icon: FileText }
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, string> = {
      "High": "bg-red-100 text-red-800",
      "Medium": "bg-orange-100 text-orange-800",
      "Normal": "bg-green-100 text-green-800"
    }
    
    return <Badge className={priorityConfig[priority] || "bg-gray-100 text-gray-800"}>{priority}</Badge>
  }

  const getAvailabilityBadge = (availability: string) => {
    const availabilityConfig: Record<string, string> = {
      "Available": "bg-green-100 text-green-800",
      "At Capacity": "bg-red-100 text-red-800",
      "Overloaded": "bg-orange-100 text-orange-800"
    }
    
    return <Badge className={availabilityConfig[availability] || "bg-gray-100 text-gray-800"}>{availability}</Badge>
  }

  const departmentHoDActions = [
    {
      title: "Assign Mentors",
      description: "Assign mentors from your team to approved requests",
      href: "/mentor-assignment",
      icon: UserPlus,
      color: "bg-blue-600",
      count: stats?.pendingAssignments || 0,
      priority: "high"
    },
    {
      title: "Department Requests",
      description: "Review internship requests for your department",
      href: "/department-requests",
      icon: FileText,
      color: "bg-green-600",
      count: stats?.totalRequests || 0
    },
    {
      title: "Mentor Workload",
      description: "Monitor and balance mentor assignments",
      href: "/mentor-workload",
      icon: BarChart3,
      color: "bg-purple-600"
    },
    {
      title: "Resource Allocation",
      description: "Approve departmental resources and budgets",
      href: "/resources",
      icon: DollarSign,
      color: "bg-orange-600"
    },
    {
      title: "Performance Reports",
      description: "View departmental performance analytics",
      href: "/performance",
      icon: TrendingUp,
      color: "bg-indigo-600"
    },
    {
      title: "Team Management",
      description: "Manage department team and mentor feedback",
      href: "/team",
      icon: Users,
      color: "bg-teal-600"
    }
  ]

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Department HoD dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Department HoD Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              {getGreeting()}, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Department HoD Dashboard - {departmentInfo?.departmentName} - Mentor assignment, resource allocation & coordination
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Building2 className="h-4 w-4 mr-2" />
              Department HoD
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

        {/* Department HoD Role Information */}
        <Alert className="border-blue-200 bg-blue-50">
          <Building2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>🏢 Your Role:</strong> As a Department HoD, you manage mentor assignments within your department, allocate resources for internship activities, coordinate departmental operations, and provide technical guidance oversight. You can assign mentors from your team, monitor workloads, and approve departmental resources.
          </AlertDescription>
        </Alert>

        {/* Urgent Tasks Alert */}
        {stats && stats.pendingAssignments > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>{stats.pendingAssignments} approved requests</strong> are waiting for mentor assignment from your department.
              <Link href="/mentor-assignment" className="ml-2 underline font-medium">
                Assign Now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Department HoD Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Department Requests</p>
                  <p className="text-3xl font-bold text-blue-900">{stats?.totalRequests || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Total received</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Hash className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-blue-700">{stats?.requestsByStatus.submitted || 0} pending review</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Mentor Utilization</p>
                  <p className="text-3xl font-bold text-green-900">{stats?.mentorUtilization || 0}%</p>
                  <p className="text-xs text-green-600 mt-1">Team efficiency</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={stats?.mentorUtilization || 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Pending Assignments</p>
                  <p className="text-3xl font-bold text-orange-900">{stats?.pendingAssignments || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Need mentor assignment</p>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-orange-700" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/mentor-assignment">
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" disabled={!stats?.pendingAssignments}>
                    Assign Mentors
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Dept Efficiency</p>
                  <p className="text-3xl font-bold text-purple-900">{metrics?.departmentEfficiency || 0}%</p>
                  <p className="text-xs text-purple-600 mt-1">Assignment success</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Target className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-purple-700">{stats?.activeAssignments || 0} active assignments</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Department HoD Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department HoD Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  HoD Management Tools
                </CardTitle>
                <CardDescription>Department coordination and resource management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {departmentHoDActions.map((action, index) => (
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
                        <Badge variant="secondary" className={action.priority === 'high' ? 'bg-red-100 text-red-800' : ''}>
                          {action.count}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 text-green-600 mr-2" />
                  Recent Department Activities
                </CardTitle>
                <CardDescription>Latest requests and mentor assignments in your department</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{activity.activity}</h4>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(activity.priority)}
                              {getStatusBadge(activity.status)}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Type:</span> {activity.type}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {new Date(activity.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <ArrowRight className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-blue-600 font-medium">{activity.action}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {activity.action === 'Assign Mentor' && (
                            <Button size="sm">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activities</p>
                    <p className="text-sm text-gray-400 mt-1">Department activities will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Department Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                Department Performance Trends
              </CardTitle>
              <CardDescription>Monthly requests vs assignments efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.monthlyTrends && metrics.monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Requests" />
                    <Line type="monotone" dataKey="assignments" stroke="#10b981" strokeWidth={2} name="Assignments" />
                    <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={2} name="Efficiency %" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No trends data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 text-purple-600 mr-2" />
                Mentor Utilization Distribution
              </CardTitle>
              <CardDescription>Team workload balance across your department</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.performanceDistribution && metrics.performanceDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={metrics.performanceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics.performanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No utilization data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mentor Team Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              Department Mentor Team
            </CardTitle>
            <CardDescription>Workload and availability of your department mentors</CardDescription>
          </CardHeader>
          <CardContent>
            {mentorTeam.length > 0 ? (
              <div className="space-y-4">
                {mentorTeam.map((mentor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{mentor.mentorName}</span>
                        <p className="text-sm text-gray-500">{mentor.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-blue-600">{mentor.currentAssignments}</p>
                        <p className="text-xs text-gray-500">Current</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">{mentor.capacity}</p>
                        <p className="text-xs text-gray-500">Capacity</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-purple-600">{mentor.utilizationRate}%</p>
                        <p className="text-xs text-gray-500">Utilization</p>
                      </div>
                      <div className="flex space-x-2">
                        {getAvailabilityBadge(mentor.availability)}
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No team members found</p>
                <p className="text-sm text-gray-400 mt-1">Department mentors will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              Recent Department Requests
            </CardTitle>
            <CardDescription>Latest internship requests assigned to your department</CardDescription>
          </CardHeader>
          <CardContent>
            {departmentRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Request #</th>
                      <th className="text-left p-3">Trainee</th>
                      <th className="text-left p-3">Institution</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Mentor Assigned</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-blue-600">{request.requestNumber}</td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{request.traineeName}</p>
                            <p className="text-xs text-gray-500">{request.traineeEmail}</p>
                          </div>
                        </td>
                        <td className="p-3">{request.institutionName}</td>
                        <td className="p-3">{getStatusBadge(request.status)}</td>
                        <td className="p-3">
                          {request.mentorAssignments.length > 0 ? (
                            <span className="text-green-600 font-medium">
                              {request.mentorAssignments[0].mentor.firstName} {request.mentorAssignments[0].mentor.lastName}
                            </span>
                          ) : (
                            <span className="text-orange-600 font-medium">Pending Assignment</span>
                          )}
                        </td>
                        <td className="p-3">{new Date(request.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === 'approved' && request.mentorAssignments.length === 0 && (
                              <Button size="sm">
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No department requests found</p>
                <p className="text-sm text-gray-400 mt-1">Requests assigned to your department will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Summary & Permissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 text-indigo-600 mr-2" />
                Department Performance Summary
              </CardTitle>
              <CardDescription>Your department's key metrics and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Requests Handled</span>
                <span className="text-lg font-semibold">{stats?.totalRequests || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Assignments</span>
                <span className="text-lg font-semibold text-green-600">{stats?.activeAssignments || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Team Utilization</span>
                <span className="text-lg font-semibold text-blue-600">{stats?.mentorUtilization || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Department Efficiency</span>
                <span className="text-lg font-semibold text-purple-600">{metrics?.departmentEfficiency || 0}%</span>
              </div>
              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Department Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                HoD Responsibilities & Permissions
              </CardTitle>
              <CardDescription>Your departmental management capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <UserPlus className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm text-gray-700">Mentor assignment within department</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Resource allocation for internship activities</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm text-gray-700">Departmental coordination and oversight</span>
              </div>
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <MonitorSpeaker className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm text-gray-700">Technical guidance and mentor feedback</span>
              </div>
              <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-teal-600 mr-3" />
                <span className="text-sm text-gray-700">Monitor mentor workload and performance</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}