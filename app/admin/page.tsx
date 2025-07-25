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
  RefreshCw
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
  requestedRoleId: number
  departmentId?: number
  institutionName?: string
  purpose?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requestedAt: string
  reviewedAt?: string
  reviewComment?: string
  requestedRole: {
    id: number
    name: string
    description: string
  }
  department?: {
    id: number
    name: string
    code: string
  }
  reviewer?: {
    firstName: string
    lastName: string
    email: string
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  useEffect(() => {
    // Check authentication and admin role
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Check if user has admin privileges
    const adminRoles = ['L&D HoD', 'System Administrator', 'Admin']
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
      setIsRefreshing(true)
      const response = await fetch("/api/access-requests")
      
      if (!response.ok) {
        throw new Error("Failed to fetch access requests")
      }
      
      const data = await response.json()
      setAccessRequests(data)
    } catch (error) {
      console.error("Failed to load access requests:", error)
      setMessage("Failed to load access requests")
      setMessageType("error")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRequestAction = async (requestId: number, action: 'approve' | 'reject') => {
    setIsProcessing(true)
    
    try {
      const response = await fetch(`/api/access-requests/${requestId}`, {
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
        throw new Error(data.error || `Failed to ${action} request`)
      }

      // Send email notification with correct format
      await sendEmailNotification(selectedRequest!, action, reviewComment, data.defaultPassword)

      // Refresh the requests list
      await loadAccessRequests()
      
      setMessage(data.message || `Request ${action}d successfully and user notified via email!`)
      setMessageType("success")
      setSelectedRequest(null)
      setReviewComment("")
      
      // Show default password for approved requests
      if (action === 'approve' && data.defaultPassword) {
        setMessage(`Request approved successfully! User account created with Employee ID: ${selectedRequest!.employeeId} and password: ${data.defaultPassword}. User has been notified via email.`)
      }
      
      setTimeout(() => setMessage(""), 10000)
      
    } catch (error) {
      console.error(`Failed to ${action} request:`, error)
      setMessage(`Failed to ${action} request: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setMessageType("error")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setIsProcessing(false)
    }
  }

  const sendEmailNotification = async (request: AccessRequest, action: 'approve' | 'reject', comment: string, defaultPassword?: string) => {
    try {
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: action === 'approve' ? 'access_approved' : 'access_rejected',
          to: request.email,
          userName: `${request.firstName} ${request.lastName}`,
          employeeId: request.employeeId,
          password: defaultPassword || 'Welcome@123',
          reason: comment || null
        })
      })
    } catch (error) {
      console.error('Failed to send email notification:', error)
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
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin panel...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage access requests and user approvals</p>
          </div>
          <Button 
            onClick={loadAccessRequests} 
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {message && (
          <Alert className={messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={messageType === "success" ? "text-green-700" : "text-red-700"}>
              {message}
            </AlertDescription>
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
              {pendingCount > 0 && (
                <div className="mt-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Requires Attention</Badge>
                </div>
              )}
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
                  <SelectItem value="all">All Requests ({accessRequests.length})</SelectItem>
                  <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
                  <SelectItem value="approved">Approved ({approvedCount})</SelectItem>
                  <SelectItem value="rejected">Rejected ({rejectedCount})</SelectItem>
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
              Review and manage user access requests from the registration form
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading requests...</span>
              </div>
            ) : (
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
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {request.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.employeeId}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">{request.requestedRole.name}</Badge>
                      </TableCell>
                      <TableCell>{request.department?.name || 'Not specified'}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(request.requestedAt).toLocaleDateString()}
                          <div className="text-xs text-gray-500">
                            {new Date(request.requestedAt).toLocaleTimeString()}
                          </div>
                        </div>
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
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Access Request Review</DialogTitle>
                              <DialogDescription>
                                Review the access request details and take appropriate action
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedRequest && (
                              <div className="space-y-6">
                                {/* User Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Full Name:</span>
                                        <span>{selectedRequest.firstName} {selectedRequest.lastName}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">Email:</span>
                                        <div className="flex items-center">
                                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                          <span>{selectedRequest.email}</span>
                                        </div>
                                      </div>
                                      {selectedRequest.phone && (
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Phone:</span>
                                          <div className="flex items-center">
                                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>{selectedRequest.phone}</span>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="font-medium">Employee ID:</span>
                                        <Badge variant="outline">{selectedRequest.employeeId}</Badge>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Request Details</h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Requested Role:</span>
                                        <Badge className="bg-blue-100 text-blue-800">{selectedRequest.requestedRole.name}</Badge>
                                      </div>
                                      {selectedRequest.department && (
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Department:</span>
                                          <div className="flex items-center">
                                            <Building className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>{selectedRequest.department.name}</span>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="font-medium">Status:</span>
                                        {getStatusBadge(selectedRequest.status)}
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">Requested On:</span>
                                        <div className="flex items-center">
                                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                          <span>{new Date(selectedRequest.requestedAt).toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Institution and Purpose */}
                                {(selectedRequest.institutionName || selectedRequest.purpose) && (
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Additional Information</h4>
                                    {selectedRequest.institutionName && (
                                      <div>
                                        <span className="font-medium text-sm">Institution:</span>
                                        <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{selectedRequest.institutionName}</p>
                                      </div>
                                    )}
                                    {selectedRequest.purpose && (
                                      <div>
                                        <span className="font-medium text-sm">Purpose/Reason for Access:</span>
                                        <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{selectedRequest.purpose}</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Review Section */}
                                {selectedRequest.status === 'PENDING' && (
                                  <div className="space-y-4 border-t pt-6">
                                    <h4 className="font-semibold text-gray-900">Review & Action</h4>
                                    <div>
                                      <Label htmlFor="reviewComment">Review Comment (Optional)</Label>
                                      <Textarea
                                        id="reviewComment"
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Add a comment about your decision (this will be included in the email notification)..."
                                        rows={3}
                                        className="mt-1"
                                      />
                                    </div>
                                    
                                    <div className="flex space-x-3 pt-4">
                                      <Button
                                        onClick={() => handleRequestAction(selectedRequest.id, 'approve')}
                                        disabled={isProcessing}
                                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                      >
                                        {isProcessing ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <UserCheck className="h-4 w-4 mr-2" />
                                        )}
                                        Approve & Create Account
                                      </Button>
                                      
                                      <Button
                                        onClick={() => handleRequestAction(selectedRequest.id, 'reject')}
                                        disabled={isProcessing}
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        {isProcessing ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <UserX className="h-4 w-4 mr-2" />
                                        )}
                                        Reject Request
                                      </Button>
                                    </div>
                                    
                                    <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
                                      <strong>Note:</strong> Approving this request will:
                                      <ul className="list-disc list-inside mt-1 space-y-1">
                                        <li>Create a user account with default password "Welcome@123"</li>
                                        <li>Send email notification with login credentials</li>
                                        <li>Grant access to the requested role: {selectedRequest.requestedRole.name}</li>
                                      </ul>
                                    </div>
                                  </div>
                                )}

                                {/* Review History */}
                                {selectedRequest.status !== 'PENDING' && (
                                  <div className="space-y-4 border-t pt-6">
                                    <h4 className="font-semibold text-gray-900">Review History</h4>
                                    <div className="bg-gray-50 p-4 rounded">
                                      <div className="flex items-center justify-between mb-2">
                                        {getStatusBadge(selectedRequest.status)}
                                        <span className="text-sm text-gray-500">
                                          {selectedRequest.reviewedAt ? new Date(selectedRequest.reviewedAt).toLocaleString() : 'N/A'}
                                        </span>
                                      </div>
                                      {selectedRequest.reviewer && (
                                        <p className="text-sm text-gray-600 mb-2">
                                          <strong>Reviewed by:</strong> {selectedRequest.reviewer.firstName} {selectedRequest.reviewer.lastName}
                                        </p>
                                      )}
                                      {selectedRequest.reviewComment && (
                                        <div>
                                          <strong className="text-sm">Comment:</strong>
                                          <p className="text-sm text-gray-600 mt-1">{selectedRequest.reviewComment}</p>
                                        </div>
                                      )}
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
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No access requests found</h3>
                <p className="text-gray-500">
                  {filterStatus === "all" 
                    ? "No users have submitted access requests yet." 
                    : `No ${filterStatus} requests found. Try changing the filter.`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}