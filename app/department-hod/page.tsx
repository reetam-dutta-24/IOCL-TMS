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
  Building, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Users,
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
  Loader2,
  Send,
  MessageSquare,
  Building2,
  User,
  Shield,
  Briefcase,
  MapPin,
  Globe,
  PhoneCall,
  Mail as MailIcon,
  ExternalLink,
  Download,
  Eye as EyeIcon
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageLoading } from "@/components/ui/page-loading"
import { Skeleton } from "@/components/ui/skeleton"

interface DepartmentHOD {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  designation: string
  employeeId: string
  location: string
  experience: string
  specialization: string[]
  currentMentors: number
  totalMentors: number
  activeTrainees: number
  completedPrograms: number
  averageRating: number
  lastActive: string
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'
  avatar?: string
}

interface DepartmentStats {
  totalDepartments: number
  activeHODs: number
  totalMentors: number
  activeTrainees: number
  averageCompletionRate: number
  pendingRequests: number
}

interface RequestHistory {
  id: string
  department: string
  hodName: string
  requestDate: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  traineeCount: number
  responseTime?: string
}

interface ApprovedTrainee {
  id: string
  traineeName: string
  employeeId: string
  department: string
  courseDetails: string
  institutionName: string
  internshipDuration: number
  skills?: string
  projectInterests?: string
  approvedDate: string
  submitterName: string
}

export default function DepartmentHODPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [departmentHODs, setDepartmentHODs] = useState<DepartmentHOD[]>([])
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats | null>(null)
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedHOD, setSelectedHOD] = useState<DepartmentHOD | null>(null)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [requestMessage, setRequestMessage] = useState("")
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)
  const [approvedTrainees, setApprovedTrainees] = useState<ApprovedTrainee[]>([])
  const [selectedTrainee, setSelectedTrainee] = useState<string>("")
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [selectedProfileHOD, setSelectedProfileHOD] = useState<DepartmentHOD | null>(null)

  useEffect(() => {
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
    loadDepartmentHODData()
    loadApprovedTrainees()
    setLoading(false)
  }, [router])

  const loadDepartmentHODData = async () => {
    try {
      setIsRefreshing(true)
      
      // Fetch real-time department HOD data
      const response = await fetch('/api/department-hod')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch department HOD data: ${response.status}`)
      }
      
      const data = await response.json()
      setDepartmentHODs(data.departmentHODs || [])
      setDepartmentStats(data.stats || null)
      setRequestHistory(data.requestHistory || [])
      
    } catch (error) {
      console.error('Error loading department HOD data:', error)
      // Show error message instead of mock data
      setDepartmentHODs([])
      setDepartmentStats(null)
      setRequestHistory([])
    } finally {
      setIsRefreshing(false)
    }
  }

  const loadApprovedTrainees = async () => {
    try {
      const response = await fetch('/api/department-hod/approved-trainees')
      if (response.ok) {
        const data = await response.json()
        setApprovedTrainees(data.approvedTrainees || [])
      }
    } catch (error) {
      console.error('Error loading approved trainees:', error)
    }
  }

  const handleRequestDetails = async (hod: DepartmentHOD) => {
    setSelectedHOD(hod)
    setSelectedTrainee("")
    setIsRequestDialogOpen(true)
  }

  const handleViewProfile = (hod: DepartmentHOD) => {
    setSelectedProfileHOD(hod)
    setIsProfileDialogOpen(true)
  }

  const submitRequest = async () => {
    if (!selectedHOD || !requestMessage.trim() || !selectedTrainee) return

    try {
      setIsSubmittingRequest(true)
      
      // Get selected trainee details
      const trainee = approvedTrainees.find(t => t.id === selectedTrainee)
      
      // Submit request to API
      const response = await fetch('/api/department-hod/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hodId: selectedHOD.id,
          department: selectedHOD.department,
          message: requestMessage,
          requestedBy: user.id,
          traineeId: selectedTrainee,
          traineeDetails: trainee
        })
      })

      if (response.ok) {
        // Update request history
        const newRequest: RequestHistory = {
          id: Date.now().toString(),
          department: selectedHOD.department,
          hodName: `${selectedHOD.firstName} ${selectedHOD.lastName}`,
          requestDate: new Date().toISOString(),
          status: 'PENDING',
          traineeCount: 1
        }
        setRequestHistory(prev => [newRequest, ...prev])
        
        setIsRequestDialogOpen(false)
        setRequestMessage("")
        setSelectedHOD(null)
        setSelectedTrainee("")
      }
    } catch (error) {
      console.error('Error submitting request:', error)
    } finally {
      setIsSubmittingRequest(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'INACTIVE':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      case 'ON_LEAVE':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'COMPLETED':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const filteredHODs = departmentHODs.filter(hod => {
    const searchMatch = `${hod.firstName} ${hod.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       hod.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       hod.email.toLowerCase().includes(searchTerm.toLowerCase())
    const departmentMatch = departmentFilter === "all" || hod.department === departmentFilter
    const statusMatch = statusFilter === "all" || hod.status === statusFilter
    return searchMatch && departmentMatch && statusMatch
  })

  if (loading) {
    return <PageLoading message="Loading Department HOD dashboard..." />
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
            <p className="text-gray-600">Department HOD Management - Real-time information and coordination</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-2">Your Role: L&D HoD</h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
              <Shield className="h-4 w-4 mr-2" />
              {user.role}
            </Badge>
            <Button 
              onClick={loadDepartmentHODData}
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
        <Alert className="border-purple-200 bg-purple-50">
          <Shield className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-700">
            <strong>Your Role:</strong> As L&D HoD, you can view real-time information of all Department HODs, their profiles, and request approved trainee details from their respective departments for better coordination and oversight.
          </AlertDescription>
        </Alert>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Departments</p>
                  <p className="text-2xl font-bold text-blue-600">{departmentStats?.totalDepartments || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Active departments</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active HODs</p>
                  <p className="text-2xl font-bold text-green-600">{departmentStats?.activeHODs || 0}</p>
                  <p className="text-xs text-green-600 mt-1">Currently active</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mentors</p>
                  <p className="text-2xl font-bold text-purple-600">{departmentStats?.totalMentors || 0}</p>
                  <p className="text-xs text-purple-600 mt-1">Across all departments</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Trainees</p>
                  <p className="text-2xl font-bold text-orange-600">{departmentStats?.activeTrainees || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">Currently enrolled</p>
                </div>
                <GraduationCap className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department HODs Grid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Department HODs - Real-time Information
                </CardTitle>
                <CardDescription>
                  Live profiles and details of all department heads of departments
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search HODs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHODs.map((hod) => (
                <Card key={hod.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={hod.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {hod.firstName.charAt(0)}{hod.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {hod.firstName} {hod.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{hod.designation}</p>
                          <p className="text-xs text-gray-500">{hod.employeeId}</p>
                        </div>
                      </div>
                      {getStatusBadge(hod.status)}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm">
                        <Building className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">{hod.department}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">{hod.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MailIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">{hod.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <PhoneCall className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">{hod.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{hod.currentMentors}</p>
                        <p className="text-xs text-gray-600">Current Mentors</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{hod.activeTrainees}</p>
                        <p className="text-xs text-gray-600">Total Trainees</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{hod.averageRating}/5.0</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Last Active</p>
                        <p className="text-xs font-medium">
                          {new Date(hod.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleRequestDetails(hod)}
                        className="w-full"
                        variant="outline"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Request Trainee Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewProfile(hod)}
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHODs.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {departmentHODs.length === 0 ? "No Department HODs in Database" : "No Department HODs Found"}
                </h3>
                <p className="text-gray-600">
                  {departmentHODs.length === 0 
                    ? "There are currently no Department HODs registered in the system. Please add Department HOD users to see them here."
                    : "Try adjusting your search or filter criteria"
                  }
                </p>
                {departmentHODs.length === 0 && (
                  <div className="mt-4">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Database contains {departmentStats?.activeHODs || 0} Department HODs
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Request History
            </CardTitle>
            <CardDescription>Track your requests for trainee details from department HODs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>HOD Name</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trainee Count</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestHistory.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.department}</TableCell>
                    <TableCell>{request.hodName}</TableCell>
                    <TableCell>
                      {new Date(request.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.traineeCount}</TableCell>
                    <TableCell>{request.responseTime || '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Trainee Details</DialogTitle>
            <DialogDescription>
              Send a request to {selectedHOD?.firstName} {selectedHOD?.lastName} ({selectedHOD?.department}) 
              for details of a specific approved trainee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="trainee">Select Approved Trainee</Label>
              <Select value={selectedTrainee} onValueChange={setSelectedTrainee}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an approved trainee..." />
                </SelectTrigger>
                <SelectContent>
                  {approvedTrainees.map((trainee) => (
                    <SelectItem key={trainee.id} value={trainee.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{trainee.traineeName}</span>
                        <span className="text-sm text-gray-500">
                          {trainee.department} • {trainee.courseDetails}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTrainee && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Selected Trainee:</p>
                  <p className="text-sm text-gray-600">
                    {approvedTrainees.find(t => t.id === selectedTrainee)?.traineeName} 
                    ({approvedTrainees.find(t => t.id === selectedTrainee)?.department})
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="message">Request Message</Label>
              <textarea
                id="message"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Please provide additional details or specific requirements for this trainee..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsRequestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={submitRequest}
                disabled={!requestMessage.trim() || !selectedTrainee || isSubmittingRequest}
              >
                {isSubmittingRequest ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Department HOD Profile</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedProfileHOD?.firstName} {selectedProfileHOD?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedProfileHOD && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedProfileHOD.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                    {selectedProfileHOD.firstName.charAt(0)}{selectedProfileHOD.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedProfileHOD.firstName} {selectedProfileHOD.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedProfileHOD.designation}</p>
                  <p className="text-sm text-gray-500">{selectedProfileHOD.employeeId}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedProfileHOD.status)}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MailIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedProfileHOD.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneCall className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedProfileHOD.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedProfileHOD.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedProfileHOD.location}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Experience: {selectedProfileHOD.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Rating: {selectedProfileHOD.averageRating}/5.0</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Last Active: {new Date(selectedProfileHOD.lastActive).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Department Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Department Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedProfileHOD.currentMentors}</p>
                    <p className="text-xs text-gray-600">Current Mentors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedProfileHOD.activeTrainees}</p>
                    <p className="text-xs text-gray-600">Total Trainees</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedProfileHOD.completedPrograms}</p>
                    <p className="text-xs text-gray-600">Completed Programs</p>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfileHOD.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsProfileDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
} 