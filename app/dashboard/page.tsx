"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Clock, CheckCircle, TrendingUp, Plus, Search, Filter, Download } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { RecentActivity } from "@/components/recent-activity"
import { RequestsTable } from "@/components/requests-table"

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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const stats = [
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

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>

          {/* Requests Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Requests</CardTitle>
                    <CardDescription>Latest internship requests and their status</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
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

        {/* Detailed Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Overview</CardTitle>
            <CardDescription>Comprehensive view of all system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="requests" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="mentors">Mentors</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-4">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Request Management</h3>
                  <p className="text-gray-600 mb-4">View and manage all internship requests</p>
                  <Button>View All Requests</Button>
                </div>
              </TabsContent>

              <TabsContent value="mentors" className="space-y-4">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mentor Management</h3>
                  <p className="text-gray-600 mb-4">Assign and manage mentors for trainees</p>
                  <Button>Manage Mentors</Button>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Reports</h3>
                  <p className="text-gray-600 mb-4">Track trainee progress and performance</p>
                  <Button>View Reports</Button>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics & Insights</h3>
                  <p className="text-gray-600 mb-4">Comprehensive analytics and reporting</p>
                  <Button>View Analytics</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
