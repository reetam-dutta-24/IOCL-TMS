"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Users, 
  UserCheck, 
  Target, 
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
  Building,
  Activity,
  BarChart3,
  UserPlus,
  Eye,
  RefreshCw,
  AlertCircle,
  Download,
  Edit,
  FileText,
  Plus,
  Settings
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"

interface HodDashboardProps {
  userRole?: string
  userDepartment?: string
}

interface DepartmentStats {
  totalTrainees: number
  activeTrainees: number
  pendingRequests: number
  completionRate: number
  departmentRequests: number
}

interface DashboardStats {
  totalRequests: number
  pendingRequests: number
  activeRequests: number
  completedRequests: number
  departmentStats: DepartmentStats
}

interface DepartmentBreakdown {
  department: string
  totalRequests: number
  pendingRequests: number
  activeRequests: number
  completedRequests: number
  totalMentors: number
  activeMentors: number
}

interface MentorPerformance {
  id: number
  name: string
  department: string
  capacity: number
  rating: number
  trainees: number
  maxCapacity: number
  completedTrainees: number
  totalAssigned: number
}

interface PendingAssignment {
  id: string
  trainee: string
  program: string
  priority: string
  submittedDate: string
  department: string
}

interface RecentActivity {
  action: string
  details: string
  time: string
}

interface ReceivedStudentDetails {
  id: number
  notificationId: number
  department: string
  applicationsCount: number
  applications: Array<{
    id: number
    firstName: string
    lastName: string
    email: string
    institutionName: string
    courseName: string
    internshipDuration: number
    skills?: string
    projectInterests?: string
  }>
  forwardedBy: string
  forwardedByEmail: string
  receivedAt: string
  status: 'UNREAD' | 'READ'
}

interface DashboardData {
  stats: DashboardStats
  departmentBreakdown: DepartmentBreakdown[]
  mentorPerformance: MentorPerformance[]
  pendingAssignments: PendingAssignment[]
  recentActivities: RecentActivity[]
  receivedStudentDetails?: ReceivedStudentDetails[]
}

export function HodDashboard({ user, roleType = "DEPT_HOD" }: { user: any, roleType?: string }) {
  // Check if the user is an L&D HoD for role-specific functionality
  const router = useRouter()
  const userRole = user?.role || "Department HoD"
  const userDepartment = user?.department || "Information Technology"
  const isLDHod = userRole === "L&D HoD" || roleType === "LD_HOD"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [receivedStudentDetails, setReceivedStudentDetails] = useState<ReceivedStudentDetails[]>([])
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false)
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/hod-dashboard')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }
      
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchReceivedStudentDetails = async () => {
    try {
      setLoadingStudentDetails(true)
      console.log('🔍 Fetching received student details for user:', user.id)
      
      const response = await fetch(`/api/notifications/forwarded-student-details?userId=${user.id}`)
      
      console.log('📡 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Response data:', data)
        
        const studentDetails = data.forwardedDetails || []
        console.log('📨 Parsed student details:', studentDetails)
        
        setReceivedStudentDetails(studentDetails)
        
        // Mark notifications as read when viewed
        if (studentDetails.length > 0) {
          const unreadNotifications = studentDetails.filter(detail => detail.status === 'UNREAD')
          if (unreadNotifications.length > 0) {
            console.log('📝 Marking notifications as read:', unreadNotifications.map(n => n.notificationId))
            await markNotificationsAsRead(unreadNotifications.map(n => n.notificationId))
          }
        }
      } else {
        console.error('❌ Failed to fetch student details:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
      }
    } catch (error) {
      console.error('💥 Error fetching received student details:', error)
    } finally {
      setLoadingStudentDetails(false)
    }
  }

  const markNotificationsAsRead = async (notificationIds: number[]) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationIds,
          status: 'READ'
        })
      })
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    fetchReceivedStudentDetails()
  }, [user.id])
  
  // Fallback data in case of error
  const departmentStats = data?.stats?.departmentStats || {
            totalTrainees: isLDHod ? 45 : 12,
        activeTrainees: isLDHod ? 32 : 8,
        pendingRequests: isLDHod ? 18 : 5,
    completionRate: isLDHod ? 94.2 : 96.5,
    departmentRequests: isLDHod ? 156 : 23
  }

  const mentorPerformance = data?.mentorPerformance || [
    { id: 1, name: "Vikram Gupta", department: "IT", capacity: 85, rating: 4.8, trainees: 3, maxCapacity: 4, completedTrainees: 12, totalAssigned: 15 },
    { id: 2, name: "Suresh Reddy", department: "IT", capacity: 60, rating: 4.5, trainees: 2, maxCapacity: 3, completedTrainees: 8, totalAssigned: 10 },
    { id: 3, name: "Kavita Nair", department: "HR", capacity: 100, rating: 4.9, trainees: 3, maxCapacity: 3, completedTrainees: 15, totalAssigned: 18 },
    { id: 4, name: "Rajesh Patel", department: "Finance", capacity: 40, rating: 4.6, trainees: 1, maxCapacity: 2, completedTrainees: 5, totalAssigned: 6 }
  ]

  const pendingAssignments = data?.pendingAssignments || [
    { id: "REQ015", trainee: "Arjun Sharma", program: "Summer Internship", priority: "HIGH", submittedDate: "2024-01-15", department: "IT" },
    { id: "REQ016", trainee: "Priya Patel", program: "Technical Training", priority: "MEDIUM", submittedDate: "2024-01-14", department: "HR" },
    { id: "REQ017", trainee: "Vikram Singh", program: "Research Project", priority: "HIGH", submittedDate: "2024-01-13", department: "Finance" },
    { id: "REQ018", trainee: "Sneha Reddy", program: "Industrial Training", priority: "MEDIUM", submittedDate: "2024-01-12", department: "IT" }
  ]

  const recentActivities = data?.recentActivities || [
    { action: "Mentor Assigned", details: "Vikram Gupta assigned to REQ014", time: "30 mins ago" },
    { action: "Capacity Updated", details: "Suresh Reddy availability updated", time: "1 hour ago" },
    { action: "Assignment Complete", details: "REQ012 marked as completed", time: "2 hours ago" },
    { action: "New Request", details: "REQ015 received for processing", time: "3 hours ago" }
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "LOW":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  if (loading && !data) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            {isLDHod ? "L&D HoD Dashboard" : `${userDepartment} Department Dashboard`}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Badge className={`${isLDHod ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"} px-3 py-1`}>
            <Users className="h-4 w-4 mr-2" />
            {isLDHod ? "L&D HoD" : "Department HoD"}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchDashboardData()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Role Information */}
      <Alert className="border-blue-200 bg-blue-50">
        <Users className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <strong>📋 Your Role:</strong> {isLDHod ? 
            "As L&D HoD, you oversee all learning and development activities across departments, approve internship requests, monitor program quality, and manage resource allocation." : 
            "As Department HoD, you manage mentor assignments, oversee trainee progress, and ensure quality internship experiences within your department."}
        </AlertDescription>
      </Alert>

      {/* Student Details Notification */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          <strong>📨 New Student Details:</strong> When L&D Coordinator sends approved student details, you'll receive notifications here. 
          You can then assign mentors and manage the internship process for your department.
        </AlertDescription>
      </Alert>

      {/* Received Student Details Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Received Student Details from L&D Coordinator
              </CardTitle>
              <CardDescription>
                Approved student details sent by L&D Coordinator for mentor assignment
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchReceivedStudentDetails}
              disabled={loadingStudentDetails}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingStudentDetails ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingStudentDetails ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-48 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </div>
              ))}
            </div>
          ) : receivedStudentDetails.length > 0 ? (
            <div className="space-y-4">
              {receivedStudentDetails.map((detail) => (
                <div key={detail.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${detail.status === 'UNREAD' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {detail.status === 'UNREAD' ? 'New' : 'Read'}
                      </Badge>
                      <span className="font-medium text-gray-900">
                        {detail.department} Department
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {new Date(detail.receivedAt).toLocaleDateString()}
                      </span>
                      <p className="text-xs text-gray-400">
                        Forwarded by {detail.forwardedBy}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {detail.applicationsCount} student(s) received for mentor assignment
                  </p>
                  
                  <div className="space-y-2">
                    {detail.applications.map((student, index) => (
                      <div key={index} className="bg-white border rounded p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{student.firstName} {student.lastName}</h4>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <p className="text-sm text-gray-600">{student.institutionName} • {student.courseName}</p>
                            <p className="text-sm text-gray-600">Duration: {student.internshipDuration} weeks</p>
                            {student.skills && (
                              <p className="text-sm text-gray-600">Skills: {student.skills}</p>
                            )}
                            {student.projectInterests && (
                              <p className="text-sm text-gray-600">Interests: {student.projectInterests}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Assign Mentor
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Details Received Yet</h3>
              <p className="text-gray-600 mb-4">
                When the L&D Coordinator forwards approved student applications to your department, 
                they will appear here for mentor assignment.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Expected workflow:</strong> L&D Coordinator → Approves Applications → 
                  Forwards to Department HoD → You assign mentors → Students begin internships
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isLDHod ? "Total Trainees" : "Department Trainees"}
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.totalTrainees}</p>
                )}
                <p className="text-xs text-blue-600 mt-1">
                  {isLDHod ? "Approved by L&D HoD" : `In ${userDepartment}`}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trainees</p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.activeTrainees}</p>
                )}
                <p className="text-xs text-green-600 mt-1">
                  {loading ? "Loading..." : `${((departmentStats.activeTrainees/departmentStats.totalTrainees)*100).toFixed(0)}% active`}
                </p>
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
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.pendingRequests}</p>
                )}
                <p className="text-xs text-orange-600 mt-1">From L&D Coordinator</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentor Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {isLDHod ? "Top Performing Mentors" : "Department Mentor Performance"}
                </CardTitle>
                <CardDescription>Current mentor capacity and ratings</CardDescription>
              </div>
              {!isLDHod && (
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Mentor
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-2 w-full mt-4" />
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Skeleton className="h-8 w-16" />
                      {!isLDHod && <Skeleton className="h-8 w-16" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {mentorPerformance.map((mentor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{mentor.name}</span>
                        <Badge variant="outline" className="text-xs">{mentor.department}</Badge>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{mentor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Capacity</span>
                            <span>{mentor.trainees}/{mentor.maxCapacity}</span>
                          </div>
                          <Progress value={mentor.capacity} className="h-2" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Total completed: {mentor.completedTrainees} | Total assigned: {mentor.totalAssigned}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {!isLDHod && (
                        <Button size="sm">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest department activities</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent activities found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignments */}
      {!isLDHod && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Mentor Assignments</CardTitle>
            <CardDescription>Requests awaiting mentor assignment in your department</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-3 w-40 mt-2" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAssignments.length > 0 ? (
                  pendingAssignments.map((request, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{request.id}</span>
                          <span className="text-gray-600">{request.trainee}</span>
                          <Badge variant="outline" className="text-xs">{request.program}</Badge>
                          <Badge variant="secondary" className="text-xs">{request.department}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">Submitted: {new Date(request.submittedDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(request.priority)}
                        <Button size="sm">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No pending assignments found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions for L&D HoD */}
      {isLDHod && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common L&D HoD tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => router.push('/lnd-hod/quality')}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Quality Assurance</p>
                <p className="text-xs text-gray-500">Monitor internship program quality</p>
              </div>
            </div>
            <div 
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => router.push('/lnd-hod/resources')}
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Resource Allocation</p>
                <p className="text-xs text-gray-500">Manage department resources</p>
              </div>
            </div>
            <div 
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => router.push('/lnd-hod/settings')}
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">System Configuration</p>
                <p className="text-xs text-gray-500">Configure system parameters</p>
              </div>
            </div>
            <div 
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => router.push('/reports')}
            >
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Executive Reports</p>
                <p className="text-xs text-gray-500">Generate and view reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isLDHod ? "Strategic Overview" : "Department Performance Summary"}
          </CardTitle>
          <CardDescription>
            {isLDHod ? "Key metrics for strategic decision making" : "Performance metrics for your department"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{departmentStats.completionRate}%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{departmentStats.departmentRequests}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{departmentStats.avgCapacity}%</p>
                <p className="text-sm text-gray-600">Avg Utilization</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {data?.stats ? `${(data.stats.activeRequests / (data.stats.activeRequests + data.stats.completedRequests) * 3.5).toFixed(1)}h` : "2.3h"}
                </p>
                <p className="text-sm text-gray-600">Avg Assignment Time</p>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-6">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Report
            </Button>
            {isLDHod && data?.departmentBreakdown && data.departmentBreakdown.length > 0 && (
              <Button variant="outline">
                <Building className="h-4 w-4 mr-2" />
                All Departments ({data.departmentBreakdown.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* L&D HoD Specific Features */}
      {isLDHod && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Policy Compliance Oversight */}
            <Card>
              <CardHeader>
                <CardTitle>Policy Compliance</CardTitle>
                <CardDescription>Internship program compliance monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Mentor Assignment Policy</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Internship Duration Standards</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        <span>Feedback Collection</span>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">Review Needed</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-2">
                      View All Policies
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resource Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
                <CardDescription>Department resource distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">IT Department</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">HR Department</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Finance Department</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <Button variant="outline" className="w-full mt-2">
                      Adjust Allocations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quality Assurance Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quality Assurance</CardTitle>
              <CardDescription>Internship program quality metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">4.7/5</p>
                      <p className="text-sm text-gray-600">Average Program Rating</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">92%</p>
                      <p className="text-sm text-gray-600">Trainee Satisfaction</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">87%</p>
                      <p className="text-sm text-gray-600">Mentor Satisfaction</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Technical Skills Development</p>
                        <p className="text-sm text-gray-600">Based on 28 program evaluations</p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">4.6</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((i) => (
                            <Award key={i} className="h-4 w-4 text-yellow-500" />
                          ))}
                          <Award className="h-4 w-4 text-yellow-200" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Mentorship Quality</p>
                        <p className="text-sm text-gray-600">Based on 32 trainee feedbacks</p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">4.8</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((i) => (
                            <Award key={i} className="h-4 w-4 text-yellow-500" />
                          ))}
                          <Award className="h-4 w-4 text-yellow-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Program Structure</p>
                        <p className="text-sm text-gray-600">Based on 25 department reviews</p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">4.5</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((i) => (
                            <Award key={i} className="h-4 w-4 text-yellow-500" />
                          ))}
                          <Award className="h-4 w-4 text-yellow-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline">
                      View Detailed Reports
                    </Button>
                    <Button>
                      Configure Quality Parameters
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Executive Reports Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Executive Reports</CardTitle>
                <CardDescription>Generate and view executive-level reports</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">Quarterly Performance Summary</p>
                          <p className="text-xs text-gray-500">Last generated: 2 days ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">Department Efficiency Analysis</p>
                          <p className="text-xs text-gray-500">Last generated: 1 week ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">Mentor Performance Evaluation</p>
                          <p className="text-xs text-gray-500">Last generated: 2 weeks ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" /> New Report
                      </Button>
                      <Button variant="outline">
                        View All Reports
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure system parameters and settings</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Approval Workflow Settings</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Notification Preferences</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Department Access Controls</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button className="w-full mt-4">
                      System Administration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Internship Request Approvals */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Internship Request Approvals</CardTitle>
                <CardDescription>Final approval of internship requests across departments</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">REQ023</span>
                          <span className="text-gray-600">IT Department</span>
                          <Badge variant="outline" className="text-xs">Summer Internship</Badge>
                        </div>
                        <p className="text-sm text-gray-500">Submitted by: Rajesh Kumar (IT HoD) • 2 days ago</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                          Reject
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">REQ024</span>
                          <span className="text-gray-600">Finance Department</span>
                          <Badge variant="outline" className="text-xs">Technical Training</Badge>
                        </div>
                        <p className="text-sm text-gray-500">Submitted by: Priya Sharma (Finance HoD) • 3 days ago</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                          Reject
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">REQ025</span>
                          <span className="text-gray-600">HR Department</span>
                          <Badge variant="outline" className="text-xs">Research Project</Badge>
                        </div>
                        <p className="text-sm text-gray-500">Submitted by: Anita Desai (HR HoD) • 4 days ago</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                          Reject
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" /> View All Requests
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" /> Generate Approval Report
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
      </div>
    </DashboardLayout>
  )
}