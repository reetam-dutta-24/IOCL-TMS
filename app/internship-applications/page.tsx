"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Users, FileText, Clock, CheckCircle, XCircle, Eye, Download, 
  Filter, Search, Calendar, GraduationCap, Building, Mail, Phone, Star,
  Send, Forward
} from "lucide-react"

interface Application {
  id: number
  applicationNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  institutionName: string
  courseName: string
  currentYear: number
  cgpa: number | null
  preferredDepartment: string
  internshipDuration: number
  startDate: string
  endDate: string
  skills: string | null
  projectInterests: string | null
  motivation: string
  status: string
  reviewNotes: string | null
  createdAt: string
  resumePath: string | null
  coverLetterPath: string | null
}

export default function InternshipApplicationsPage() {
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [isReviewing, setIsReviewing] = useState(false)
  const [isForwarding, setIsForwarding] = useState(false)
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false)
  const [selectedApplicationsForForward, setSelectedApplicationsForForward] = useState<Application[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    underReview: 0
  })

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/internship-applications")
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications || [])
        calculateStats(data.applications || [])
      }
    } catch (error) {
      console.error("Error loading applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (apps: Application[]) => {
    setStats({
      total: apps.length,
      pending: apps.filter(app => app.status === "PENDING").length,
      approved: apps.filter(app => app.status === "APPROVED").length,
      rejected: apps.filter(app => app.status === "REJECTED").length,
      underReview: apps.filter(app => app.status === "UNDER_REVIEW").length
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      UNDER_REVIEW: { color: "bg-blue-100 text-blue-800", icon: Eye },
      APPROVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle },
      MENTOR_ASSIGNED: { color: "bg-purple-100 text-purple-800", icon: Users },
      ACCEPTED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      DECLINED: { color: "bg-red-100 text-red-800", icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || app.preferredDepartment === departmentFilter
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const handleReview = async (applicationId: number, newStatus: string) => {
    try {
      setIsReviewing(true)
      const response = await fetch(`/api/internship-applications/${applicationId}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          reviewNotes: reviewNotes
        })
      })

      if (response.ok) {
        await loadApplications()
        setSelectedApplication(null)
        setReviewNotes("")
      }
    } catch (error) {
      console.error("Error updating application:", error)
    } finally {
      setIsReviewing(false)
    }
  }

  const handleForwardToHod = async () => {
    setIsForwarding(true)
    try {
      // Group applications by department
      const applicationsByDepartment = selectedApplicationsForForward.reduce((acc, app) => {
        const dept = app.preferredDepartment
        if (!acc[dept]) {
          acc[dept] = []
        }
        acc[dept].push(app)
        return acc
      }, {} as Record<string, Application[]>)

      // Forward each department's applications
      for (const [department, applications] of Object.entries(applicationsByDepartment)) {
        const response = await fetch("/api/notifications/forward-to-hod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department,
            applications: applications.map(app => ({
              id: app.id,
              firstName: app.firstName,
              lastName: app.lastName,
              email: app.email,
              institutionName: app.institutionName,
              courseName: app.courseName,
              internshipDuration: app.internshipDuration,
              skills: app.skills,
              projectInterests: app.projectInterests
            }))
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to forward applications for ${department}`)
        }
      }

      // Reload applications to update status
      await loadApplications()
      setForwardDialogOpen(false)
      setSelectedApplicationsForForward([])
      
      // Show success message
      alert("Successfully forwarded approved applications to Department HoDs!")
    } catch (error) {
      console.error("Error forwarding applications:", error)
      alert("Failed to forward applications. Please try again.")
    } finally {
      setIsForwarding(false)
    }
  }

  const openForwardDialog = () => {
    const approvedApplications = applications.filter(app => app.status === "APPROVED")
    if (approvedApplications.length === 0) {
      alert("No approved applications to forward.")
      return
    }
    setSelectedApplicationsForForward(approvedApplications)
    setForwardDialogOpen(true)
  }

  const handleDownload = async (applicationId: number, fileType: "resume" | "coverLetter") => {
    try {
      const response = await fetch(`/api/internship-applications/${applicationId}/download?type=${fileType}`)
      
      if (!response.ok) {
        throw new Error(`Failed to download ${fileType}`)
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get("content-disposition")
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch ? filenameMatch[1] : `${fileType}.pdf`

      // Create a blob from the response
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(`Error downloading ${fileType}:`, error)
      alert(`Failed to download ${fileType}. Please try again.`)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Internship Applications</h1>
            <p className="text-gray-600">Manage and review internship applications from external students</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openForwardDialog} disabled={loading || stats.approved === 0}>
              <Forward className="mr-2 h-4 w-4" />
              Forward to HoD
            </Button>
            <Button onClick={loadApplications} disabled={loading}>
              <FileText className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="IT">Information Technology</SelectItem>
                  <SelectItem value="ENG">Engineering</SelectItem>
                  <SelectItem value="OPS">Operations</SelectItem>
                  <SelectItem value="FIN">Finance</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="LD">Learning & Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>
              Review and manage internship applications from external students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application #</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.applicationNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.firstName} {app.lastName}</p>
                            <p className="text-sm text-gray-500">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.institutionName}</p>
                            <p className="text-sm text-gray-500">{app.courseName} - Year {app.currentYear}</p>
                          </div>
                        </TableCell>
                        <TableCell>{app.preferredDepartment}</TableCell>
                        <TableCell>{app.internshipDuration} weeks</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Application Details</DialogTitle>
                                <DialogDescription>
                                  Review application #{app.applicationNumber}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Name</p>
                                      <p>{app.firstName} {app.lastName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Email</p>
                                      <p>{app.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Phone</p>
                                      <p>{app.phone}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Institution</p>
                                      <p>{app.institutionName}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Academic Information */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Academic Information</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Course</p>
                                      <p>{app.courseName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Current Year</p>
                                      <p>{app.currentYear}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">CGPA</p>
                                      <p>{app.cgpa || "Not provided"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Preferred Department</p>
                                      <p>{app.preferredDepartment}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Internship Details */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Internship Details</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Duration</p>
                                      <p>{app.internshipDuration} weeks</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Start Date</p>
                                      <p>{new Date(app.startDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">End Date</p>
                                      <p>{new Date(app.endDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Status</p>
                                      <div className="mt-1">{getStatusBadge(app.status)}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Skills and Interests */}
                                {app.skills && (
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
                                    <p className="text-gray-700">{app.skills}</p>
                                  </div>
                                )}

                                {app.projectInterests && (
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3">Project Interests</h3>
                                    <p className="text-gray-700">{app.projectInterests}</p>
                                  </div>
                                )}

                                {/* Motivation */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Motivation</h3>
                                  <p className="text-gray-700">{app.motivation}</p>
                                </div>

                                {/* Documents */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Documents</h3>
                                  <div className="flex space-x-4">
                                    {app.resumePath && (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleDownload(app.id, "resume")}
                                      >
                                        <Download className="h-4 w-4 mr-1" />
                                        Download Resume
                                      </Button>
                                    )}
                                    {app.coverLetterPath && (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleDownload(app.id, "coverLetter")}
                                      >
                                        <Download className="h-4 w-4 mr-1" />
                                        Download Cover Letter
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* Review Section */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Review Decision</h3>
                                  <div className="space-y-4">
                                    <Textarea
                                      placeholder="Add review notes..."
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      rows={3}
                                    />
                                    <div className="flex space-x-2">
                                      <Button 
                                        onClick={() => handleReview(app.id, "APPROVED")}
                                        disabled={isReviewing}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                      </Button>
                                      <Button 
                                        onClick={() => handleReview(app.id, "REJECTED")}
                                        disabled={isReviewing}
                                        variant="destructive"
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                      <Button 
                                        onClick={() => handleReview(app.id, "UNDER_REVIEW")}
                                        disabled={isReviewing}
                                        variant="outline"
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Mark Under Review
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forward to HoD Dialog */}
        <Dialog open={forwardDialogOpen} onOpenChange={setForwardDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Forward Approved Applications to Department HoDs</DialogTitle>
              <DialogDescription>
                Forward approved internship applications to the respective Department HoDs for mentor assignment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This will forward {selectedApplicationsForForward.length} approved application(s) 
                  to their respective Department HoDs. The HoDs will receive notifications and can assign mentors.
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <h4 className="font-medium mb-2">Applications to be forwarded:</h4>
                <div className="space-y-2">
                  {selectedApplicationsForForward.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{app.firstName} {app.lastName}</p>
                        <p className="text-sm text-gray-600">{app.institutionName} • {app.preferredDepartment}</p>
                      </div>
                      <Badge variant="outline">{app.internshipDuration} weeks</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setForwardDialogOpen(false)}
                  disabled={isForwarding}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleForwardToHod}
                  disabled={isForwarding}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isForwarding ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Forwarding...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Forward to HoDs
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
} 