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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  UserCheck, 
  UserX, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Search,
  Mail,
  Phone,
  Building,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  Download
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

interface AccessRequest {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  employeeId: string
  requestedRole: string
  department?: string
  institutionName?: string
  purpose?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requestedAt: string
  reviewedAt?: string
  reviewComment?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check authentication and admin role
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Check if user has admin privileges
    const adminRoles = ['L&D HoD', 'System Administrator']
    if (!adminRoles.includes(parsedUser.role)) {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
    loadAccessRequests()
    setIsLoading(false)
  }, [router])

  const loadAccessRequests = async () => {
    try {
      // Simulate API call - replace with actual API
      const mockRequests: AccessRequest[] = [
        {
          id: 1,
          firstName: "Rahul",
          lastName: "Sharma",
          email: "rahul.sharma@example.com",
          phone: "+91-9876543210",
          employeeId: "EMP001",
          requestedRole: "L&D Coordinator",
          department: "Engineering",
          institutionName: "IIT Delhi",
          purpose: "Industrial training coordination",
          status: "PENDING",
          requestedAt: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          firstName: "Priya",
          lastName: "Singh",
          email: "priya.singh@example.com",
          phone: "+91-9876543211",
          employeeId: "EMP002",
          requestedRole: "Mentor",
          department: "HR",
          institutionName: "BITS Pilani",
          purpose: "Student mentorship program",
          status: "PENDING",
          requestedAt: "2024-01-14T14:20:00Z"
        },
        {
          id: 3,
          firstName: "Amit",
          lastName: "Kumar",
          email: "amit.kumar@example.com",
          employeeId: "EMP003",
          requestedRole: "Department HoD",
          department: "Finance",
          status: "APPROVED",
          requestedAt: "2024-01-13T09:15:00Z",
          reviewedAt: "2024-01-13T16:30:00Z",
          reviewComment: "Approved for finance department coordination"
        }
      ]
      
      setAccessRequests(mockRequests)
    } catch (error) {
      console.error("Failed to load access requests:", error)
    }
  }

  const handleRequestAction = async (requestId: number, action: 'approve' | 'reject') => {
    setIsProcessing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update request status
      setAccessRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: action === 'approve' ? 'APPROVED' : 'REJECTED',
              reviewedAt: new Date().toISOString(),
              reviewComment: reviewComment || `Request ${action}d by admin`
            }
          : req
      ))
      
      setMessage(`Request ${action}d successfully!`)
      setSelectedRequest(null)
      setReviewComment("")
      setTimeout(() => setMessage(""), 3000)
      
    } catch (error) {
      setMessage(`Failed to ${action} request`)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredRequests = accessRequests.filter(req => 
    filterStatus === "all" || req.status.toLowerCase() === filterStatus
  )

  const pendingCount = accessRequests.filter(req => req.status === 'PENDING').length
  const approvedCount = accessRequests.filter(req => req.status === 'APPROVED').length
  const rejectedCount = accessRequests.filter(req => req.status === 'REJECTED').length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage access requests and user approvals</p>
          </div>
        </div>

        {message && (
          <Alert className={message.includes("success") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{accessRequests.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Access Requests</CardTitle>
            <CardDescription>
              Review and manage user access requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Requested Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.firstName} {request.lastName}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.employeeId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.requestedRole}</Badge>
                    </TableCell>
                    <TableCell>{request.department || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Access Request Details</DialogTitle>
                              <DialogDescription>
                                Review the access request and take action
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedRequest && (
                              <div className="space-y-6">
                                {/* User Information */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center">
                                        <span className="font-medium w-24">Name:</span>
                                        <span>{selectedRequest.firstName} {selectedRequest.lastName}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{selectedRequest.email}</span>
                                      </div>
                                      {selectedRequest.phone && (
                                        <div className="flex items-center">
                                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                          <span>{selectedRequest.phone}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Request Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center">
                                        <span className="font-medium w-32">Employee ID:</span>
                                        <span>{selectedRequest.employeeId}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium w-32">Requested Role:</span>
                                        <Badge variant="outline">{selectedRequest.requestedRole}</Badge>
                                      </div>
                                      {selectedRequest.department && (
                                        <div className="flex items-center">
                                          <Building className="h-4 w-4 mr-2 text-gray-400" />
                                          <span>{selectedRequest.department}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{new Date(selectedRequest.requestedAt).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Institution and Purpose */}
                                {(selectedRequest.institutionName || selectedRequest.purpose) && (
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Additional Information</h4>
                                    {selectedRequest.institutionName && (
                                      <div>
                                        <span className="font-medium text-sm">Institution:</span>
                                        <p className="text-sm text-gray-600">{selectedRequest.institutionName}</p>
                                      </div>
                                    )}
                                    {selectedRequest.purpose && (
                                      <div>
                                        <span className="font-medium text-sm">Purpose:</span>
                                        <p className="text-sm text-gray-600">{selectedRequest.purpose}</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Review Section */}
                                {selectedRequest.status === 'PENDING' && (
                                  <div className="space-y-4 border-t pt-4">
                                    <div>
                                      <Label htmlFor="reviewComment">Review Comment (Optional)</Label>
                                      <Textarea
                                        id="reviewComment"
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Add a comment about your decision..."
                                        rows={3}
                                      />
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                      <Button
                                        onClick={() => handleRequestAction(selectedRequest.id, 'approve')}
                                        disabled={isProcessing}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        {isProcessing ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <UserCheck className="h-4 w-4 mr-2" />
                                        )}
                                        Approve Request
                                      </Button>
                                      
                                      <Button
                                        onClick={() => handleRequestAction(selectedRequest.id, 'reject')}
                                        disabled={isProcessing}
                                        variant="destructive"
                                      >
                                        {isProcessing ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <UserX className="h-4 w-4 mr-2" />
                                        )}
                                        Reject Request
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* Review History */}
                                {selectedRequest.status !== 'PENDING' && (
                                  <div className="space-y-3 border-t pt-4">
                                    <h4 className="font-semibold text-gray-900">Review History</h4>
                                    <div className="text-sm">
                                      <div className="flex items-center space-x-2">
                                        {getStatusBadge(selectedRequest.status)}
                                        <span className="text-gray-500">
                                          on {selectedRequest.reviewedAt ? new Date(selectedRequest.reviewedAt).toLocaleString() : 'N/A'}
                                        </span>
                                      </div>
                                      {selectedRequest.reviewComment && (
                                        <p className="text-gray-600 mt-2">
                                          <strong>Comment:</strong> {selectedRequest.reviewComment}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No access requests found matching the current filter.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}