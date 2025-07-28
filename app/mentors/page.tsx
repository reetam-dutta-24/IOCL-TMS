"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Building,
  Star,
  UserCheck,
  Clock,
  Award,
  Target,
  Eye,
  UserPlus,
  Activity,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  FileText,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Settings,
  Loader2
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageLoading } from "@/components/ui/page-loading"

interface Trainee {
  id: string
  name: string
  employeeId: string
  department: string
  email: string
  programType: string
  startDate: string
  endDate: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  progress: number
  lastReportDate?: string
  nextReportDate?: string
}

interface MentorPerformance {
  totalTrainees: number
  activeTrainees: number
  completedPrograms: number
  averageRating: number
  totalReports: number
  pendingReports: number
  completionRate: number
  satisfactionScore: number
}

interface RecentActivity {
  id: string
  type: 'REPORT_SUBMITTED' | 'PROGRESS_UPDATE' | 'FEEDBACK_GIVEN' | 'TRAINEE_ASSIGNED'
  description: string
  timestamp: string
  traineeName?: string
}

export default function MentorsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [assignedTrainees, setAssignedTrainees] = useState<Trainee[]>([])
  const [performance, setPerformance] = useState<MentorPerformance | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    loadMentorData(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const loadMentorData = async (currentUser: any) => {
    try {
      setIsRefreshing(true)
      
      // Fetch real data from API
      const response = await fetch(`/api/mentors?mentorId=${currentUser.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch mentor data')
      }
      
      const data = await response.json()
      
      setAssignedTrainees(data.trainees || [])
      setPerformance(data.performance || {
        totalTrainees: 0,
        activeTrainees: 0,
        completedPrograms: 0,
        averageRating: 0,
        totalReports: 0,
        pendingReports: 0,
        completionRate: 0,
        satisfactionScore: 0
      })
      setRecentActivities(data.activities || [])
      
    } catch (error) {
      console.error('Error loading mentor data:', error)
      setAssignedTrainees([])
      setPerformance({
        totalTrainees: 0,
        activeTrainees: 0,
        completedPrograms: 0,
        averageRating: 0,
        totalReports: 0,
        pendingReports: 0,
        completionRate: 0,
        satisfactionScore: 0
      })
      setRecentActivities([])
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800"><Activity className="h-3 w-3 mr-1" />In Progress</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case "ON_HOLD":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />On Hold</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "REPORT_SUBMITTED":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "PROGRESS_UPDATE":
        return <Activity className="h-4 w-4 text-green-600" />
      case "FEEDBACK_GIVEN":
        return <Award className="h-4 w-4 text-purple-600" />
      case "TRAINEE_ASSIGNED":
        return <UserPlus className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const filteredTrainees = assignedTrainees.filter(trainee => {
    const searchMatch = trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       trainee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = statusFilter === "all" || trainee.status === statusFilter
    return searchMatch && statusMatch
  })

  if (loading) {
    return <PageLoading message="Loading mentor dashboard..." />
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header with Greeting and Role Summary */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}, {user.firstName}!</h1>
            <p className="text-gray-600">Mentor Dashboard - Direct supervision and guidance of assigned trainees</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-2">Your Role: Mentor</h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              {user.role}
            </Badge>
            <Button 
              onClick={() => loadMentorData(user)}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Role Description Banner */}
          <Alert className="border-blue-200 bg-blue-50">
            <Users className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
            <strong>Your Role:</strong> As a Mentor, you provide direct supervision, project guidance, and technical support to assigned trainees. You evaluate performance, submit progress reports, and contribute to completion documentation.
            </AlertDescription>
          </Alert>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Trainees</p>
                  <p className="text-2xl font-bold text-blue-600">{performance?.activeTrainees || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Currently assigned</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Programs</p>
                  <p className="text-2xl font-bold text-green-600">{performance?.completedPrograms || 0}</p>
                  <p className="text-xs text-green-600 mt-1">Successfully mentored</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-orange-600">{performance?.pendingReports || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Due this week</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-purple-600">{performance?.averageRating || 0}/5.0</p>
                  <p className="text-xs text-purple-600 mt-1">Trainee feedback</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mentor Performance & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mentor Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Mentor Performance
              </CardTitle>
              <CardDescription>Your performance metrics and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{performance?.completionRate || 0}%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{performance?.satisfactionScore || 0}/5.0</p>
                  <p className="text-sm text-gray-600">Satisfaction Score</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Reports Submitted</span>
                  <span className="font-medium">{performance?.totalReports || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Trainees Mentored</span>
                  <span className="font-medium">{performance?.totalTrainees || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Program Duration</span>
                  <span className="font-medium">3.2 months</span>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Performance
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activities
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Trainees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Assigned Trainees
            </CardTitle>
            <CardDescription>Direct supervision of your assigned trainees</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search trainees by name or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trainees Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainee</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Report</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainees.map((trainee) => (
                  <TableRow key={trainee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {trainee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                          <div className="font-medium">{trainee.name}</div>
                          <div className="text-sm text-gray-500">{trainee.employeeId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                <div>
                        <Badge className="bg-blue-100 text-blue-800">{trainee.programType}</Badge>
                        <div className="text-sm text-gray-500 mt-1">{trainee.department}</div>
                </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{trainee.progress}%</span>
                        </div>
                        <Progress value={trainee.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(trainee.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {trainee.nextReportDate ? (
                          <div>
                            <div>{new Date(trainee.nextReportDate).toLocaleDateString()}</div>
                            <div className="text-gray-500">
                              {Math.ceil((new Date(trainee.nextReportDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Not scheduled</span>
                        )}
                            </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Report
                        </Button>
                            </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTrainees.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No trainees found matching your criteria</p>
                            </div>
                          )}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Summary
            </CardTitle>
            <CardDescription>Your mentoring performance metrics and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{performance?.completionRate || 0}%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{performance?.totalTrainees || 0}</p>
                <p className="text-sm text-gray-600">Total Trainees</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{performance?.averageRating || 0}</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{performance?.totalReports || 0}</p>
                <p className="text-sm text-gray-600">Reports Submitted</p>
                        </div>
                </div>
              </CardContent>
            </Card>
      </div>
    </DashboardLayout>
  )
}
