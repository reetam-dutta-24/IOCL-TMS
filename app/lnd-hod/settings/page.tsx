"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Shield, 
  Users, 
  Clock, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Loader2,
  AlertCircle,
  Bell,
  Database,
  Globe,
  Lock,
  Target,
  BarChart3,
  Calendar,
  Mail
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

interface PolicySettings {
  maxMentorCapacity: number
  minMentorCapacity: number
  maxInternshipDuration: number
  minInternshipDuration: number
  autoApprovalThreshold: number
  qualityScoreThreshold: number
  budgetWarningThreshold: number
  resourceUtilizationThreshold: number
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  qualityAlerts: boolean
  budgetAlerts: boolean
  resourceAlerts: boolean
  policyViolations: boolean
  weeklyReports: boolean
  monthlyReports: boolean
}

interface WorkflowSettings {
  requireMentorApproval: boolean
  requireBudgetApproval: boolean
  enableAutoAssignment: boolean
  enableQualityMonitoring: boolean
  enableComplianceChecks: boolean
  escalationTimeout: number
  reviewReminders: boolean
}

interface SystemSettings {
  systemName: string
  organizationName: string
  timezone: string
  language: string
  dateFormat: string
  currencyFormat: string
  sessionTimeout: number
  dataRetentionPeriod: number
}

export default function LnDHoDSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  
  const [policySettings, setPolicySettings] = useState<PolicySettings>({
    maxMentorCapacity: 4,
    minMentorCapacity: 1,
    maxInternshipDuration: 180,
    minInternshipDuration: 30,
    autoApprovalThreshold: 85,
    qualityScoreThreshold: 70,
    budgetWarningThreshold: 80,
    resourceUtilizationThreshold: 90
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    qualityAlerts: true,
    budgetAlerts: true,
    resourceAlerts: true,
    policyViolations: true,
    weeklyReports: true,
    monthlyReports: true
  })

  const [workflowSettings, setWorkflowSettings] = useState<WorkflowSettings>({
    requireMentorApproval: true,
    requireBudgetApproval: true,
    enableAutoAssignment: false,
    enableQualityMonitoring: true,
    enableComplianceChecks: true,
    escalationTimeout: 72,
    reviewReminders: true
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    systemName: "TAMS - L&D Management System",
    organizationName: "Indian Oil Corporation Limited",
    timezone: "Asia/Kolkata",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    currencyFormat: "INR",
    sessionTimeout: 60,
    dataRetentionPeriod: 2555
  })

  useEffect(() => {
    // Check authentication and L&D HoD role
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Check if user has L&D HoD privileges
    if (parsedUser.role !== 'L&D HoD') {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
    loadSettings()
    setIsLoading(false)
  }, [router])

  const loadSettings = async () => {
    try {
      // Load settings from API or localStorage
      const savedSettings = localStorage.getItem("lnd-hod-settings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setPolicySettings(settings.policy || policySettings)
        setNotificationSettings(settings.notifications || notificationSettings)
        setWorkflowSettings(settings.workflow || workflowSettings)
        setSystemSettings(settings.system || systemSettings)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const allSettings = {
        policy: policySettings,
        notifications: notificationSettings,
        workflow: workflowSettings,
        system: systemSettings,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.id
      }

      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem("lnd-hod-settings", JSON.stringify(allSettings))

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setMessage("Settings saved successfully!")
      setMessageType("success")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Failed to save settings:", error)
      setMessage("Failed to save settings. Please try again.")
      setMessageType("error")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading L&D HoD Settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">L&D System Configuration</h1>
            <p className="text-gray-600">Configure L&D policies, workflows, and system parameters</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gray-100 text-gray-800 px-3 py-1">
              <Settings className="h-4 w-4 mr-2" />
              System Configuration
            </Badge>
            <Button 
              onClick={saveSettings} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {message && (
          <Alert className={messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={messageType === "success" ? "text-green-700" : "text-red-700"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              L&D Policies
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Workflow Rules
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  L&D Policy Configuration
                </CardTitle>
                <CardDescription>
                  Configure organizational policies for internship programs and mentor management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Mentor Capacity Limits</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="maxMentorCapacity">Maximum Mentor Capacity</Label>
                        <Input
                          id="maxMentorCapacity"
                          type="number"
                          value={policySettings.maxMentorCapacity}
                          onChange={(e) => setPolicySettings({
                            ...policySettings,
                            maxMentorCapacity: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum number of trainees per mentor</p>
                      </div>
                      <div>
                        <Label htmlFor="minMentorCapacity">Minimum Mentor Capacity</Label>
                        <Input
                          id="minMentorCapacity"
                          type="number"
                          value={policySettings.minMentorCapacity}
                          onChange={(e) => setPolicySettings({
                            ...policySettings,
                            minMentorCapacity: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum number of trainees to maintain active status</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Program Duration Limits</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="maxInternshipDuration">Maximum Program Duration (days)</Label>
                        <Input
                          id="maxInternshipDuration"
                          type="number"
                          value={policySettings.maxInternshipDuration}
                          onChange={(e) => setPolicySettings({
                            ...policySettings,
                            maxInternshipDuration: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum allowed internship duration</p>
                      </div>
                      <div>
                        <Label htmlFor="minInternshipDuration">Minimum Program Duration (days)</Label>
                        <Input
                          id="minInternshipDuration"
                          type="number"
                          value={policySettings.minInternshipDuration}
                          onChange={(e) => setPolicySettings({
                            ...policySettings,
                            minInternshipDuration: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum required internship duration</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Quality Thresholds</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="qualityScoreThreshold">Minimum Quality Score (%)</Label>
                        <Input
                          id="qualityScoreThreshold"
                          type="number"
                          value={policySettings.qualityScoreThreshold}
                          onChange={(e) => setPolicySettings({
                            ...policySettings,
                            qualityScoreThreshold: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum acceptable quality score for program completion</p>
                      </div>
                      <div>
                        <Label htmlFor="autoApprovalThreshold">Auto-Approval Threshold (%)</Label>
                        <Input
                          id="autoApprovalThreshold"
                          type="number"
                          value={policySettings.autoApprovalThreshold}
                          onChange={(e) => setPolicySettings({
                            ...policySettings,
                            autoApprovalThreshold: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Quality score threshold for automatic program approval</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Resource Management</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="budgetWarningThreshold">Budget Warning Threshold (%)</Label>
                        <Input
                          id="budgetWarningThreshold"
                          type="number"
                          value={policySettings.budgetWarningThreshold}
                          onChange={(e) => setPolicySettings({
                            ...policySettings,
                            budgetWarningThreshold: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Budget utilization threshold to trigger warnings</p>
                      </div>
                      <div>
                        <Label htmlFor="resourceUtilizationThreshold">Resource Utilization Threshold (%)</Label>
                        <Input
                          id="resourceUtilizationThreshold"
                          type="number"
                          value={policySettings.resourceUtilizationThreshold}
                          onChange={(e) => setPolicySettings({
                            ...policySettings,
                            resourceUtilizationThreshold: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Resource utilization threshold for capacity warnings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Workflow Configuration
                </CardTitle>
                <CardDescription>
                  Configure approval workflows and automation rules for L&D processes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Approval Requirements</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="requireMentorApproval">Require Mentor Approval</Label>
                          <p className="text-xs text-gray-500">Require mentor confirmation before assigning trainees</p>
                        </div>
                        <Switch
                          id="requireMentorApproval"
                          checked={workflowSettings.requireMentorApproval}
                          onCheckedChange={(checked) => setWorkflowSettings({
                            ...workflowSettings,
                            requireMentorApproval: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="requireBudgetApproval">Require Budget Approval</Label>
                          <p className="text-xs text-gray-500">Require budget approval for program expenses</p>
                        </div>
                        <Switch
                          id="requireBudgetApproval"
                          checked={workflowSettings.requireBudgetApproval}
                          onCheckedChange={(checked) => setWorkflowSettings({
                            ...workflowSettings,
                            requireBudgetApproval: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Automation Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enableAutoAssignment">Enable Auto-Assignment</Label>
                          <p className="text-xs text-gray-500">Automatically assign mentors based on availability</p>
                        </div>
                        <Switch
                          id="enableAutoAssignment"
                          checked={workflowSettings.enableAutoAssignment}
                          onCheckedChange={(checked) => setWorkflowSettings({
                            ...workflowSettings,
                            enableAutoAssignment: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="reviewReminders">Review Reminders</Label>
                          <p className="text-xs text-gray-500">Send reminders for pending reviews</p>
                        </div>
                        <Switch
                          id="reviewReminders"
                          checked={workflowSettings.reviewReminders}
                          onCheckedChange={(checked) => setWorkflowSettings({
                            ...workflowSettings,
                            reviewReminders: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Quality & Compliance</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enableQualityMonitoring">Quality Monitoring</Label>
                          <p className="text-xs text-gray-500">Enable continuous quality monitoring</p>
                        </div>
                        <Switch
                          id="enableQualityMonitoring"
                          checked={workflowSettings.enableQualityMonitoring}
                          onCheckedChange={(checked) => setWorkflowSettings({
                            ...workflowSettings,
                            enableQualityMonitoring: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enableComplianceChecks">Compliance Checks</Label>
                          <p className="text-xs text-gray-500">Enable automated compliance verification</p>
                        </div>
                        <Switch
                          id="enableComplianceChecks"
                          checked={workflowSettings.enableComplianceChecks}
                          onCheckedChange={(checked) => setWorkflowSettings({
                            ...workflowSettings,
                            enableComplianceChecks: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Escalation Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="escalationTimeout">Escalation Timeout (hours)</Label>
                        <Input
                          id="escalationTimeout"
                          type="number"
                          value={workflowSettings.escalationTimeout}
                          onChange={(e) => setWorkflowSettings({
                            ...workflowSettings,
                            escalationTimeout: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Hours before escalating pending approvals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure notification settings for alerts, reports, and system updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Delivery Methods</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-xs text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                          <p className="text-xs text-gray-500">Receive critical alerts via SMS</p>
                        </div>
                        <Switch
                          id="smsNotifications"
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            smsNotifications: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Alert Types</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="qualityAlerts">Quality Alerts</Label>
                          <p className="text-xs text-gray-500">Quality score and compliance issues</p>
                        </div>
                        <Switch
                          id="qualityAlerts"
                          checked={notificationSettings.qualityAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            qualityAlerts: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="budgetAlerts">Budget Alerts</Label>
                          <p className="text-xs text-gray-500">Budget utilization and overruns</p>
                        </div>
                        <Switch
                          id="budgetAlerts"
                          checked={notificationSettings.budgetAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            budgetAlerts: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="resourceAlerts">Resource Alerts</Label>
                          <p className="text-xs text-gray-500">Capacity and availability issues</p>
                        </div>
                        <Switch
                          id="resourceAlerts"
                          checked={notificationSettings.resourceAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            resourceAlerts: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="policyViolations">Policy Violations</Label>
                          <p className="text-xs text-gray-500">Policy compliance violations</p>
                        </div>
                        <Switch
                          id="policyViolations"
                          checked={notificationSettings.policyViolations}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            policyViolations: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Reporting Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weeklyReports">Weekly Reports</Label>
                        <p className="text-xs text-gray-500">Receive weekly performance summaries</p>
                      </div>
                      <Switch
                        id="weeklyReports"
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          weeklyReports: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="monthlyReports">Monthly Reports</Label>
                        <p className="text-xs text-gray-500">Receive monthly strategic reports</p>
                      </div>
                      <Switch
                        id="monthlyReports"
                        checked={notificationSettings.monthlyReports}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          monthlyReports: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Configure general system settings and organizational parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Organization Information</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="systemName">System Name</Label>
                        <Input
                          id="systemName"
                          value={systemSettings.systemName}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            systemName: e.target.value
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="organizationName">Organization Name</Label>
                        <Input
                          id="organizationName"
                          value={systemSettings.organizationName}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            organizationName: e.target.value
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Localization Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({
                          ...systemSettings,
                          timezone: value
                        })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({
                          ...systemSettings,
                          language: value
                        })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Hindi">हिन्दी (Hindi)</SelectItem>
                            <SelectItem value="Bengali">বাংলা (Bengali)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Display Formats</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({
                          ...systemSettings,
                          dateFormat: value
                        })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="currencyFormat">Currency Format</Label>
                        <Select value={systemSettings.currencyFormat} onValueChange={(value) => setSystemSettings({
                          ...systemSettings,
                          currencyFormat: value
                        })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Security Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={systemSettings.sessionTimeout}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            sessionTimeout: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Auto-logout after inactivity</p>
                      </div>
                      <div>
                        <Label htmlFor="dataRetentionPeriod">Data Retention Period (days)</Label>
                        <Input
                          id="dataRetentionPeriod"
                          type="number"
                          value={systemSettings.dataRetentionPeriod}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            dataRetentionPeriod: parseInt(e.target.value) || 0
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">How long to retain completed program data</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks and system operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Database className="h-6 w-6 mb-2" />
                <span className="text-sm">Export Data</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-sm">Generate Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Mail className="h-6 w-6 mb-2" />
                <span className="text-sm">Test Notifications</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <RefreshCw className="h-6 w-6 mb-2" />
                <span className="text-sm">Reset Defaults</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and configuration status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <strong>System Health:</strong> All services operational
                </AlertDescription>
              </Alert>
              <Alert className="border-blue-200 bg-blue-50">
                <Database className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  <strong>Last Backup:</strong> 2 hours ago
                </AlertDescription>
              </Alert>
              <Alert className="border-purple-200 bg-purple-50">
                <Settings className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-700">
                  <strong>Config Status:</strong> All policies active
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}