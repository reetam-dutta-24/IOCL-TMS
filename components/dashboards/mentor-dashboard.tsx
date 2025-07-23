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
  GraduationCap,
  Lightbulb,
  ChevronRight
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts"
import Link from "next/link"

interface MentorStats {
  totalTrainees: number
  activeTrainees: number
  completedAssignments: number
  pendingReports: number
  monthlyReports: number
  submittedReports: number
  overdueReports: number
  reportSubmissionRate: number
}

interface MentorMetrics {
  progressTrends: { month: string; submitted: number; overdue: number; total: number }[]
  traineePerformance: { trainee: string; department: string; totalReports: number; submittedReports: number; overdueReports: number; performanceScore: number; status: string }[]
  performanceDistribution: { name: string; value: number; color: string }[]
  averagePerformanceScore: number
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

interface MentorInfo {
  totalTrainees: number
  activeTrainees: number
  completedAssignments: number
}

export function MentorDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<MentorStats | null>(null)
  const [metrics, setMetrics] = useState<MentorMetrics | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [mentorInfo, setMentorInfo] = useState<MentorInfo | null>(null)
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
      console.log("🔍 Fetching Mentor dashboard data...")
      
      const response = await fetch("/api/mentor-dashboard", {
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

      console.log("📊 Received Mentor dashboard data:", data)
      
      setStats(data.stats)
      setMetrics(data.metrics)
      setRecentActivities(data.recentActivities || [])
      setMentorInfo(data.mentorInfo)

    } catch (error) {
      console.error("💥 Failed to fetch Mentor dashboard data:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard data")
      
      // Fallback to minimal data structure
      setStats({
        totalTrainees: 0,
        activeTrainees: 0,
        completedAssignments: 0,
        pendingReports: 0,
        monthlyReports: 0,
        submittedReports: 0,
        overdueReports: 0,
        reportSubmissionRate: 0
      })
      setMetrics({
        progressTrends: [],
        traineePerformance: [],
        performanceDistribution: [],
        averagePerformanceScore: 0
      })
      setRecentActivities([])
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
      "submitted": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "draft": { color: "bg-yellow-100 text-yellow-800", icon: Edit },
      "overdue": { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      "active": { color: "bg-blue-100 text-blue-800", icon: Activity },
      "completed": { color: "bg-green-100 text-green-800", icon: CheckCircle }
    }
    
    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", icon: FileText }
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
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

  const mentorActions = [
    {
      title: "Assigned Trainees",
      description: "View and manage your assigned trainees",
      href: "/trainees",
      icon: Users,
      color: "bg-blue-600",
      count: stats?.activeTrainees || 0
    },
    {
      title: "Submit Progress Report",
      description: "Create and submit trainee progress reports",
      href: "/reports/create",
      icon: FileText,
      color: "bg-green-600",
      count: stats?.pendingReports || 0,
      priority: "high"
    },
    {
      title: "Performance Evaluations",
      description: "Conduct trainee performance assessments",
      href: "/evaluations",
      icon: Star,
      color: "bg-purple-600"
    },
    {
      title: "Training Materials",
      description: "Access training resources and materials",
      href: "/materials",
      icon: BookOpen,
      color: "bg-orange-600"
    },
    {
      title: "Project Status Updates",
      description: "Update and track project progress",
      href: "/projects",
      icon: Target,
      color: "bg-indigo-600"
    },
    {
      title: "Behavioral Comments",
      description: "Record behavioral observations and feedback",
      href: "/feedback",
      icon: MessageSquare,
      color: "bg-teal-600"
    }
  ]

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading mentor dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Mentor Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              {getGreeting()}, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Mentor Dashboard - Direct supervision, guidance & performance evaluation
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <GraduationCap className="h-4 w-4 mr-2" />
              Mentor
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

        {/* Mentor Role Information */}
        <Alert className="border-blue-200 bg-blue-50">
          <GraduationCap className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>👨‍🏫 Your Role:</strong> As a Mentor, you provide direct supervision of assigned trainees, offer project guidance and technical support, conduct performance evaluations, and submit progress reports. You have access to training materials and can update project statuses for your assigned trainees.
          </AlertDescription>
        </Alert>

        {/* Urgent Tasks Alert */}
        {stats && stats.overdueReports > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>{stats.overdueReports} reports are overdue</strong> and require your immediate attention.
              <Link href="/reports?filter=overdue" className="ml-2 underline font-medium">
                Submit Now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Mentor Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Assigned Trainees</p>
                  <p className="text-3xl font-bold text-blue-900">{stats?.totalTrainees || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Under your guidance</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <UserCheck className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-blue-700">{stats?.activeTrainees || 0} currently active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Report Submission Rate</p>
                  <p className="text-3xl font-bold text-green-900">{stats?.reportSubmissionRate || 0}%</p>
                  <p className="text-xs text-green-600 mt-1">Performance metric</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Clipboard className="h-6 w-6 text-green-700" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={stats?.reportSubmissionRate || 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Pending Reports</p>
                  <p className="text-3xl font-bold text-orange-900">{stats?.pendingReports || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Awaiting submission</p>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-700" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/reports/create">
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" disabled={!stats?.pendingReports}>
                    Submit Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Avg Performance Score</p>
                  <p className="text-3xl font-bold text-purple-900">{metrics?.averagePerformanceScore || 0}%</p>
                  <p className="text-xs text-purple-600 mt-1">Trainee success rate</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Star className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-purple-700">Excellence tracking</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Mentor Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mentor Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                  Mentor Actions
                </CardTitle>
                <CardDescription>Supervision and guidance tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mentorActions.map((action, index) => (
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
                  Recent Activities & Tasks
                </CardTitle>
                <CardDescription>Your latest mentoring activities and upcoming deadlines</CardDescription>
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
                          <Button size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activities</p>
                    <p className="text-sm text-gray-400 mt-1">Start mentoring to see activities here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mentoring Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                Progress Tracking Trends
              </CardTitle>
              <CardDescription>Report submission and completion patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.progressTrends && metrics.progressTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.progressTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="submitted" stroke="#10b981" strokeWidth={2} name="Submitted" />
                    <Line type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={2} name="Overdue" />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total" />
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
                Trainee Performance Distribution
              </CardTitle>
              <CardDescription>Overall performance breakdown of your trainees</CardDescription>
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
                    <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No performance data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trainee Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              Trainee Performance Overview
            </CardTitle>
            <CardDescription>Individual performance metrics for all assigned trainees</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics?.traineePerformance && metrics.traineePerformance.length > 0 ? (
              <div className="space-y-4">
                {metrics.traineePerformance.map((trainee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{trainee.trainee}</span>
                        <p className="text-sm text-gray-500">{trainee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-blue-600">{trainee.totalReports}</p>
                        <p className="text-xs text-gray-500">Total Reports</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">{trainee.submittedReports}</p>
                        <p className="text-xs text-gray-500">Submitted</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-red-600">{trainee.overdueReports}</p>
                        <p className="text-xs text-gray-500">Overdue</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-purple-600">{trainee.performanceScore}%</p>
                        <p className="text-xs text-gray-500">Performance</p>
                      </div>
                      <div className="flex space-x-2">
                        {getStatusBadge(trainee.status)}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No trainees assigned yet</p>
                <p className="text-sm text-gray-400 mt-1">Trainee assignments will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mentor Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 text-indigo-600 mr-2" />
                Monthly Performance Summary
              </CardTitle>
              <CardDescription>Your mentoring effectiveness this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reports Submitted</span>
                <span className="text-lg font-semibold">{stats?.monthlyReports || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Submission Rate</span>
                <span className="text-lg font-semibold text-green-600">{stats?.reportSubmissionRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Trainees</span>
                <span className="text-lg font-semibold text-blue-600">{stats?.activeTrainees || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Trainee Performance</span>
                <span className="text-lg font-semibold text-purple-600">{metrics?.averagePerformanceScore || 0}%</span>
              </div>
              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Performance Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                Mentor Responsibilities & Access
              </CardTitle>
              <CardDescription>Your mentoring duties and system permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm text-gray-700">Direct supervision of assigned trainees</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Lightbulb className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Project guidance and technical support</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Star className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm text-gray-700">Performance evaluation and feedback</span>
              </div>
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm text-gray-700">Report submission and documentation</span>
              </div>
              <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-teal-600 mr-3" />
                <span className="text-sm text-gray-700">Access to training materials and resources</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}