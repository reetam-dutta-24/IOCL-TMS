"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Target, 
  FileText, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock,
  CheckCircle,
  Upload,
  Download,
  Plus,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BarChart3,
  Users
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TraineeStatsCard } from "@/components/trainee/trainee-stats-card"
import { ProgressChart } from "@/components/trainee/progress-chart"
import { GoalsSection } from "@/components/trainee/goals-section"
import { SubmissionsSection } from "@/components/trainee/submissions-section"
import { MessagesSection } from "@/components/trainee/messages-section"
import { ResourcesSection } from "@/components/trainee/resources-section"
import { WeeklyProgressForm } from "@/components/trainee/weekly-progress-form"
import { PerformanceAnalytics } from "@/components/trainee/performance-analytics"

export default function TraineeDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "Trainee") {
      router.push("/dashboard")
      return
    }
    
    setUser(parsedUser)
    loadDashboardData(parsedUser.employeeId)
    setLoading(false)
  }, [router])

  const loadDashboardData = async (userId: string) => {
    try {
      const response = await fetch(`/api/trainee/dashboard/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setDashboardStats(data.data)
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }

  const handleProgressSubmit = (progressData: any) => {
    // Handle progress submission
    console.log("Progress submitted:", progressData)
    // In real implementation, this would update the dashboard stats
    loadDashboardData(user.employeeId)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const stats = dashboardStats || {
    overallProgress: 65,
    technicalSkillRating: 8.2,
    behavioralRating: 8.8,
    attendancePercentage: 95,
    completedGoals: 3,
    totalGoals: 5,
    pendingSubmissions: 2,
    unreadMessages: 4,
    daysRemaining: 45,
    weeksCompleted: 8,
    currentWeek: 9
  }

  const progressData = [
    { week: 1, technical: 6.5, behavioral: 7.0, overall: 15 },
    { week: 2, technical: 7.2, behavioral: 7.5, overall: 30 },
    { week: 3, technical: 7.8, behavioral: 8.0, overall: 45 },
    { week: 4, technical: 8.0, behavioral: 8.2, overall: 60 },
    { week: 5, technical: 8.2, behavioral: 8.5, overall: 65 }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Internship Journey</h1>
            <p className="text-gray-600">
              Welcome back, {user.firstName}! Track your progress and achievements.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Progress
            </Button>
            <WeeklyProgressForm 
              traineeId={user.employeeId} 
              currentWeek={stats.currentWeek}
              onSubmit={handleProgressSubmit}
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TraineeStatsCard
            title="Overall Progress"
            value={`${stats.overallProgress}%`}
            change="+5%"
            trend="up"
            icon={TrendingUp}
            description="This week"
            progress={stats.overallProgress}
          />
          <TraineeStatsCard
            title="Technical Skills"
            value={`${stats.technicalSkillRating}/10`}
            change="+0.3"
            trend="up"
            icon={Award}
            description="Current rating"
            progress={stats.technicalSkillRating * 10}
          />
          <TraineeStatsCard
            title="Goals Completed"
            value={`${stats.completedGoals}/${stats.totalGoals}`}
            change="+1"
            trend="up"
            icon={Target}
            description="This month"
            progress={(stats.completedGoals / stats.totalGoals) * 100}
          />
          <TraineeStatsCard
            title="Days Remaining"
            value={stats.daysRemaining.toString()}
            change=""
            trend="neutral"
            icon={Calendar}
            description="Until completion"
            progress={((120 - stats.daysRemaining) / 120) * 100}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress Tracking</CardTitle>
                <CardDescription>Your week-by-week performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressChart data={progressData} />
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest submissions and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">React Assignment Approved</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <Badge variant="secondary">A</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Weekly Report Submitted</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                    <Badge variant="outline">Under Review</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                    <Target className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Goal "Master React" Completed</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                    <Badge variant="secondary">75%</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Achievement Unlocked: Fast Learner</p>
                      <p className="text-xs text-gray-500">5 days ago</p>
                    </div>
                    <Badge variant="secondary">+120 pts</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  My Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                    <AvatarFallback>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.employeeId}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span>{user.institutionName || "Institution not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{user.department || "Department not assigned"}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Weekly Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Mentor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Set New Goal
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Access Resources
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Weekly Report</p>
                    <p className="text-xs text-gray-500">Due Tomorrow</p>
                  </div>
                  <Badge variant="destructive">High</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Project Demo</p>
                    <p className="text-xs text-gray-500">Due in 3 days</p>
                  </div>
                  <Badge variant="outline">Medium</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Skill Assessment</p>
                    <p className="text-xs text-gray-500">Due in 1 week</p>
                  </div>
                  <Badge variant="secondary">Low</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Current Mentor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Mentor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>SP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Sunita Patel</p>
                    <p className="text-sm text-gray-500">Senior Developer</p>
                    <p className="text-xs text-gray-400">Information Technology</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Sections */}
        <Card>
          <CardHeader>
            <CardTitle>My Internship Hub</CardTitle>
            <CardDescription>Manage all aspects of your internship journey</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="goals" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
              </TabsList>

              <TabsContent value="goals" className="space-y-4">
                <GoalsSection userId={user.employeeId} />
              </TabsContent>

              <TabsContent value="submissions" className="space-y-4">
                <SubmissionsSection userId={user.employeeId} />
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                <MessagesSection userId={user.employeeId} />
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <ResourcesSection departmentId={user.departmentId} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <PerformanceAnalytics traineeId={user.employeeId} />
              </TabsContent>

              <TabsContent value="certificates" className="space-y-4">
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Certificates & Achievements</h3>
                  <p className="text-gray-600 mb-4">Your earned certificates will appear here</p>
                  <Button variant="outline">View All Certificates</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}