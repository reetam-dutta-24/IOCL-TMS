"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  GraduationCap, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Eye,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  Award,
  TrendingUp,
  Building,
  Target,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  UserCheck
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

interface InternshipRequest {
  id: number
  traineeId: number
  trainee: {
    firstName: string
    lastName: string
    email: string
    employeeId: string
    department?: {
      name: string
    }
  }
  programType: string
  startDate: string
  endDate: string
  status: 'PENDING_MENTOR' | 'MENTOR_ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
  mentorId?: number
  mentor?: {
    firstName: string
    lastName: string
    department: {
      name: string
    }
  }
  createdAt: string
  approvedAt?: string
  description?: string
  objectives?: string
}

interface LnDStats {
  totalInternships: number
  pendingApproval: number
  activeInternships: number
  completedInternships: number
  totalMentors: number
  activeMentors: number
  departmentDistribution: { department: string; count: number; percentage: number }[]
  programTypeStats: { type: string; count: number; successRate: number }[]
  monthlyTrends: { month: string; started: number; completed: number }[]
  averageCompletion: number
  satisfactionScore: number
}

export default function LnDHoDPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [internshipRequests, setInternshipRequests] = useState<InternshipRequest[]>([])
  const [lndStats, setLnDStats] = useState<LnDStats | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<InternshipRequest | null>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterProgram, setFilterProgram] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

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
    loadLnDData()
    setIsLoading(false)
  }, [router])

  const loadLnDData = async () => {
    try {
      setIsRefreshing(true)
      
      // Load internship requests for L&D HoD approval
      const [requestsRes, statsRes] = await Promise.all([
        fetch("/api/internships?role=lnd-hod"),
        fetch("/api/lnd/statistics")
      ])

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json()
        setInternshipRequests(requestsData)
      } else {
        // Fallback data for demonstration
        setInternshipRequests([
          {
            id: 1,
            traineeId: 101,
            trainee: {
              firstName: "Arjun",
              lastName: "Sharma",
              email: "arjun.sharma@example.com",
              employeeId: "TRN001",
              department: { name: "Computer Science" }
            },
            programType: "Summer Internship",
            startDate: "2024-02-01",
            endDate: "2024-04-01",
            status: "PENDING_MENTOR",
            createdAt: new Date().toISOString(),
            description: "Research and development in AI/ML technologies",
            objectives: "Gain hands-on experience in machine learning algorithms"
          },
          {
            id: 2,
            traineeId: 102,
            trainee: {
              firstName: "Priya",
              lastName: "Patel",
              email: "priya.patel@example.com",
              employeeId: "TRN002",
              department: { name: "Mechanical Engineering" }
            },
            programType: "Industrial Training",
            startDate: "2024-02-15",
            endDate: "2024-05-15",
            status: "MENTOR_ASSIGNED",
            mentorId: 201,
            mentor: {
              firstName: "Dr. Vikram",
              lastName: "Gupta",
              department: { name: "Mechanical Engineering" }
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            approvedAt: new Date().toISOString(),
            description: "Process optimization and quality control",
            objectives: "Learn industrial processes and quality standards"
          }
        ])
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setLnDStats(statsData)
      } else {
        // Fallback stats for demonstration
        setLnDStats({
          totalInternships: 156,
          pendingApproval: 12,
          activeInternships: 34,
          completedInternships: 110,
          totalMentors: 28,
          activeMentors: 24,
          departmentDistribution: [
            { department: "Computer Science", count: 45, percentage: 28.8 },
            { department: "Mechanical Engineering", count: 38, percentage: 24.4 },
            { department: "Electrical Engineering", count: 32, percentage: 20.5 },
            { department: "Chemical Engineering", count: 25, percentage: 16.0 },
            { department: "Civil Engineering", count: 16, percentage: 10.3 }
          ],
          programTypeStats: [
            { type: "Summer Internship", count: 68, successRate: 94.1 },
            { type: "Industrial Training", count: 52, successRate: 96.2 },
            { type: "Research Project", count: 24, successRate: 91.7 },
            { type: "Winter Training", count: 12, successRate: 100.0 }
          ],
          monthlyTrends: [
            { month: "Jan", started: 18, completed: 15 },
            { month: "Feb", started: 22, completed: 19 },
            { month: "Mar", started: 28, completed: 24 },
            { month: "Apr", started: 35, completed: 31 },
            { month: "May", started: 31, completed: 28 },
            { month: "Jun", started: 22, completed: 20 }
          ],
          averageCompletion: 87.5,
          satisfactionScore: 4.7
        })
      }

    } catch (error) {
      console.error("Failed to load L&D data:", error)
      setMessage("Failed to load L&D dashboard data")
      setMessageType("error")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleInternshipAction = async (requestId: number, action: 'approve' | 'reject') => {
    setIsProcessing(true)
    
    try {
      const response = await fetch(`/api/internships/${requestId}/lnd-approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          reviewComment: reviewComment.trim() || null,
          reviewerId: user?.id || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} internship`)
      }

      // Refresh the data
      await loadLnDData()
      
      setMessage(data.message || `Internship ${action}d successfully!`)
      setMessageType("success")
      setSelectedRequest(null)
      setReviewComment("")
      
      setTimeout(() => setMessage(""), 5000)
      
    } catch (error) {
      console.error(`Failed to ${action} internship:`, error)
      setMessage(`Failed to ${action} internship: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setMessageType("error")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_MENTOR':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Mentor</Badge>
      case 'MENTOR_ASSIGNED':
        return <Badge className="bg-blue-100 text-blue-800"><UserCheck className="h-3 w-3 mr-1" />Mentor Assigned</Badge>
      case 'IN_PROGRESS':
        return <Badge className="bg-purple-100 text-purple-800"><GraduationCap className="h-3 w-3 mr-1" />In Progress</Badge>
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredRequests = internshipRequests.filter(req => {
    const statusMatch = filterStatus === "all" || req.status.toLowerCase().includes(filterStatus.toLowerCase())
    const programMatch = filterProgram === "all" || req.programType === filterProgram
    return statusMatch && programMatch
  })

  const quickActions = [
    {
      title: "Approve Internships",
      description: "Review and approve pending internship requests",
      icon: CheckCircle,
      color: "bg-green-500",
      count: lndStats?.pendingApproval || 0,
      href: "#pending-approvals"
    },
    {
      title: "Mentor Management",
      description: "Oversee mentor assignments and performance",
      icon: Users,
      color: "bg-blue-500",
      count: lndStats?.totalMentors || 0,
      href: "/mentors"
    },
    {
      title: "Program Analytics",
      description: "View detailed program performance metrics",
      icon: BarChart3,
      color: "bg-purple-500",
      href: "/reports"
    },
    {
      title: "Quality Assurance",
      description: "Monitor internship quality and compliance",
      icon: Award,
      color: "bg-orange-500",
      href: "/lnd-hod/quality"
    },
    {
      title: "Resource Allocation",
      description: "Manage department resources and capacity",
      icon: Target,
      color: "bg-indigo-500",
      href: "/lnd-hod/resources"
    },
    {
      title: "Policy Configuration",
      description: "Configure L&D policies and parameters",
      icon: Settings,
      color: "bg-gray-500",
      href: "/lnd-hod/settings"
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading L&D HoD Dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">L&D Head of Department</h1>
            <p className="text-gray-600">Strategic oversight and final approval authority for all L&D programs</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
              <GraduationCap className="h-4 w-4 mr-2" />
              L&D HoD
            </Badge>
            <Button 
              onClick={loadLnDData} 
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
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

        {/* Executive Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Programs</p>
                  <p className="text-2xl font-bold text-gray-900">{lndStats?.totalInternships || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">All time</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12% this quarter</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-orange-600">{lndStats?.pendingApproval || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Requires your approval</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              {(lndStats?.pendingApproval || 0) > 0 && (
                <div className="mt-4">
                  <Badge className="bg-orange-100 text-orange-800">Action Required</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">{lndStats?.averageCompletion || 0}%</p>
                  <p className="text-xs text-green-600 mt-1">Program completion</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4">
                <Progress value={lndStats?.averageCompletion || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                  <p className="text-2xl font-bold text-purple-600">{lndStats?.satisfactionScore || 0}/5.0</p>
                  <p className="text-xs text-purple-600 mt-1">Trainee feedback</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <Progress value={(lndStats?.satisfactionScore || 0) * 20} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Executive Actions
            </CardTitle>
            <CardDescription>Key L&D HoD functions and strategic oversight</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <div key={index} className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mr-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                    {action.count !== undefined && (
                      <Badge variant="secondary" className="mt-1">
                        {action.count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Program Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status ({internshipRequests.length})</SelectItem>
                  <SelectItem value="pending">Pending Mentor Assignment</SelectItem>
                  <SelectItem value="mentor">Mentor Assigned</SelectItem>
                  <SelectItem value="progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="Summer Internship">Summer Internship</SelectItem>
                  <SelectItem value="Industrial Training">Industrial Training</SelectItem>
                  <SelectItem value="Research Project">Research Project</SelectItem>
                  <SelectItem value="Winter Training">Winter Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Internship Programs Table */}
        <Card id="pending-approvals">
          <CardHeader>
            <CardTitle>Internship Program Oversight</CardTitle>
            <CardDescription>
              Strategic oversight and final approval authority for all L&D internship programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading programs...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trainee</TableHead>
                    <TableHead>Program Type</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.trainee.firstName} {request.trainee.lastName}</div>
                          <div className="text-sm text-gray-500">{request.trainee.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">{request.programType}</Badge>
                      </TableCell>
                      <TableCell>{request.trainee.department?.name || 'Not specified'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(request.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">to {new Date(request.endDate).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.mentor ? (
                          <div className="text-sm">
                            <div>{request.mentor.firstName} {request.mentor.lastName}</div>
                            <div className="text-gray-500">{request.mentor.department.name}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>L&D Program Review - Strategic Oversight</DialogTitle>
                              <DialogDescription>
                                Executive review and policy compliance oversight
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedRequest && (
                              <div className="space-y-6">
                                {/* Program Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Trainee Information</h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Name:</span>
                                        <span>{selectedRequest.trainee.firstName} {selectedRequest.trainee.lastName}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Employee ID:</span>
                                        <Badge variant="outline">{selectedRequest.trainee.employeeId}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Department:</span>
                                        <span>{selectedRequest.trainee.department?.name || 'Not specified'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Program Details</h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Program Type:</span>
                                        <Badge className="bg-blue-100 text-blue-800">{selectedRequest.programType}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Duration:</span>
                                        <span>{new Date(selectedRequest.startDate).toLocaleDateString()} - {new Date(selectedRequest.endDate).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Status:</span>
                                        {getStatusBadge(selectedRequest.status)}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Program Description and Objectives */}
                                {(selectedRequest.description || selectedRequest.objectives) && (
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Program Scope</h4>
                                    {selectedRequest.description && (
                                      <div>
                                        <span className="font-medium text-sm">Description:</span>
                                        <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{selectedRequest.description}</p>
                                      </div>
                                    )}
                                    {selectedRequest.objectives && (
                                      <div>
                                        <span className="font-medium text-sm">Learning Objectives:</span>
                                        <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{selectedRequest.objectives}</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Mentor Information */}
                                {selectedRequest.mentor && (
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Assigned Mentor</h4>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-medium">{selectedRequest.mentor.firstName} {selectedRequest.mentor.lastName}</p>
                                          <p className="text-sm text-gray-600">{selectedRequest.mentor.department.name}</p>
                                        </div>
                                        <UserCheck className="h-6 w-6 text-blue-600" />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* L&D HoD Actions */}
                                {selectedRequest.status === 'MENTOR_ASSIGNED' && (
                                  <div className="space-y-4 border-t pt-6">
                                    <h4 className="font-semibold text-gray-900">L&D HoD Final Approval</h4>
                                    <div>
                                      <Label htmlFor="reviewComment">Executive Comments (Optional)</Label>
                                      <Textarea
                                        id="reviewComment"
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Add strategic comments or policy notes..."
                                        rows={3}
                                        className="mt-1"
                                      />
                                    </div>
                                    
                                    <div className="flex space-x-3 pt-4">
                                      <Button
                                        onClick={() => handleInternshipAction(selectedRequest.id, 'approve')}
                                        disabled={isProcessing}
                                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                      >
                                        {isProcessing ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Grant Final Approval
                                      </Button>
                                      
                                      <Button
                                        onClick={() => handleInternshipAction(selectedRequest.id, 'reject')}
                                        disabled={isProcessing}
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        {isProcessing ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <XCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Override & Reject
                                      </Button>
                                    </div>
                                    
                                    <div className="text-xs text-gray-500 bg-purple-50 p-3 rounded">
                                      <strong>L&D HoD Authority:</strong> Final approval will:
                                      <ul className="list-disc list-inside mt-1 space-y-1">
                                        <li>Authorize program commencement and resource allocation</li>
                                        <li>Enable mentor-trainee collaboration</li>
                                        <li>Trigger compliance monitoring and quality assurance</li>
                                        <li>Initialize progress tracking and evaluation protocols</li>
                                      </ul>
                                    </div>
                                  </div>
                                )}

                                {/* Program Status Information */}
                                {selectedRequest.status !== 'MENTOR_ASSIGNED' && (
                                  <div className="space-y-4 border-t pt-6">
                                    <h4 className="font-semibold text-gray-900">Program Status</h4>
                                    <div className="bg-gray-50 p-4 rounded">
                                      <div className="flex items-center justify-between mb-2">
                                        {getStatusBadge(selectedRequest.status)}
                                        <span className="text-sm text-gray-500">
                                          {selectedRequest.approvedAt ? new Date(selectedRequest.approvedAt).toLocaleString() : 'N/A'}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        {selectedRequest.status === 'PENDING_MENTOR' && "Awaiting mentor assignment before L&D HoD approval"}
                                        {selectedRequest.status === 'IN_PROGRESS' && "Program approved and currently in progress"}
                                        {selectedRequest.status === 'COMPLETED' && "Program successfully completed"}
                                        {selectedRequest.status === 'REJECTED' && "Program rejected by L&D HoD"}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {filteredRequests.length === 0 && !isRefreshing && (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No internship programs found</h3>
                <p className="text-gray-500">
                  {filterStatus === "all" && filterProgram === "all"
                    ? "No internship programs are currently available for review." 
                    : "No programs match the selected filters. Try adjusting your search criteria."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Performance Overview */}
        {lndStats && (
          <Card>
            <CardHeader>
              <CardTitle>Strategic Performance Overview</CardTitle>
              <CardDescription>Department-wise program distribution and success metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lndStats.departmentDistribution.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{dept.department}</h3>
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Programs:</span>
                        <span className="font-medium">{dept.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Share:</span>
                        <span className="font-medium">{dept.percentage}%</span>
                      </div>
                      <Progress value={dept.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}