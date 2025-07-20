"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Clock, CheckCircle, TrendingUp, Plus, Search, Filter, Download, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { RecentActivity } from "@/components/recent-activity"
import { RequestsTable } from "@/components/requests-table"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Role-based stats and content
  const getRoleBasedStats = () => {
    const baseStats = [
      {
        title: "Total Requests",
        value: "24",
        change: "+12%",
        trend: "up" as const,
        icon: FileText,
        description: "This month",
      },
      {
        title: "Active Internships",
        value: "18",
        change: "+8%",
        trend: "up" as const,
        icon: Users,
        description: "Currently ongoing",
      },
      {
        title: "Pending Approvals",
        value: "6",
        change: "-15%",
        trend: "down" as const,
        icon: Clock,
        description: "Awaiting action",
      },
      {
        title: "Completed",
        value: "42",
        change: "+23%",
        trend: "up" as const,
        icon: CheckCircle,
        description: "This quarter",
      },
    ]

    // Customize stats based on user role
    if (user.role === "L&D HoD") {
      baseStats[1].value = "35"
      baseStats[2].value = "12"
      baseStats[3].value = "89"
    } else if (user.role === "Department HoD") {
      baseStats[0].value = "8"
      baseStats[1].value = "6"
      baseStats[2].value = "2"
      baseStats[3].value = "15"
    }

    return baseStats
  }

  const stats = getRoleBasedStats()

  const getRoleBasedWelcomeMessage = () => {
    switch (user.role) {
      case "L&D HoD":
        return "You have oversight of all training programs across IOCL."
      case "L&D Coordinator":
        return "You can manage and coordinate trainee programs in your department."
      case "Department HoD":
        return "You can approve requests and manage trainees in your department."
      default:
        return "Welcome to the TAMS dashboard."
    }
  }

  const getRoleCapabilities = () => {
    const capabilities = []
    
    if (user.role === "L&D HoD") {
      capabilities.push(
        "✓ View all trainee requests across departments",
        "✓ Final approval authority for all programs",
        "✓ Generate enterprise-wide reports",
        "✓ Manage system settings and user permissions"
      )
    } else if (user.role === "L&D Coordinator") {
      capabilities.push(
        "✓ Process and review trainee applications",
        "✓ Assign mentors to trainees",
        "✓ Track program progress and performance",
        "✓ Generate departmental reports"
      )
    } else if (user.role === "Department HoD") {
      capabilities.push(
        "✓ Approve requests for your department",
        "✓ View departmental trainee statistics",
        "✓ Access trainee progress reports",
        "✓ Manage department-specific settings"
      )
    }

    return capabilities
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
            <p className="text-sm text-gray-500 mt-1">{getRoleBasedWelcomeMessage()}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Role-based alert */}
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Your Role: {user.role}</strong> - You have access to role-specific features and data relevant to your department.
          </AlertDescription>
        </Alert>

        {/* Stats Grid - Responsive */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Role Capabilities */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-900">Your Access & Capabilities</CardTitle>
            <CardDescription>Based on your role: {user.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Current Permissions:</h4>
                <ul className="space-y-2">
                  {getRoleCapabilities().map((capability, index) => (
                    <li key={index} className="text-sm text-gray-600">{capability}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions:</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Requests
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Trainees
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid - Responsive */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>

          {/* Requests Overview */}
          <div className="lg:col-span-2">
            <Card className="border-red-100">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-red-900">Recent Requests</CardTitle>
                    <CardDescription>Latest internship requests and their status</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RequestsTable />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Tabs - Responsive */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-900">System Overview</CardTitle>
            <CardDescription>Comprehensive view of all TAMS activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="requests" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="requests" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">Requests</TabsTrigger>
                <TabsTrigger value="mentors" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">Mentors</TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">Reports</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-4 mt-6">
                <div className="text-center py-8">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Request Management</h3>
                  <p className="text-gray-600 mb-4">View and manage all internship requests based on your role</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">View All Requests</Button>
                </div>
              </TabsContent>

              <TabsContent value="mentors" className="space-y-4 mt-6">
                <div className="text-center py-8">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mentor Management</h3>
                  <p className="text-gray-600 mb-4">Assign and manage mentors for trainees in your scope</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">Manage Mentors</Button>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4 mt-6">
                <div className="text-center py-8">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Reports</h3>
                  <p className="text-gray-600 mb-4">Track trainee progress and generate performance reports</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">View Reports</Button>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 mt-6">
                <div className="text-center py-8">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics & Insights</h3>
                  <p className="text-gray-600 mb-4">Comprehensive analytics and strategic insights</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">View Analytics</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
