"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, TrendingUp, Users, BarChart3 } from "lucide-react"
import { format } from "date-fns"

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: undefined,
    to: undefined
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const reportTypes = [
    {
      id: "trainee-summary",
      title: "Trainee Summary Report",
      description: "Comprehensive overview of all trainees and their progress",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      features: ["Active trainees", "Completion rates", "Performance metrics"]
    },
    {
      id: "department-analysis",
      title: "Department Analysis",
      description: "Detailed analysis by department and training programs",
      icon: BarChart3,
      color: "bg-green-100 text-green-600",
      features: ["Department breakdown", "Resource utilization", "Training effectiveness"]
    },
    {
      id: "mentor-performance",
      title: "Mentor Performance Report",
      description: "Evaluate mentor effectiveness and trainee satisfaction",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      features: ["Mentor ratings", "Trainee feedback", "Assignment history"]
    },
    {
      id: "compliance-audit",
      title: "Compliance Audit Report",
      description: "Regulatory compliance and documentation status",
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
      features: ["Compliance status", "Missing documents", "Audit trails"]
    }
  ]

  const quickStats = [
    { label: "Total Reports Generated", value: "247", change: "+15%" },
    { label: "This Month", value: "32", change: "+8%" },
    { label: "Pending Reviews", value: "5", change: "-2%" },
    { label: "Compliance Rate", value: "98.5%", change: "+1.2%" }
  ]

  const recentReports = [
    {
      id: 1,
      name: "Monthly Trainee Summary - January 2024",
      type: "Trainee Summary",
      generatedBy: "System",
      date: "2024-01-31",
      status: "Completed",
      size: "2.3 MB"
    },
    {
      id: 2,
      name: "Q4 2023 Department Analysis",
      type: "Department Analysis",
      generatedBy: "Rajesh Kumar",
      date: "2024-01-15",
      status: "Completed",
      size: "5.1 MB"
    },
    {
      id: 3,
      name: "Mentor Performance Review - December",
      type: "Mentor Performance",
      generatedBy: "Priya Sharma",
      date: "2024-01-10",
      status: "Completed",
      size: "1.8 MB"
    }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Generate and download comprehensive system reports</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Custom Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Generator */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-900">Generate New Report</CardTitle>
            <CardDescription>Create custom reports with specific parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Report Type</label>
                <Select>
                  <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trainee-summary">Trainee Summary</SelectItem>
                    <SelectItem value="department-analysis">Department Analysis</SelectItem>
                    <SelectItem value="mentor-performance">Mentor Performance</SelectItem>
                    <SelectItem value="compliance-audit">Compliance Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          `${format(dateRange.from, "LLL dd")} - ${format(dateRange.to, "LLL dd, y")}`
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Pick a date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Format</label>
                <Select defaultValue="pdf">
                  <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="grid gap-6 md:grid-cols-2">
          {reportTypes.map((report) => (
            <Card key={report.id} className="border-red-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${report.color}`}>
                    <report.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-gray-900">{report.title}</CardTitle>
                    <CardDescription className="mt-1">{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {report.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-900">Recent Reports</CardTitle>
            <CardDescription>Previously generated reports available for download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Type: {report.type}</span>
                        <span>By: {report.generatedBy}</span>
                        <span>Date: {new Date(report.date).toLocaleDateString()}</span>
                        <span>Size: {report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {report.status}
                    </span>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}