"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Clock, CheckCircle, TrendingUp, Plus, Download } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { RequestsTable } from "@/components/dashboard/requests-table"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { useNotifications } from "@/hooks/use-notifications"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeInternships: 0,
    pendingApprovals: 0,
    completed: 0,
  })
  const { notifications } = useNotifications()

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const statsCards = [
    {
      title: "Total Requests",
      value: stats.totalRequests.toString(),
      change: "+12%",
      trend: "up" as const,
      icon: FileText,
      description: "This month",
    },
    {
      title: "Active Internships",
      value: stats.activeInternships.toString(),
      change: "+8%",
      trend: "up" as const,
      icon: Users,
      description: "Currently ongoing",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals.toString(),
      change: "-15%",
      trend: "down" as const,
      icon: Clock,
      description: "Awaiting action",
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      change: "+23%",
      trend: "up" as const,
      icon: CheckCircle,
      description: "This quarter",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.user?.name}</p>
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
          {statsCards.map((stat, index) => (
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
                </div>
              </CardHeader>
              <CardContent>
                <RequestsTable />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts and Analytics */}
        <DashboardCharts />

        {/* Detailed Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
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
