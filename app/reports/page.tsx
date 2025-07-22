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
  RefreshCw
} from "lucide-react"

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

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reports, setReports] = useState({
    totalInterns: 0,
    activeRequests: 0,
    completedPrograms: 0,
    totalMentors: 0
  })
  const [reportType, setReportType] = useState("overview")
  const [dateRange, setDateRange] = useState("30days")
  const [department, setDepartment] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Load report data
    loadReportData()
    setIsLoading(false)
  }, [router])

  const loadReportData = async () => {
    try {
      // Simulate API call for reports data
      setReports({
        totalInterns: 245,
        activeRequests: 23,
        completedPrograms: 187,
        totalMentors: 45
      })
    } catch (error) {
      console.error("Failed to load report data:", error)
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation
    setTimeout(() => {
      const reportData = {
        type: reportType,
        dateRange,
        department,
        generatedAt: new Date().toISOString(),
        data: reports
      }
      
      // Create and download CSV
      const csvContent = convertToCSV(reportData)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `IOCL_TAMS_Report_${reportType}_${Date.now()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setIsGenerating(false)
    }, 2000)
  }

  const convertToCSV = (data: any) => {
    const headers = ['Metric', 'Value', 'Generated At']
    const rows = [
      ['Total Interns', data.data.totalInterns, data.generatedAt],
      ['Active Requests', data.data.activeRequests, data.generatedAt],
      ['Completed Programs', data.data.completedPrograms, data.generatedAt],
      ['Total Mentors', data.data.totalMentors, data.generatedAt]
    ]
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const canViewReports = () => {
    if (!user) return false
    const allowedRoles = ['L&D Coordinator', 'L&D HoD', 'Department HoD', 'System Administrator']
    return allowedRoles.includes(user.role)
  }

  const canViewAllDepartments = () => {
    if (!user) return false
    const allowedRoles = ['L&D Coordinator', 'L&D HoD', 'System Administrator']
    return allowedRoles.includes(user.role)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!canViewReports()) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don't have permission to view reports.</p>
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights and data analysis</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={loadReportData}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={generateReport}
              disabled={isGenerating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Generate Report
            </Button>
          </div>
        </div>

        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="internships">Internship Analysis</SelectItem>
                    <SelectItem value="mentors">Mentor Performance</SelectItem>
                    <SelectItem value="departments">Department Wise</SelectItem>
                    {user.role === 'System Administrator' && (
                      <SelectItem value="system">System Usage</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dateRange">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {canViewAllDepartments() && (
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Interns</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.totalInterns}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.activeRequests}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Programs</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.completedPrograms}</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mentors</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.totalMentors}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            {user.role === 'System Administrator' && (
              <TabsTrigger value="system">System</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  High-level metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Active Internship Requests</span>
                    <Badge variant="secondary">{reports.activeRequests}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Program Completion Rate</span>
                    <Badge className="bg-green-100 text-green-800">
                      {Math.round((reports.completedPrograms / reports.totalInterns) * 100)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Mentor Utilization</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {Math.round((reports.totalInterns / reports.totalMentors))} interns/mentor
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internships" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Internship Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of internship programs and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Internship analysis data will be displayed here based on selected filters.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Performance</CardTitle>
                <CardDescription>
                  Mentor effectiveness and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Mentor performance data will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Analysis</CardTitle>
                <CardDescription>
                  Department-wise breakdown and comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Department analysis data will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {user.role === 'System Administrator' && (
            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Usage</CardTitle>
                  <CardDescription>
                    System performance and usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">System usage data will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}