"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  UserCheck, 
  UserX, 
  Settings, 
  Database, 
  Shield, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Mail,
  Plus
} from "lucide-react"

export function AdminDashboard() {
  const systemStats = {
    totalUsers: 156,
    activeUsers: 142,
    pendingRequests: 8,
    systemHealth: 98.5,
    storageUsed: 65,
    emailsSent: 234
  }

  const recentActivities = [
    { type: "USER_CREATED", message: "New user account created for Ananya Iyer", time: "2 minutes ago" },
    { type: "REQUEST_APPROVED", message: "Access request approved for Rohit Mehta", time: "15 minutes ago" },
    { type: "SYSTEM_UPDATE", message: "Database backup completed successfully", time: "1 hour ago" },
    { type: "EMAIL_SENT", message: "Welcome email sent to 3 new users", time: "2 hours ago" },
    { type: "USER_LOGIN", message: "L&D HoD logged in from new device", time: "3 hours ago" }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "USER_CREATED":
        return <UserCheck className="h-4 w-4 text-green-600" />
      case "REQUEST_APPROVED":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "SYSTEM_UPDATE":
        return <Settings className="h-4 w-4 text-purple-600" />
      case "EMAIL_SENT":
        return <Mail className="h-4 w-4 text-orange-600" />
      case "USER_LOGIN":
        return <Activity className="h-4 w-4 text-gray-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Admin Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">↗ +12 this month</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeUsers}</p>
                <p className="text-xs text-blue-600 mt-1">{((systemStats.activeUsers/systemStats.totalUsers)*100).toFixed(1)}% active</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.pendingRequests}</p>
                <p className="text-xs text-orange-600 mt-1">Needs attention</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.systemHealth}%</p>
                <p className="text-xs text-green-600 mt-1">All systems operational</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Key metrics and system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm text-gray-600">{systemStats.storageUsed}% of 100GB</span>
              </div>
              <Progress value={systemStats.storageUsed} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Database</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Healthy</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Email Service</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">{systemStats.emailsSent} sent today</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button size="sm" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                System Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Create User
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <UserCheck className="h-6 w-6 mb-2" />
              Manage Roles
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              System Config
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Access Requests Alert */}
      {systemStats.pendingRequests > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium text-orange-800">
                    {systemStats.pendingRequests} access requests pending approval
                  </p>
                  <p className="text-sm text-orange-600">
                    Review and process pending user access requests
                  </p>
                </div>
              </div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Review Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
