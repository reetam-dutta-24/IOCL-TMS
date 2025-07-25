"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BarChart3, 
  Download, 
  Filter, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  Building,
  Award,
  Clock,
  Loader2,
  Search,
  RefreshCw,
  PieChart,
  Activity,
  Target,
  CheckCircle,
  AlertTriangle,
  Eye,
  BarChart,
  LineChart
} from "lucide-react"
import { PageLoading } from "@/components/ui/page-loading"

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

interface ReportData {
  overview: {
    totalRequests: number
    activePrograms: number
    completedPrograms: number
    totalMentors: number
    avgCompletionTime: number
    successRate: number
  }
  departmental: {
    [key: string]: {
      requests: number
      mentors: number
      completionRate: number
    }
  }
  performance: {
    topMentors: Array<{
      name: string
      department: string
      totalMentored: number
      rating: number
      completionRate: number
    }>
    programEffectiveness: Array<{
      program: string
      participants: number
      completionRate: number
      avgRating: number
    }>
  }
  trends: {
    monthlyRequests: Array<{
      month: string
      requests: number
      completions: number
    }>
    departmentGrowth: Array<{
      department: string
      growth: number
    }>
  }
}

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [reportType, setReportType] = useState("overview")
  const [dateRange, setDateRange] = useState("last_30_days")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadReportData(parsedUser)
    setIsLoading(false)
  }, [router])

  const loadReportData = (currentUser: User) => {
    // Mock data - role-filtered based on permissions
    const mockData: ReportData = {
      overview: {
        totalRequests: 156,
        activePrograms: 42,
        completedPrograms: 89,
        totalMentors: 28,
        avgCompletionTime: 45, // days
        successRate: 94.2
      },
      departmental: {
        "Information Technology": { requests: 45, mentors: 8, completionRate: 96.5 },
        "Engineering": { requests: 38, mentors: 7, completionRate: 91.2 },
        "Operations": { requests: 35, mentors: 6, completionRate: 89.8 },
        "Finance": { requests: 22, mentors: 4, completionRate: 95.1 },
        "Human Resources": { requests: 16, mentors: 3, completionRate: 87.5 }
      },
      performance: {
        topMentors: [
          { name: "Dr. Kavita Sharma", department: "Engineering", totalMentored: 22, rating: 4.9, completionRate: 95.5 },
          { name: "Rajesh Kumar", department: "Operations", totalMentored: 18, rating: 4.7, completionRate: 88.9 },
          { name: "Vikram Gupta", department: "Information Technology", totalMentored: 15, rating: 4.8, completionRate: 93.3 },
          { name: "Anita Patel", department: "Finance", totalMentored: 8, rating: 4.6, completionRate: 100.0 },
          { name: "Suresh Reddy", department: "Information Technology", totalMentored: 12, rating: 4.5, completionRate: 91.7 }
        ],
        programEffectiveness: [
          { program: "Summer Internship 2024", participants: 45, completionRate: 95.6, avgRating: 4.7 },
          { program: "Technical Training", participants: 32, completionRate: 90.6, avgRating: 4.5 },
          { program: "Research Project", participants: 28, completionRate: 89.3, avgRating: 4.6 },
          { program: "Industrial Training", participants: 25, completionRate: 92.0, avgRating: 4.4 },
          { program: "Project Work", participants: 26, completionRate: 88.5, avgRating: 4.3 }
        ]
      },
      trends: {
        monthlyRequests: [
          { month: "Oct 2024", requests: 32, completions: 28 },
          { month: "Nov 2024", requests: 38, completions: 35 },
          { month: "Dec 2024", requests: 42, completions: 39 },
          { month: "Jan 2024", requests: 44, completions: 42 }
        ],
        departmentGrowth: [
          { department: "Information Technology", growth: 15.2 },
          { department: "Engineering", growth: 8.7 },
          { department: "Operations", growth: 12.3 },
          { department: "Finance", growth: 5.9 },
          { department: "Human Resources", growth: 3.2 }
        ]
      }
    }

    // Filter data based on user role
    if (currentUser.role === "Department HoD") {
      // Limit to user's department only
      const userDept = currentUser.department
      mockData.departmental = {
        [userDept]: mockData.departmental[userDept] || { requests: 0, mentors: 0, completionRate: 0 }
      }
      mockData.performance.topMentors = mockData.performance.topMentors.filter(m => m.department === userDept)
      mockData.trends.departmentGrowth = mockData.trends.departmentGrowth.filter(d => d.department === userDept)
    } else if (currentUser.role === "Mentor") {
      // Limited view for mentors - only their own performance data
      mockData.performance.topMentors = mockData.performance.topMentors.filter(m => 
        m.name === `${currentUser.firstName} ${currentUser.lastName}`
      )
    }

    setReportData(mockData)
  }

  const getAvailableReportTypes = () => {
    const baseTypes = [
      { value: "overview", label: "Overview", icon: BarChart3 }
    ]

    switch (user?.role) {
      case "L&D Coordinator":
        return [
          ...baseTypes,
          { value: "departmental", label: "Departmental Analysis", icon: Building },
          { value: "performance", label: "Performance Metrics", icon: Award },
          { value: "trends", label: "Trends & Analytics", icon: TrendingUp },
          { value: "coordination", label: "Coordination Reports", icon: Users }
        ]
      case "L&D HoD":
        return [
          ...baseTypes,
          { value: "departmental", label: "Departmental Analysis", icon: Building },
          { value: "performance", label: "Performance Metrics", icon: Award },
          { value: "trends", label: "Trends & Analytics", icon: TrendingUp },
          { value: "executive", label: "Executive Summary", icon: FileText },
          { value: "strategic", label: "Strategic Insights", icon: Target }
        ]
      case "Department HoD":
        return [
          ...baseTypes,
          { value: "departmental", label: "Department Performance", icon: Building },
          { value: "mentors", label: "Mentor Performance", icon: Users },
          { value: "capacity", label: "Capacity Analysis", icon: Activity }
        ]
      case "Mentor":
        return [
          { value: "personal", label: "My Performance", icon: Award },
          { value: "trainees", label: "Trainee Progress", icon: Users }
        ]
      default:
        return baseTypes
    }
  }

  const getPageTitle = () => {
    switch (user?.role) {
      case "L&D Coordinator":
        return "Coordination Reports"
      case "L&D HoD":
        return "Executive Reports & Analytics"
      case "Department HoD":
        return `${user.department} Department Reports`
      case "Mentor":
        return "My Performance Reports"
      default:
        return "Reports"
    }
  }

  const getPageDescription = () => {
    switch (user?.role) {
      case "L&D Coordinator":
        return "Comprehensive reports for coordination and monitoring across all programs"
      case "L&D HoD":
        return "Strategic insights and executive-level analytics for decision making"
      case "Department HoD":
        return "Performance metrics and analytics for your department"
      case "Mentor":
        return "Track your mentoring performance and trainee progress"
      default:
        return "View reports and analytics"
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const canExportReports = () => {
    return ["L&D Coordinator", "L&D HoD", "Department HoD"].includes(user?.role || "")
  }

  const canViewExecutiveReports = () => {
    return ["L&D HoD"].includes(user?.role || "")
  }

  const canViewAllDepartments = () => {
    return ["L&D Coordinator", "L&D HoD"].includes(user?.role || "")
  }

  if (isLoading) {
    return <PageLoading message="Loading reports..." />
  }

  if (!user || !reportData) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Role-based Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-gray-600 mt-1">{getPageDescription()}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="px-3 py-1">
              {user.role}
            </Badge>
            {canExportReports() && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => loadReportData(user)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Role-specific Alerts */}
        {user.role === "L&D HoD" && (
          <Alert className="border-purple-200 bg-purple-50">
            <Target className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-700">
              <strong>Executive Access:</strong> Access to strategic insights, cross-departmental analytics, and executive summary reports.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "L&D Coordinator" && (
          <Alert className="border-blue-200 bg-blue-50">
            <Activity className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Coordination Dashboard:</strong> Monitor program coordination effectiveness and cross-departmental performance metrics.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "Department HoD" && (
          <Alert className="border-green-200 bg-green-50">
            <Building className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Department Focus:</strong> Reports are filtered to show only {user.department} department data and metrics.
            </AlertDescription>
          </Alert>
        )}

        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableReportTypes().map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <type.icon className="h-4 w-4 mr-2" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                    <SelectItem value="last_year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {canViewAllDepartments() && (
                <div>
                  <Label>Department</Label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={generateReport} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
              {canExportReports() && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export to PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalRequests}</p>
                  <p className="text-xs text-green-600 mt-1">↗ +12.3% from last month</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Programs</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.overview.activePrograms}</p>
                  <p className="text-xs text-blue-600 mt-1">Currently running</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.overview.successRate}%</p>
                  <p className="text-xs text-green-600 mt-1">↗ +2.1% improvement</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.overview.avgCompletionTime} days</p>
                  <p className="text-xs text-orange-600 mt-1">Target: 45 days</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Content */}
        <Tabs value={reportType} onValueChange={setReportType}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {getAvailableReportTypes().slice(0, 4).map(type => (
              <TabsTrigger key={type.value} value={type.value}>
                <type.icon className="h-4 w-4 mr-2" />
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Departmental Performance */}
              {canViewAllDepartments() && (
                <Card>
                  <CardHeader>
                    <CardTitle>Departmental Performance</CardTitle>
                    <CardDescription>Performance metrics by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(reportData.departmental).map(([dept, data]) => (
                        <div key={dept} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{dept}</p>
                            <p className="text-sm text-gray-600">{data.requests} requests • {data.mentors} mentors</p>
                          </div>
                          <Badge className={data.completionRate >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {data.completionRate}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {user.role === "Mentor" ? "My Performance" : "Top Performing Mentors"}
                  </CardTitle>
                  <CardDescription>
                    {user.role === "Mentor" ? "Your mentoring statistics" : "Highest rated mentors by performance"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.performance.topMentors.slice(0, 5).map((mentor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{mentor.name}</p>
                          <p className="text-sm text-gray-600">{mentor.department} • {mentor.totalMentored} mentored</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">★ {mentor.rating}</p>
                          <p className="text-sm text-gray-600">{mentor.completionRate}% completion</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="departmental" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {user.role === "Department HoD" ? `${user.department} Department Analysis` : "Departmental Analysis"}
                </CardTitle>
                <CardDescription>Detailed breakdown by department</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Total Requests</TableHead>
                      <TableHead>Active Mentors</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Avg Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(reportData.departmental).map(([dept, data]) => (
                      <TableRow key={dept}>
                        <TableCell className="font-medium">{dept}</TableCell>
                        <TableCell>{data.requests}</TableCell>
                        <TableCell>{data.mentors}</TableCell>
                        <TableCell>
                          <Badge className={data.completionRate >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {data.completionRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>4.6</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Program Effectiveness</CardTitle>
                  <CardDescription>Performance metrics by program type</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Program</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Completion Rate</TableHead>
                        <TableHead>Avg Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.performance.programEffectiveness.map((program, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{program.program}</TableCell>
                          <TableCell>{program.participants}</TableCell>
                          <TableCell>
                            <Badge className={program.completionRate >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {program.completionRate}%
                            </Badge>
                          </TableCell>
                          <TableCell>★ {program.avgRating}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mentor Performance Trends</CardTitle>
                  <CardDescription>Monthly performance comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.trends.monthlyRequests.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{trend.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{trend.requests} requests</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {((trend.completions / trend.requests) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Department-wise growth analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.trends.departmentGrowth.map((growth, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{growth.department}</span>
                      <Badge className={growth.growth >= 10 ? "bg-green-100 text-green-800" : growth.growth >= 5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                        {growth.growth > 0 ? "+" : ""}{growth.growth}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentor-specific tabs */}
          {user.role === "Mentor" && (
            <>
              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Performance Metrics</CardTitle>
                    <CardDescription>Your mentoring performance and statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">15</p>
                        <p className="text-sm text-gray-600">Total Mentored</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">93.3%</p>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">4.8</p>
                        <p className="text-sm text-gray-600">Average Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trainees" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Trainees Progress</CardTitle>
                    <CardDescription>Progress tracking for your assigned trainees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Arjun Reddy</p>
                          <p className="text-sm text-gray-600">Software Development Internship</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">75% Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Ananya Iyer</p>
                          <p className="text-sm text-gray-600">Industrial Training</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">90% Complete</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}