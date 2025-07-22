"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Route,
  FileText,
  Users,
  Award,
  RefreshCw,
  User
} from "lucide-react"
import { PageLoading } from "@/components/ui/page-loading"

interface Request {
  id: string
  traineeName: string
  institution: string
  program: string
  department: string
  status: string
  submittedDate: string
  coordinator?: string
  assignedMentor?: string
  priority: string
  description?: string
  duration?: string
  requirements?: string[]
}

export default function RequestsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<Request[]>([])
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [actionComment, setActionComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    loadRequests(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const loadRequests = (currentUser: any) => {
    // Mock data - in real implementation, this would be role-filtered API calls
    const allRequests: Request[] = [
      {
        id: "REQ001",
        traineeName: "Arjun Reddy",
        institution: "IIT Delhi",
        program: "Summer Internship 2024",
        department: "Information Technology",
        status: "PENDING_PROCESSING",
        submittedDate: "2024-01-15",
        coordinator: "Priya Sharma",
        priority: "HIGH",
        description: "Software development internship focusing on API development",
        duration: "3 months",
        requirements: ["Programming", "Database knowledge", "API development"]
      },
      {
        id: "REQ002",
        traineeName: "Sneha Patel",
        institution: "NIT Surathkal",
        program: "Research Project",
        department: "Operations",
        status: "PENDING_MENTOR_ASSIGNMENT",
        submittedDate: "2024-01-12",
        coordinator: "Rajesh Kumar",
        priority: "MEDIUM",
        description: "Process optimization and automation study",
        duration: "6 months"
      },
      {
        id: "REQ003", 
        traineeName: "Vikram Singh",
        institution: "BITS Pilani",
        program: "Technical Training",
        department: "Engineering",
        status: "APPROVED",
        submittedDate: "2024-01-10",
        coordinator: "Amit Gupta",
        assignedMentor: "Dr. K Sharma",
        priority: "LOW",
        description: "Mechanical engineering project on equipment optimization"
      },
      {
        id: "REQ004",
        traineeName: "Ananya Iyer",
        institution: "Anna University", 
        program: "Industrial Training",
        department: "Information Technology",
        status: "IN_PROGRESS",
        submittedDate: "2024-01-08",
        coordinator: "Priya Sharma",
        assignedMentor: "Vikram Gupta",
        priority: "MEDIUM"
      },
      {
        id: "REQ005",
        traineeName: "Rohit Mehta",
        institution: "DTU Delhi",
        program: "Project Work",
        department: "Operations",
        status: "PENDING_HOD_APPROVAL",
        submittedDate: "2024-01-14",
        coordinator: "Rajesh Kumar",
        priority: "HIGH"
      }
    ]

    // Filter based on user role and permissions
    let roleFilteredRequests = allRequests

    switch (currentUser.role) {
      case "L&D Coordinator":
        // Can view all requests for processing and monitoring
        roleFilteredRequests = allRequests
        break
        
      case "L&D HoD":
        // Can view all L&D related data
        roleFilteredRequests = allRequests
        break
        
      case "Department HoD":
        // Can only view requests assigned to their department
        roleFilteredRequests = allRequests.filter(req => 
          req.department === currentUser.department
        )
        break
        
      case "Mentor":
        // Can only view requests assigned to them
        roleFilteredRequests = allRequests.filter(req => 
          req.assignedMentor === `${currentUser.firstName} ${currentUser.lastName}` ||
          req.status === "PENDING_MENTOR_ASSIGNMENT"
        )
        break
        
      default:
        // Limited view for other roles
        roleFilteredRequests = allRequests.filter(req => 
          req.coordinator === `${currentUser.firstName} ${currentUser.lastName}`
        )
    }

    setRequests(roleFilteredRequests)
    setFilteredRequests(roleFilteredRequests)
  }

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.traineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }, [searchTerm, statusFilter, requests])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PROCESSING":
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Pending Processing</Badge>
      case "PENDING_MENTOR_ASSIGNMENT":
        return <Badge className="bg-orange-100 text-orange-800"><Users className="h-3 w-3 mr-1" />Awaiting Mentor</Badge>
      case "PENDING_HOD_APPROVAL":
        return <Badge className="bg-purple-100 text-purple-800"><Clock className="h-3 w-3 mr-1" />HoD Approval</Badge>
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800"><FileText className="h-3 w-3 mr-1" />In Progress</Badge>
      case "COMPLETED":
        return <Badge className="bg-gray-100 text-gray-800"><Award className="h-3 w-3 mr-1" />Completed</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

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

  const canTakeAction = (request: Request) => {
    switch (user?.role) {
      case "L&D Coordinator":
        return ["PENDING_PROCESSING"].includes(request.status)
      case "L&D HoD":
        return ["PENDING_HOD_APPROVAL", "APPROVED"].includes(request.status)
      case "Department HoD":
        return request.status === "PENDING_MENTOR_ASSIGNMENT" && request.department === user.department
      case "Mentor":
        return request.assignedMentor === `${user.firstName} ${user.lastName}` && 
               ["IN_PROGRESS", "APPROVED"].includes(request.status)
      default:
        return false
    }
  }

  const getActionButtons = (request: Request) => {
    if (!canTakeAction(request)) return null

    switch (user?.role) {
      case "L&D Coordinator":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAction(request, "PROCESS")}>
              <Route className="h-3 w-3 mr-1" />
              Process
            </Button>
          </div>
        )
      case "L&D HoD":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAction(request, "APPROVE")}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleAction(request, "REJECT")}>
              <XCircle className="h-3 w-3 mr-1" />
              Reject
            </Button>
          </div>
        )
      case "Department HoD":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAction(request, "ASSIGN_MENTOR")}>
              <Users className="h-3 w-3 mr-1" />
              Assign Mentor
            </Button>
          </div>
        )
      case "Mentor":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAction(request, "UPDATE_PROGRESS")}>
              <FileText className="h-3 w-3 mr-1" />
              Update Progress
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const handleAction = (request: Request, action: string) => {
    setSelectedRequest(request)
    // Handle different actions based on role and action type
    console.log(`${user.role} performing ${action} on request ${request.id}`)
  }

  const getPageTitle = () => {
    switch (user?.role) {
      case "L&D Coordinator":
        return "All Internship Requests"
      case "L&D HoD":
        return "L&D Request Management"
      case "Department HoD":
        return `${user.department} Department Requests`
      case "Mentor":
        return "My Assigned Requests"
      default:
        return "Requests"
    }
  }

  const getPageDescription = () => {
    switch (user?.role) {
      case "L&D Coordinator":
        return "Process, route, and monitor all internship requests across departments"
      case "L&D HoD":
        return "Final approval and strategic oversight of all L&D programs"
      case "Department HoD":
        return "Manage mentor assignments and departmental coordination"
      case "Mentor":
        return "Track and update progress for your assigned trainees"
      default:
        return "View and manage requests"
    }
  }

  if (loading) {
    return <PageLoading message="Loading requests..." />
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Role-based Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-gray-600 mt-1">{getPageDescription()}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="px-3 py-1">
              {user.role}
            </Badge>
            {user.role === "L&D Coordinator" && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Process New Request
              </Button>
            )}
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Role-specific Alerts */}
        {user.role === "L&D Coordinator" && (
          <Alert className="border-blue-200 bg-blue-50">
            <Route className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Coordination Hub:</strong> You can view all requests, process initial submissions, and route them to appropriate departments.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "L&D HoD" && (
          <Alert className="border-purple-200 bg-purple-50">
            <Award className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-700">
              <strong>Strategic Oversight:</strong> Final approval authority for all L&D programs and policy compliance monitoring.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "Department HoD" && (
          <Alert className="border-green-200 bg-green-50">
            <Users className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Mentor Assignment:</strong> Assign suitable mentors from your department and monitor departmental activities.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "Mentor" && (
          <Alert className="border-orange-200 bg-orange-50">
            <User className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              <strong>Direct Supervision:</strong> Guide your assigned trainees and submit regular progress reports.
            </AlertDescription>
          </Alert>
        )}

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by trainee name, institution, or program..."
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING_PROCESSING">Pending Processing</SelectItem>
                  <SelectItem value="PENDING_MENTOR_ASSIGNMENT">Awaiting Mentor</SelectItem>
                  <SelectItem value="PENDING_HOD_APPROVAL">HoD Approval</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Requests ({filteredRequests.length})
            </CardTitle>
            <CardDescription>
              {user.role === "L&D Coordinator" && "All internship requests across departments"}
              {user.role === "L&D HoD" && "All L&D program requests requiring oversight"}
              {user.role === "Department HoD" && `Requests for ${user.department} department`}
              {user.role === "Mentor" && "Requests assigned to you for mentorship"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Trainee</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Submitted</TableHead>
                    {user.role !== "Mentor" && <TableHead>Coordinator</TableHead>}
                    {["Department HoD", "Mentor"].includes(user.role) && <TableHead>Mentor</TableHead>}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.traineeName}</TableCell>
                      <TableCell>{request.institution}</TableCell>
                      <TableCell>{request.program}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                      {user.role !== "Mentor" && <TableCell>{request.coordinator}</TableCell>}
                      {["Department HoD", "Mentor"].includes(user.role) && (
                        <TableCell>{request.assignedMentor || "Not assigned"}</TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Request Details - {request.id}</DialogTitle>
                                <DialogDescription>
                                  Complete information about this internship request
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Trainee Name</Label>
                                    <p className="text-sm text-gray-600">{request.traineeName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Institution</Label>
                                    <p className="text-sm text-gray-600">{request.institution}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Program</Label>
                                    <p className="text-sm text-gray-600">{request.program}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Department</Label>
                                    <p className="text-sm text-gray-600">{request.department}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <p className="text-sm text-gray-600">{request.duration || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Priority</Label>
                                    <div className="mt-1">{getPriorityBadge(request.priority)}</div>
                                  </div>
                                </div>
                                {request.description && (
                                  <div>
                                    <Label className="text-sm font-medium">Description</Label>
                                    <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                                  </div>
                                )}
                                {request.requirements && (
                                  <div>
                                    <Label className="text-sm font-medium">Requirements</Label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {request.requirements.map((req, index) => (
                                        <Badge key={index} variant="outline">{req}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          {getActionButtons(request)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No requests found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}