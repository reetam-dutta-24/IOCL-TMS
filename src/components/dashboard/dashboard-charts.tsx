"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react"

interface ChartData {
  monthlyRequests: { month: string; requests: number; approved: number }[]
  departmentDistribution: { department: string; count: number; percentage: number }[]
  statusBreakdown: { status: string; count: number; color: string }[]
}

export function DashboardCharts() {
  const [chartData, setChartData] = useState<ChartData>({
    monthlyRequests: [],
    departmentDistribution: [],
    statusBreakdown: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    try {
      const response = await fetch("/api/dashboard/charts")
      if (response.ok) {
        const data = await response.json()
        setChartData(data)
      } else {
        // Fallback to mock data
        setChartData({
          monthlyRequests: [
            { month: "Jan", requests: 45, approved: 38 },
            { month: "Feb", requests: 52, approved: 47 },
            { month: "Mar", requests: 48, approved: 44 },
            { month: "Apr", requests: 61, approved: 58 },
            { month: "May", requests: 55, approved: 51 },
            { month: "Jun", requests: 67, approved: 63 },
          ],
          departmentDistribution: [
            { department: "IT", count: 45, percentage: 35 },
            { department: "Engineering", count: 32, percentage: 25 },
            { department: "R&D", count: 28, percentage: 22 },
            { department: "Operations", count: 23, percentage: 18 },
          ],
          statusBreakdown: [
            { status: "Approved", count: 85, color: "bg-green-500" },
            { status: "Under Review", count: 23, color: "bg-yellow-500" },
            { status: "Submitted", count: 15, color: "bg-blue-500" },
            { status: "Rejected", count: 5, color: "bg-red-500" },
          ],
        })
      }
    } catch (error) {
      console.error("Error fetching chart data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-orange-200">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Monthly Requests Chart */}
      <Card className="border-orange-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-red-700 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Monthly Requests
              </CardTitle>
              <CardDescription>Requests submitted vs approved</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chartData.monthlyRequests.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">{data.requests}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">{data.approved}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Distribution */}
      <Card className="border-orange-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Department Distribution
          </CardTitle>
          <CardDescription>Internships by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chartData.departmentDistribution.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-sm text-gray-500">{dept.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="border-orange-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Status Breakdown
          </CardTitle>
          <CardDescription>Current request statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chartData.statusBreakdown.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{status.status}</span>
                </div>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  {status.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
