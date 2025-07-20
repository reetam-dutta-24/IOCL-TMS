"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Database,
  Mail,
  MessageSquare,
  FileText,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [systemConfig, setSystemConfig] = useState({
    maxInternshipDuration: "180",
    mentorCapacityLimit: "3",
    notificationEmailEnabled: "true",
    notificationSmsEnabled: "true",
    autoLetterGeneration: "true",
  })
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeRequests: 0,
    systemHealth: "healthy",
    lastBackup: "",
  })

  useEffect(() => {
    fetchSystemConfig()
    fetchSystemStats()
  }, [])

  const fetchSystemConfig = async () => {
    try {
      const response = await fetch("/api/admin/config")
      if (response.ok) {
        const data = await response.json()
        setSystemConfig(data)
      }
    } catch (error) {
      console.error("Failed to fetch system config:", error)
    }
  }

  const fetchSystemStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setSystemStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch system stats:", error)
    }
  }

  const updateSystemConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(systemConfig),
      })

      if (response.ok) {
        toast({
          title: "Configuration Updated",
          description: "System configuration has been updated successfully.",
        })
      } else {
        throw new Error("Failed to update configuration")
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update system configuration.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testEmailService = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Email Test Successful",
          description: "Test email sent successfully.",
        })
      } else {
        throw new Error("Email test failed")
      }
    } catch (error) {
      toast({
        title: "Email Test Failed",
        description: "Failed to send test email.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testSMSService = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/test-sms", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "SMS Test Successful",
          description: "Test SMS sent successfully.",
        })
      } else {
        throw new Error("SMS test failed")
      }
    } catch (error) {
      toast({
        title: "SMS Test Failed",
        description: "Failed to send test SMS.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Check if user has admin permissions
  if (session?.user?.role !== "L&D HoD") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert variant="destructive" className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertDescription>You don't have permission to access the admin panel.</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
            <p className="text-gray-600">Manage system configuration and monitor health</p>
          </div>
          <Badge variant={systemStats.systemHealth === "healthy" ? "default" : "destructive"}>
            System {systemStats.systemHealth}
          </Badge>
        </div>

        {/* System Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeRequests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {systemStats.systemHealth === "healthy" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm font-medium capitalize">{systemStats.systemHealth}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">{systemStats.lastBackup || "Never"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="configuration" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure system-wide settings and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxDuration">Maximum Internship Duration (Days)</Label>
                    <Input
                      id="maxDuration"
                      type="number"
                      value={systemConfig.maxInternshipDuration}
                      onChange={(e) => setSystemConfig((prev) => ({ ...prev, maxInternshipDuration: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentorCapacity">Mentor Capacity Limit</Label>
                    <Input
                      id="mentorCapacity"
                      type="number"
                      value={systemConfig.mentorCapacityLimit}
                      onChange={(e) => setSystemConfig((prev) => ({ ...prev, mentorCapacityLimit: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <Select
                      value={systemConfig.notificationEmailEnabled}
                      onValueChange={(value) =>
                        setSystemConfig((prev) => ({ ...prev, notificationEmailEnabled: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <Select
                      value={systemConfig.notificationSmsEnabled}
                      onValueChange={(value) => setSystemConfig((prev) => ({ ...prev, notificationSmsEnabled: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={updateSystemConfig} disabled={loading} className="iocl-button-primary">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Configuration"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Service
                  </CardTitle>
                  <CardDescription>AWS SES integration for email notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <Button
                      onClick={testEmailService}
                      disabled={loading}
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                      Test Email Service
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    SMS Service
                  </CardTitle>
                  <CardDescription>Twilio integration for SMS notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <Button
                      onClick={testSMSService}
                      disabled={loading}
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <MessageSquare className="mr-2 h-4 w-4" />
                      )}
                      Test SMS Service
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    DocuSign
                  </CardTitle>
                  <CardDescription>Digital signature integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge variant="secondary">Configured</Badge>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <FileText className="mr-2 h-4 w-4" />
                      Test DocuSign
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    File Storage
                  </CardTitle>
                  <CardDescription>AWS S3 integration for file storage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Database className="mr-2 h-4 w-4" />
                      Test File Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">User management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>View system audit trail and activity logs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Audit log viewer coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>Database maintenance and system cleanup</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Maintenance tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
