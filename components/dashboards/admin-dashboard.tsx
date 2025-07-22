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
  Shield, 
  Database, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Server,
  UserCheck,
  Settings,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Calendar,
  Building
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import Link from "next/link"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  pendingAccessRequests: number
  totalRequests: number
  systemHealth: number
  databaseSize: string
  lastBackup: string
  criticalAlerts: number
}

interface SystemMetrics {
  userGrowth: { month: string; count: number }[]
  requestTrends: { month: string; submitted: number; approved: number }[]
  departmentStats: { department: string; users: number; requests: number }[]
}

interface RecentActivity {
  id: number
  type: string
  user: string
  action: string
  timestamp: string
  status: string
}

export function AdminDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      console.log("🔍 Fetching admin dashboard data...")
      
      // Fetch admin statistics
      const [statsRes, activitiesRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/activities")
      ])

      console.log("📊 Stats API response status:", statsRes.status)
      console.log("📝 Activities API response status:", activitiesRes.status)

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        console.log("✅ Real stats data received:", statsData)
        setStats(statsData)
      } else {
        console.error("❌ Stats API failed:", statsRes.status, statsRes.statusText)
        // Set fallback data with clear indicators
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          pendingAccessRequests: 0,
          totalRequests: 0,
          systemHealth: 0,
          databaseSize: "Unknown",
          lastBackup: "N/A",
          criticalAlerts: 1 // Indicate API failure
        })
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json()
        console.log("✅ Activities data received:", activitiesData)
        setActivities(activitiesData)
      } else {
        console.error("❌ Activities API failed:", activitiesRes.status)
        setActivities([
          {
            id: 1,
            type: "SYSTEM_ALERT",
            user: "System",
            action: "API connection failed - showing fallback data",
            timestamp: new Date().toISOString(),
            status: "ERROR"
          }
        ])
      }

      // Mock metrics data for now (will be replaced with real data later)
      setMetrics({
        userGrowth: [
          { month: "Jan", count: 45 },
          { month: "Feb", count: 52 },
          { month: "Mar", count: 48 },
          { month: "Apr", count: 61 },
          { month: "May", count: 55 },
          { month: "Jun", count: 67 }
        ],
        requestTrends: [
          { month: "Jan", submitted: 23, approved: 18 },
          { month: "Feb", submitted: 31, approved: 24 },
          { month: "Mar", submitted: 28, approved: 22 },
          { month: "Apr", submitted: 35, approved: 29 },
          { month: "May", submitted: 42, approved: 31 },
          { month: "Jun", submitted: 38, approved: 33 }
        ],
        departmentStats: [
          { department: "L&D", users: 12, requests: 28 },
          { department: "IT", users: 18, requests: 42 },
          { department: "Operations", users: 15, requests: 31 },
          { department: "Engineering", users: 22, requests: 38 },
          { department: "Finance", users: 8, requests: 16 }
        ]
      })

    } catch (error) {
      console.error("💥 Failed to fetch admin dashboard data:", error)
      // Set clear error state
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        pendingAccessRequests: 0,
        totalRequests: 0,
        systemHealth: 0,
        databaseSize: "Error",
        lastBackup: "Error",
        criticalAlerts: 1
      })
      setActivities([
        {
          id: 1,
          type: "SYSTEM_ALERT",
          user: "System",
          action: `Dashboard API error: ${error}`,
          timestamp: new Date().toISOString(),
          status: "ERROR"
        }
      ])
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "USER_CREATED": return <UserCheck className="h-4 w-4 text-green-600" />
      case "REQUEST_SUBMITTED": return <FileText className="h-4 w-4 text-blue-600" />
      case "ACCESS_GRANTED": return <Shield className="h-4 w-4 text-purple-600" />
      case "SYSTEM_ALERT": return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const quickActions = [
    {
      title: "Manage Access Requests",
      description: "Review pending system access requests",
      href: "/admin",
      icon: Shield,
      color: "bg-red-500",
      count: stats?.pendingAccessRequests || 0
    },
    {
      title: "User Management",
      description: "View and manage all users",
      href: "/admin/users",
      icon: Users,
      color: "bg-blue-500",
      count: stats?.totalUsers || 0
    },
    {
      title: "System Analytics",
      description: "View detailed system reports",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "bg-green-500"
    },
    {
      title: "System Settings",
      description: "Configure system parameters",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-purple-500"
    },
    {
      title: "Audit Logs",
      description: "View system audit trail",
      href: "/admin/audit",
      icon: Activity,
      color: "bg-orange-500"
    },
    {
      title: "Database Management",
      description: "Database backup and maintenance",
      href: "/admin/database",
      icon: Database,
      color: "bg-indigo-500"
    }
  ]

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
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
              System Administrator Dashboard - Complete system oversight and management
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-red-100 text-red-800 px-3 py-1">
              <Shield className="h-4 w-4 mr-2" />
              System Administrator
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

        {/* Data Source Indicator */}
        <Alert className="border-blue-200 bg-blue-50">
          <Activity className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>📊 Dashboard Status:</strong> 
            {stats?.databaseSize === "Error" || stats?.databaseSize === "Unknown" ? (
              <span className="text-red-600 ml-2">⚠️ API Connection Failed - Showing fallback data. Check console for details.</span>
            ) : (
              <span className="text-green-600 ml-2">✅ Real-time data from database (Last updated: {new Date().toLocaleTimeString()})</span>
            )}
          </AlertDescription>
        </Alert>

        {/* Critical Alerts */}
        {stats && stats.criticalAlerts > 0 && stats.databaseSize !== "Error" && stats.databaseSize !== "Unknown" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>{stats.criticalAlerts} critical system alerts</strong> require immediate attention.
              <Link href="/admin/alerts" className="ml-2 underline font-medium">
                View Details
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats?.activeUsers || 0} active users
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={stats ? (stats.activeUsers / stats.totalUsers) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendingAccessRequests || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Require approval</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin">
                  <Button size="sm" className="w-full">
                    Review Requests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.systemHealth || 0}%</p>
                  <p className="text-xs text-green-600 mt-1">All systems operational</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Server className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={stats?.systemHealth || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalRequests || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">All time</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+15% this month</span>
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
                <CardDescription>Administrative tasks and management</CardDescription>
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

          {/* Recent System Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activities</CardTitle>
                <CardDescription>Latest system events and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length > 0 ? activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">by {activity.user}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
                          <Badge 
                            className={
                              activity.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                              activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recent activities</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/admin/audit">
                    <Button variant="outline">
                      View All Activities
                      <Eye className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Charts */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trends</CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Analytics</CardTitle>
                <CardDescription>Monthly request submission vs approval</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.requestTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="submitted" fill="#dc2626" name="Submitted" />
                    <Bar dataKey="approved" fill="#16a34a" name="Approved" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Database Size</span>
                <span className="text-sm font-medium">{stats?.databaseSize || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm font-medium">{stats?.lastBackup || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">System Version</span>
                <span className="text-sm font-medium">TAMS v2.1.0</span>
              </div>
              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export System Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Department Statistics</CardTitle>
              <CardDescription>Users and requests by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.departmentStats.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="font-medium">{dept.department}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{dept.users}</p>
                        <p className="text-xs text-gray-500">Users</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{dept.requests}</p>
                        <p className="text-xs text-gray-500">Requests</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}