"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  Users,
  Building,
  Mail,
  Send,
  RefreshCw,
  AlertTriangle,
  UserCheck
} from "lucide-react"
import { toast } from "sonner"

interface ForwardedStudentDetails {
  id: number
  notificationId: number
  department: string
  applicationsCount: number
  applications: StudentApplication[] // Changed from string to array
  forwardedBy: string // Changed from number to string (name)
  forwardedByEmail: string
  receivedAt: string // Changed from createdAt
  status: 'UNREAD' | 'READ' // Changed to match API response
  notification?: {
    title: string
    message: string
    priority: string
  }
  forwardedByUser?: {
    firstName: string
    lastName: string
    email: string
  }
}

interface StudentApplication {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  institutionName: string
  courseName: string
  currentYear: number
  cgpa: number
  preferredDepartment: string
  internshipDuration: number
  skills?: string
  projectInterests?: string
  status: string
  createdAt: string
}

interface ForwardedStudentDetailsSectionProps {
  user: any
}

export function ForwardedStudentDetailsSection({ user }: ForwardedStudentDetailsSectionProps) {
  const [forwardedDetails, setForwardedDetails] = useState<ForwardedStudentDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDetail, setSelectedDetail] = useState<ForwardedStudentDetails | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [reviewComment, setReviewComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadForwardedDetails()
  }, [])

  const loadForwardedDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/notifications/forwarded-student-details?userId=${user.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setForwardedDetails(data.forwardedDetails || [])
      } else {
        console.error("Failed to load forwarded details")
        setForwardedDetails([])
      }
    } catch (error) {
      console.error("Error loading forwarded details:", error)
      setForwardedDetails([])
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (detail: ForwardedStudentDetails) => {
    setSelectedDetail(detail)
    setSelectedStudents([])
    setReviewComment("")
  }

  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleSelectAllStudents = () => {
    if (!selectedDetail) return
    setSelectedStudents(selectedDetail.applications.map(app => app.id))
  }

  const handleDeselectAllStudents = () => {
    setSelectedStudents([])
  }

  const handleApproveStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student to approve")
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/notifications/approve-forwarded-students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forwardedDetailId: selectedDetail?.id,
          selectedStudentIds: selectedStudents,
          reviewComment,
          approvedBy: user.id
        })
      })

      if (!response.ok) {
        throw new Error("Failed to approve students")
      }

      const result = await response.json()
      toast.success(`✅ Successfully approved ${selectedStudents.length} students for department assignment`)
      
      // Reload the forwarded details
      await loadForwardedDetails()
      setSelectedDetail(null)
      setSelectedStudents([])
      setReviewComment("")
    } catch (error) {
      console.error("Error approving students:", error)
      toast.error("Failed to approve students. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student to reject")
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/notifications/reject-forwarded-students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forwardedDetailId: selectedDetail?.id,
          selectedStudentIds: selectedStudents,
          reviewComment,
          rejectedBy: user.id
        })
      })

      if (!response.ok) {
        throw new Error("Failed to reject students")
      }

      const result = await response.json()
      toast.success(`✅ Successfully rejected ${selectedStudents.length} students`)
      
      // Reload the forwarded details
      await loadForwardedDetails()
      setSelectedDetail(null)
      setSelectedStudents([])
      setReviewComment("")
    } catch (error) {
      console.error("Error rejecting students:", error)
      toast.error("Failed to reject students. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_LND_REVIEW":
      case "UNREAD":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>
      case "APPROVED_BY_LND":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "REJECTED_BY_LND":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "READ":
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Reviewed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading forwarded student details...</span>
      </div>
    )
  }

  if (forwardedDetails.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No forwarded student details</h3>
        <p className="text-gray-500">
          No student applications have been forwarded by the L&D Coordinator for your review.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <strong>{forwardedDetails.length} forwarded student detail(s)</strong> awaiting your review and approval for department assignment.
        </AlertDescription>
      </Alert>

      {/* Forwarded Details Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Forwarded By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forwardedDetails.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">{detail.department}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{detail.applicationsCount} students</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {detail.forwardedByUser?.firstName} {detail.forwardedByUser?.lastName}
                    </div>
                    <div className="text-gray-500">L&D Coordinator</div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(detail.status)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(detail.receivedAt).toLocaleDateString()}</div>
                    <div className="text-gray-500">
                      {new Date(detail.receivedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReview(detail)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Review Student Applications</DialogTitle>
                        <DialogDescription>
                          Review and approve/reject student applications for {detail.department} department
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedDetail && (
                        <div className="space-y-6">
                          {/* Department Information */}
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-medium text-blue-900 mb-2">Department Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Department:</span> {detail.department}
                              </div>
                              <div>
                                <span className="font-medium">Total Students:</span> {detail.applicationsCount}
                              </div>
                              <div>
                                <span className="font-medium">Forwarded By:</span> {detail.forwardedByUser?.firstName} {detail.forwardedByUser?.lastName}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {new Date(detail.receivedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          {/* Student Selection */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Select Students to Review</Label>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleSelectAllStudents}
                                >
                                  Select All
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleDeselectAllStudents}
                                >
                                  Deselect All
                                </Button>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                              {(() => {
                                return detail.applications.map((student) => (
                                  <div key={student.id} className="flex items-center space-x-3 p-3 border-b last:border-b-0 hover:bg-gray-50">
                                    <input
                                      type="checkbox"
                                      id={`student-${student.id}`}
                                      checked={selectedStudents.includes(student.id)}
                                      onChange={() => handleStudentSelection(student.id)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`student-${student.id}`} className="flex-1 cursor-pointer">
                                      <div className="font-medium">{student.firstName} {student.lastName}</div>
                                      <div className="text-sm text-gray-500">
                                        {student.email} • {student.institutionName}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {student.courseName} • CGPA: {student.cgpa}
                                      </div>
                                    </label>
                                    <Badge variant="outline" className="text-xs">
                                      {student.preferredDepartment}
                                    </Badge>
                                  </div>
                                ))
                              })()}
                            </div>
                          </div>

                          {/* Review Comment */}
                          <div className="space-y-2">
                            <Label htmlFor="review-comment">Review Comment (Optional)</Label>
                            <Textarea
                              id="review-comment"
                              placeholder="Add any comments about your decision..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              rows={3}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedDetail(null)
                                setSelectedStudents([])
                                setReviewComment("")
                              }}
                              disabled={isProcessing}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleRejectStudents}
                              disabled={selectedStudents.length === 0 || isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject Selected
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={handleApproveStudents}
                              disabled={selectedStudents.length === 0 || isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve Selected
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 