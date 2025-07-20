"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { RequestsTable } from "@/components/dashboard/requests-table"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, Clock, TrendingUp, Plus, Download } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalRequests: number
  activeInternships: number
  pendingApprovals: number
  completionRate: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    activeInternships: 0,
    pendingApprovals: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // Fallback to mock data
        setStats({
          totalRequests: 128,
          activeInternships: 45,
          pendingApprovals: 23,
          completionRate: 94,
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      // Fallback to mock data
      setStats({
        totalRequests: 128,
        activeInternships: 45,
        pendingApprovals: 23,
        completionRate: 94,
      })
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "Total Requests",
      value: stats.totalRequests.toString(),
      change: "+12%",
      trend: "up" as const,
      icon: FileText,
      description: "from last month",
    },
    {
      title: "Active Internships",
      value: stats.activeInternships.toString(),
      change: "+8%",
      trend: "up" as const,
      icon: Users,
      description: "currently ongoing",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals.toString(),
      change: "-5%",
      trend: "down" as const,
      icon: Clock,
      description: "awaiting review",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      change: "+2%",
      trend: "up" as const,
      icon: TrendingUp,
      description: "this quarter",
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your internship programs today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/requests/new">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </Link>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts */}
        <DashboardCharts />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Requests Table */}
          <div className="lg:col-span-2">
            <Card className="border-orange-200 shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-red-700">Recent Requests</CardTitle>
                    <CardDescription>Latest internship requests submitted</CardDescription>
                  </div>
                  <Link href="/requests">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <RequestsTable />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
