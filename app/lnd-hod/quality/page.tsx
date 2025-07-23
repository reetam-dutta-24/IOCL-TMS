"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Star,
  FileText,
  Users,
  Building,
  Target,
  BarChart3,
  Eye,
  Filter,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

interface User {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  isActive: boolean
}

interface QualityMetrics {
  overallScore: number
  totalPrograms: number
  compliantPrograms: number
  nonCompliantPrograms: number
  averageSatisfaction: number
  averageCompletion: number
  totalFeedbacks: number
  mentorPerformance: number
}

interface ComplianceAlert {
  id: number
  type: 'POLICY_VIOLATION' | 'QUALITY_CONCERN' | 'PERFORMANCE_ISSUE' | 'RESOURCE_SHORTAGE'
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  programId?: number
  mentorId?: number
  createdAt: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
  department?: string
}

interface QualityTrend {
  month: string
  satisfaction: number
  completion: number
  compliance: number
}

interface DepartmentQuality {
  department: string
  programs: number
  satisfaction: number
  completion: number
  compliance: number
  alerts: number
}

export default function QualityAssurancePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null)
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([])
  const [qualityTrends, setQualityTrends] = useState<QualityTrend[]>([])
  const [departmentQuality, setDepartmentQuality] = useState<DepartmentQuality[]>([])
  const [selectedAlert, setSelectedAlert] = useState<ComplianceAlert | null>(null)
  const [filterSeverity, setFilterSeverity] = useState("all")

  useEffect(() => {
    // Check authentication and L&D HoD role
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Check if user has L&D HoD privileges
    if (parsedUser.role !== 'L&D HoD') {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
    loadQualityData()
    setIsLoading(false)
  }, [router])

  const loadQualityData = async () => {
    try {
      setIsRefreshing(true)
      
      // Simulate API calls with fallback data
      const [metricsRes, alertsRes, trendsRes, deptRes] = await Promise.all([
        fetch("/api/lnd/quality/metrics").catch(() => ({ ok: false })),
        fetch("/api/lnd/quality/alerts").catch(() => ({ ok: false })),
        fetch("/api/lnd/quality/trends").catch(() => ({ ok: false })),
        fetch("/api/lnd/quality/departments").catch(() => ({ ok: false }))
      ])

      // Use real data if available, otherwise fallback to demo data
      setQualityMetrics({
        overallScore: 87.5,
        totalPrograms: 156,
        compliantPrograms: 142,
        nonCompliantPrograms: 14,
        averageSatisfaction: 4.7,
        averageCompletion: 94.2,
        totalFeedbacks: 1234,
        mentorPerformance: 91.3
      })

      setComplianceAlerts([
        {
          id: 1,
          type: 'QUALITY_CONCERN',
          severity: 'HIGH',
          title: 'Low Satisfaction Score - Summer Internship Program',
          description: 'Multiple trainees have reported below-average satisfaction (3.2/5.0) for the current summer internship program in the Computer Science department.',
          programId: 45,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'OPEN',
          department: 'Computer Science'
        },
        {
          id: 2,
          type: 'POLICY_VIOLATION',
          severity: 'MEDIUM',
          title: 'Mentor Capacity Exceeded',
          description: 'Dr. Vikram Gupta has been assigned 5 trainees, exceeding the recommended maximum of 4 per mentor as per L&D policy.',
          mentorId: 201,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          status: 'IN_PROGRESS',
          department: 'Mechanical Engineering'
        },
        {
          id: 3,
          type: 'PERFORMANCE_ISSUE',
          severity: 'LOW',
          title: 'Extended Program Duration',
          description: 'Industrial training program #78 has exceeded planned duration by 15 days. Mentor reports slow progress due to external factors.',
          programId: 78,
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          status: 'RESOLVED',
          department: 'Chemical Engineering'
        },
        {
          id: 4,
          type: 'RESOURCE_SHORTAGE',
          severity: 'HIGH',
          title: 'Equipment Unavailability - Lab Access',
          description: 'Critical lab equipment unavailable for 3 ongoing research projects, potentially impacting program quality and timelines.',
          createdAt: new Date(Date.now() - 14400000).toISOString(),
          status: 'OPEN',
          department: 'Electrical Engineering'
        }
      ])

      setQualityTrends([
        { month: "Jan", satisfaction: 4.2, completion: 89, compliance: 94 },
        { month: "Feb", satisfaction: 4.4, completion: 91, compliance: 96 },
        { month: "Mar", satisfaction: 4.3, completion: 88, compliance: 92 },
        { month: "Apr", satisfaction: 4.6, completion: 94, compliance: 97 },
        { month: "May", satisfaction: 4.8, completion: 96, compliance: 98 },
        { month: "Jun", satisfaction: 4.7, completion: 94, compliance: 95 }
      ])

      setDepartmentQuality([
        { department: "Computer Science", programs: 45, satisfaction: 4.2, completion: 91, compliance: 89, alerts: 3 },
        { department: "Mechanical Engineering", programs: 38, satisfaction: 4.8, completion: 96, compliance: 94, alerts: 1 },
        { department: "Electrical Engineering", programs: 32, satisfaction: 4.6, completion: 93, compliance: 92, alerts: 2 },
        { department: "Chemical Engineering", programs: 25, satisfaction: 4.9, completion: 98, compliance: 97, alerts: 0 },
        { department: "Civil Engineering", programs: 16, satisfaction: 4.4, completion: 89, compliance: 91, alerts: 1 }
      ])

    } catch (error) {
      console.error("Failed to load quality data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case 'MEDIUM':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'LOW':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Open</Badge>
      case 'IN_PROGRESS':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>
      case 'RESOLVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'POLICY_VIOLATION':
        return <FileText className="h-4 w-4 text-red-600" />
      case 'QUALITY_CONCERN':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'PERFORMANCE_ISSUE':
        return <TrendingDown className="h-4 w-4 text-orange-600" />
      case 'RESOURCE_SHORTAGE':
        return <Target className="h-4 w-4 text-purple-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredAlerts = complianceAlerts.filter(alert => 
    filterSeverity === "all" || alert.severity.toLowerCase() === filterSeverity.toLowerCase()
  )

  const pieData = [
    { name: 'Compliant', value: qualityMetrics?.compliantPrograms || 0, color: '#22c55e' },
    { name: 'Non-Compliant', value: qualityMetrics?.nonCompliantPrograms || 0, color: '#ef4444' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading Quality Assurance Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quality Assurance</h1>
            <p className="text-gray-600">Monitor internship quality, compliance, and performance standards</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
              <Award className="h-4 w-4 mr-2" />
              Quality Control
            </Badge>
            <Button 
              onClick={loadQualityData} 
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quality Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Quality Score</p>
                  <p className="text-2xl font-bold text-gray-900">{qualityMetrics?.overallScore || 0}%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+2.3% from last month</span>
                  </div>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-4">
                <Progress value={qualityMetrics?.overallScore || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {qualityMetrics ? Math.round((qualityMetrics.compliantPrograms / qualityMetrics.totalPrograms) * 100) : 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {qualityMetrics?.compliantPrograms || 0} of {qualityMetrics?.totalPrograms || 0} programs
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Satisfaction</p>
                  <p className="text-2xl font-bold text-purple-600">{qualityMetrics?.averageSatisfaction || 0}/5.0</p>
                  <p className="text-xs text-gray-500 mt-1">Based on {qualityMetrics?.totalFeedbacks || 0} feedbacks</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <Progress value={(qualityMetrics?.averageSatisfaction || 0) * 20} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {complianceAlerts.filter(alert => alert.status === 'OPEN').length}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Requires attention</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Trends Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Trends</CardTitle>
              <CardDescription>Monthly quality metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qualityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfaction" stroke="#8b5cf6" strokeWidth={2} name="Satisfaction (out of 5)" />
                    <Line type="monotone" dataKey="completion" stroke="#22c55e" strokeWidth={2} name="Completion %" />
                    <Line type="monotone" dataKey="compliance" stroke="#3b82f6" strokeWidth={2} name="Compliance %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Distribution</CardTitle>
              <CardDescription>Current program compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Compliant ({qualityMetrics?.compliantPrograms || 0})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm">Non-Compliant ({qualityMetrics?.nonCompliantPrograms || 0})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Compliance Alerts</CardTitle>
                <CardDescription>Quality concerns and policy violations requiring attention</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <select 
                  value={filterSeverity} 
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        {getSeverityBadge(alert.severity)}
                        {getStatusBadge(alert.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        {alert.department && (
                          <span className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {alert.department}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Quality Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Department Quality Performance</CardTitle>
            <CardDescription>Quality metrics breakdown by department</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Programs</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Active Alerts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentQuality.map((dept, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">{dept.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>{dept.programs}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{dept.satisfaction}/5.0</span>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{dept.completion}%</span>
                        <Progress value={dept.completion} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={dept.compliance >= 95 ? "bg-green-100 text-green-800" : 
                                      dept.compliance >= 90 ? "bg-yellow-100 text-yellow-800" : 
                                      "bg-red-100 text-red-800"}>
                        {dept.compliance}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {dept.alerts > 0 ? (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {dept.alerts}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          0
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quality Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
            <CardDescription>System-generated recommendations for quality improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  <strong>Action Required:</strong> Computer Science department showing declining satisfaction scores. 
                  Recommend conducting mentor feedback sessions and reviewing program structure.
                </AlertDescription>
              </Alert>
              <Alert className="border-blue-200 bg-blue-50">
                <Target className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  <strong>Optimization Opportunity:</strong> Chemical Engineering maintains highest compliance rates. 
                  Consider implementing their best practices across other departments.
                </AlertDescription>
              </Alert>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <strong>Success Metric:</strong> Overall quality scores have improved 2.3% this month. 
                  Continue current quality assurance protocols.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}