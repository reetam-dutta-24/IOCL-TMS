"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  FileCheck,
  Eye,
  RefreshCw,
  BarChart3,
  Download,
  Crown,
  ArrowRight,
  Calendar,
  Target,
  Award,
  Briefcase,
  UserCheck,
  ClipboardCheck,
  PieChart,
  Activity,
  Layers,
  Globe,
  Zap
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from "recharts"
import Link from "next/link"

interface LndHodStats {
  totalInternshipRequests: number
  pendingApprovals: number
  activeInternships: number
  completionRate: number
  monthlyApprovals: number
  totalUsers: number
  activeUsers: number
  ldUsers: number
  urgentApprovals: number
}

interface LndHodMetrics {
  approvalTrends: { month: string; submitted: number; approved: number; rejected: number }[]
  departmentMetrics: { department: string; activeUsers: number; totalRequests: number; pendingRequests: number; approvedRequests: number; resourceAllocation: number }[]
  complianceDistribution: { name: string; value: number; color: string }[]
  resourceUtilization: number
  policyCompliance: number
}

interface UrgentApproval {
  id: number
  applicantName: string
  requestType: string
  department: string
  submittedDate: string
  priority: string
  daysWaiting: number
  requiresAction: string
}

interface SystemOverview {
  totalUsers: number
  activeUsers: number
  ldUsers: number
  departments: number
}

export function LndHodDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<LndHodStats | null>(null)
  const [metrics, setMetrics] = useState<LndHodMetrics | null>(null)
  const [urgentApprovals, setUrgentApprovals] = useState<UrgentApproval[]>([])
  const [systemOverview, setSystemOverview] = useState<SystemOverview | null>(null)
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
      console.log("🔍 Fetching L&D HoD dashboard data...")
      
      const response = await fetch("/api/lnd-hod-dashboard", {
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

      console.log("📊 Received L&D HoD dashboard data:", data)
      
      setStats(data.stats)
      setMetrics(data.metrics)
      setUrgentApprovals(data.urgentApprovals || [])
      setSystemOverview(data.systemOverview)

    } catch (error) {
      console.error("💥 Failed to fetch L&D HoD dashboard data:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard data")
      
      // Fallback to minimal data structure
      setStats({
        totalInternshipRequests: 0,
        pendingApprovals: 0,
        activeInternships: 0,
        completionRate: 0,
        monthlyApprovals: 0,
        totalUsers: 0,
        activeUsers: 0,
        ldUsers: 0,
        urgentApprovals: 0
      })
      setMetrics({
        approvalTrends: [],
        departmentMetrics: [],
        complianceDistribution: [],
        resourceUtilization: 0,
        policyCompliance: 0
      })
      setUrgentApprovals([])
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

  const getPriorityBadge = (priority: string, daysWaiting: number) => {
    const priorityConfig: Record<string, string> = {
      "High": "bg-red-100 text-red-800",
      "Medium": "bg-orange-100 text-orange-800",
      "Normal": "bg-green-100 text-green-800"
    }
    
    const urgencyLevel = daysWaiting > 7 ? "High" : daysWaiting > 3 ? "Medium" : "Normal"
    
    return (
      <Badge className={priorityConfig[urgencyLevel] || "bg-gray-100 text-gray-800"}>
        {urgencyLevel} ({daysWaiting}d)
      </Badge>
    )
  }

  const executiveActions = [
    {
      title: "Final Approvals",
      description: "Review and approve pending internship requests",
      href: "/approvals?filter=pending",
      icon: CheckCircle,
      color: "bg-green-600",
      count: stats?.pendingApprovals || 0,
      priority: "high"
    },
    {
      title: "Policy Oversight",
      description: "Monitor compliance and enforce policies",
      href: "/policy-compliance",
      icon: Shield,
      color: "bg-blue-600",
      count: metrics?.policyCompliance || 0,
      suffix: "% compliant"
    },
    {
      title: "Resource Allocation",
      description: "Manage department resources and capacity",
      href: "/resource-management",
      icon: Target,
      color: "bg-purple-600",
      count: metrics?.resourceUtilization || 0,
      suffix: "% utilized"
    },
    {
      title: "Quality Assurance",
      description: "Review program quality and outcomes",
      href: "/quality-assurance",
      icon: Award,
      color: "bg-orange-600",
      count: stats?.completionRate || 0,
      suffix: "% completion"
    },
    {
      title: "Executive Reports",
      description: "Generate strategic reports and analytics",
      href: "/executive-reports",
      icon: BarChart3,
      color: "bg-indigo-600"
    },
    {
      title: "System Configuration",
      description: "Configure parameters and override decisions",
      href: "/system-config",
      icon: Settings,
      color: "bg-gray-600"
    }
  ]

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading L&D HoD dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Crown className="h-8 w-8 text-yellow-600 mr-3" />
              {getGreeting()}, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              L&D Head of Department - Executive oversight, final approvals & strategic management
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
              <Crown className="h-4 w-4 mr-2" />
              L&D HoD
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

        {/* Executive Role Information */}
        <Alert className="border-yellow-200 bg-yellow-50">
          <Crown className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            <strong>👑 Executive Authority:</strong> As L&D Head of Department, you have final approval authority over internship requests, policy compliance oversight, resource allocation decisions, and quality assurance of all L&D programs. You can override decisions, configure system parameters, and generate executive reports.
          </AlertDescription>
        </Alert>

        {/* Critical Alerts */}
        {stats && stats.urgentApprovals > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>{stats.urgentApprovals} high-priority approvals</strong> require your immediate executive attention.
              <Link href="/approvals?filter=urgent" className="ml-2 underline font-medium">
                Review Now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Executive Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Internship Requests</p>
                  <p className="text-3xl font-bold text-green-900">{stats?.totalInternshipRequests || 0}</p>
                  <p className="text-xs text-green-600 mt-1">Executive oversight</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-700">Strategic data</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Pending Final Approvals</p>
                  <p className="text-3xl font-bold text-orange-900">{stats?.pendingApprovals || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Awaiting executive decision</p>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-orange-700" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/approvals?filter=pending">
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" disabled={!stats?.pendingApprovals}>
                    Review & Approve
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Active Internships</p>
                  <p className="text-3xl font-bold text-blue-900">{stats?.activeInternships || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Quality assurance</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-blue-700" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={stats && stats.totalInternshipRequests > 0 ? (stats.activeInternships / stats.totalInternshipRequests) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Program Quality</p>
                  <p className="text-3xl font-bold text-purple-900">{stats?.completionRate || 0}%</p>
                  <p className="text-xs text-purple-600 mt-1">Completion rate</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Target className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-purple-700">Excellence metric</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Executive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Executive Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 text-yellow-600 mr-2" />
                  Executive Actions
                </CardTitle>
                <CardDescription>Strategic management and oversight tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {executiveActions.map((action, index) => (
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
                        <Badge variant="secondary" className={action.priority === 'high' ? 'bg-red-100 text-red-800' : ''}>
                          {action.count}{action.suffix || ''}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* High-Priority Approvals */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  High-Priority Executive Approvals
                </CardTitle>
                <CardDescription>Critical decisions requiring your immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                {urgentApprovals.length > 0 ? (
                  <div className="space-y-4">
                    {urgentApprovals.map((approval) => (
                      <div key={approval.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{approval.applicantName}</h4>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(approval.priority, approval.daysWaiting)}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Request Type:</span> {approval.requestType}
                            </div>
                            <div>
                              <span className="font-medium">Department:</span> {approval.department}
                            </div>
                            <div>
                              <span className="font-medium">Waiting:</span> {approval.daysWaiting} days
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span> {new Date(approval.submittedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <Crown className="h-4 w-4 text-yellow-600 mr-1" />
                            <span className="text-yellow-700 font-medium">{approval.requiresAction}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-300" />
                    <p>All high-priority items reviewed</p>
                    <p className="text-sm text-gray-400 mt-1">Excellent executive oversight!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Executive Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                Executive Approval Trends
              </CardTitle>
              <CardDescription>Strategic decision patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.approvalTrends && metrics.approvalTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.approvalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={2} name="Submitted" />
                    <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" />
                    <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Rejected" />
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
                <PieChart className="h-5 w-5 text-green-600 mr-2" />
                Policy Compliance Overview
              </CardTitle>
              <CardDescription>System-wide compliance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.complianceDistribution && metrics.complianceDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={metrics.complianceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics.complianceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No compliance data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resource Allocation & Department Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layers className="h-5 w-5 text-purple-600 mr-2" />
              Strategic Resource Allocation
            </CardTitle>
            <CardDescription>Department-wise resource distribution and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics?.departmentMetrics && metrics.departmentMetrics.length > 0 ? (
              <div className="space-y-4">
                {metrics.departmentMetrics.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Globe className="h-6 w-6 text-gray-400 mr-3" />
                      <div>
                        <span className="font-medium text-gray-900">{dept.department}</span>
                        <p className="text-sm text-gray-500">{dept.resourceAllocation}% resource allocation</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-blue-600">{dept.activeUsers}</p>
                        <p className="text-xs text-gray-500">Active Users</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-orange-600">{dept.pendingRequests}</p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">{dept.approvedRequests}</p>
                        <p className="text-xs text-gray-500">Approved</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-purple-600">{dept.totalRequests}</p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No department metrics available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Executive Summary & System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 text-indigo-600 mr-2" />
                Executive Performance Summary
              </CardTitle>
              <CardDescription>Your strategic impact and system oversight</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Approvals</span>
                <span className="text-lg font-semibold">{stats?.monthlyApprovals || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Policy Compliance</span>
                <span className="text-lg font-semibold text-green-600">{metrics?.policyCompliance || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resource Utilization</span>
                <span className="text-lg font-semibold text-blue-600">{metrics?.resourceUtilization || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Program Quality</span>
                <span className="text-lg font-semibold text-purple-600">{stats?.completionRate || 0}%</span>
              </div>
              <div className="pt-4 space-y-2">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Executive Report
                </Button>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Settings className="h-4 w-4 mr-2" />
                  System Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 text-yellow-600 mr-2" />
                Executive Authorities & Capabilities
              </CardTitle>
              <CardDescription>Your strategic powers and responsibilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Final approval authority for all internship requests</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm text-gray-700">Policy compliance oversight and enforcement</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Target className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm text-gray-700">Strategic resource allocation and capacity planning</span>
              </div>
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <Award className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm text-gray-700">Quality assurance and program excellence monitoring</span>
              </div>
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <Settings className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="text-sm text-gray-700">System configuration and decision override capabilities</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}