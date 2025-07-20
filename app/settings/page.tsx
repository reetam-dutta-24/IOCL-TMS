"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, Bell, Database, Save, Camera } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    role: ""
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setProfileData({
      firstName: parsedUser.firstName || parsedUser.name?.split(' ')[0] || "",
      lastName: parsedUser.lastName || parsedUser.name?.split(' ')[1] || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      department: parsedUser.department || "",
      role: parsedUser.role || ""
    })
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveProfile = () => {
    // Update user data in localStorage
    const updatedUser = {
      ...user,
      name: `${profileData.firstName} ${profileData.lastName}`,
      ...profileData
    }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    // Show success message (in real app, this would be an API call)
    alert("Profile updated successfully!")
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="profile" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">
              <Database className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-red-900">Profile Information</CardTitle>
                <CardDescription>Update your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={`/placeholder.svg?height=80&width=80&query=${user.name}`} />
                    <AvatarFallback className="bg-red-100 text-red-600 text-xl">
                      {user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.role}</p>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={profileData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Learning & Development">Learning & Development</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profileData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                      disabled
                    />
                    <p className="text-xs text-gray-500">Role changes require administrator approval</p>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="bg-red-600 hover:bg-red-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-red-900">Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-red-900">Two-Factor Authentication</p>
                    <p className="text-sm text-red-700">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>

                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-red-900">Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about system activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">Request Updates</p>
                      <p className="text-sm text-gray-600">Get notified about request status changes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">Mentor Assignments</p>
                      <p className="text-sm text-gray-600">Notifications for new mentor assignments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">System Alerts</p>
                      <p className="text-sm text-gray-600">Important system announcements</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">Weekly Reports</p>
                      <p className="text-sm text-gray-600">Receive weekly activity summaries</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-red-900">System Preferences</CardTitle>
                <CardDescription>Customize your TAMS experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="ist">
                      <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-red-900">Dark Mode</p>
                    <p className="text-sm text-red-700">Switch to dark theme (Coming Soon)</p>
                  </div>
                  <Switch disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}