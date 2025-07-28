"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Upload, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  X
} from "lucide-react"

interface Attachment {
  id: number
  fileName: string
  fileSize: number
  fileType: string
  uploadDate: string
  uploader: {
    firstName: string
    lastName: string
  }
}

interface ProgressReport {
  id: number
  reportTitle: string
  reportContent: string
  reportType: string
  status: string
  submissionDate: string
  reviewedDate?: string
  mentorFeedback?: string
  performanceRating?: number
  attachments: Attachment[]
  submitter: {
    firstName: string
    lastName: string
    employeeId: string
  }
  assignment?: {
    mentor: {
      firstName: string
      lastName: string
      employeeId: string
    }
    request: {
      traineeName: string
      institutionName: string
    }
  }
}

export default function UploadProgressPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [progressReports, setProgressReports] = useState<ProgressReport[]>([])
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [viewingAttachment, setViewingAttachment] = useState<Attachment | null>(null)
  const [downloadingAttachment, setDownloadingAttachment] = useState<number | null>(null)

  useEffect(() => {
    console.log("=== UPLOAD PROGRESS PAGE INITIALIZATION ===")
    const userData = localStorage.getItem("user")
    console.log("User data from localStorage:", userData)
    if (!userData) {
      console.log("No user data found, redirecting to login")
      router.push("/login")
      setLoading(false)
      return
    }
    
    try {
      const parsedUser = JSON.parse(userData)
      console.log("Parsed user data:", parsedUser)
      setUser(parsedUser)
      console.log("About to call loadProgressReports...")
      loadProgressReports()
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/login")
      setLoading(false)
    }
  }, [router])

  const loadProgressReports = async () => {
    console.log("=== LOADING PROGRESS REPORTS ===")
    try {
      console.log("Loading progress reports...")
      const response = await fetch("/api/progress-reports")
      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)
      if (!response.ok) {
        throw new Error("Failed to load progress reports")
      }
      
      const data = await response.json()
      console.log("Progress reports data:", data)
      if (data.success) {
        console.log("Setting progress reports:", data.data)
        setProgressReports(data.data)
        console.log("Progress reports set successfully")
      } else {
        throw new Error(data.error || "Failed to load progress reports")
      }
    } catch (error) {
      console.error("Error loading progress reports:", error)
      toast({
        title: "Error",
        description: "Failed to load progress reports. Please try again.",
        variant: "destructive",
      })
    } finally {
      console.log("Setting loading to false")
      setLoading(false)
    }
  }

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached, setting loading to false")
        setLoading(false)
      }
    }, 5000) // 5 seconds timeout

    return () => clearTimeout(timeout)
  }, [loading])

  // Force loading to false after 3 seconds for debugging
  useEffect(() => {
    const forceTimeout = setTimeout(() => {
      console.log("Force setting loading to false for debugging")
      setLoading(false)
    }, 3000)

    return () => clearTimeout(forceTimeout)
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      "DRAFT": { color: "bg-gray-100 text-gray-800", icon: Clock },
      "SUBMITTED": { color: "bg-blue-100 text-blue-800", icon: Upload },
      "REVIEWED": { color: "bg-yellow-100 text-yellow-800", icon: Eye },
      "APPROVED": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "REJECTED": { color: "bg-red-100 text-red-800", icon: AlertTriangle }
    }
    
    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", icon: Clock }
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const categoryConfig: Record<string, string> = {
      "WEEKLY": "bg-blue-100 text-blue-800",
      "MONTHLY": "bg-purple-100 text-purple-800",
      "FINAL": "bg-orange-100 text-orange-800"
    }
    
    return <Badge className={categoryConfig[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitReport = async (formData: FormData) => {
    setUploading(true)
    try {
      const reportData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as 'WEEKLY' | 'MONTHLY' | 'FINAL',
        progressPercentage: parseInt(formData.get("progressPercentage") as string),
      }

      // Create the progress report
      const reportResponse = await fetch("/api/progress-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      })

      if (!reportResponse.ok) {
        const errorData = await reportResponse.json()
        throw new Error(errorData.error || "Failed to create progress report")
      }

      const reportResult = await reportResponse.json()
      const newReport = reportResult.data

      // Upload attachments if any
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const attachmentFormData = new FormData()
          attachmentFormData.append("file", file)
          attachmentFormData.append("reportId", newReport.id.toString())

          const attachmentResponse = await fetch("/api/progress-reports/upload", {
            method: "POST",
            body: attachmentFormData,
          })

          if (!attachmentResponse.ok) {
            console.error(`Failed to upload attachment: ${file.name}`)
          }
        }
      }

      // Reload progress reports
      await loadProgressReports()
      
      setShowUploadDialog(false)
      setSelectedFiles([])
      
      toast({
        title: "Success",
        description: "Progress report submitted successfully!",
      })
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit report",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleViewAttachment = async (attachment: Attachment) => {
    setViewingAttachment(attachment)
    try {
      const response = await fetch(`/api/download/${attachment.id}`)
      if (!response.ok) {
        throw new Error("Failed to get download URL")
      }
      
      const data = await response.json()
      if (data.success) {
        // Open the file in a new tab
        window.open(data.data.downloadUrl, '_blank')
      } else {
        throw new Error(data.error || "Failed to get download URL")
      }
    } catch (error) {
      console.error("Error viewing attachment:", error)
      toast({
        title: "Error",
        description: "Failed to view attachment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadAttachment = async (attachment: Attachment) => {
    setDownloadingAttachment(attachment.id)
    try {
      const response = await fetch(`/api/download/${attachment.id}`)
      if (!response.ok) {
        throw new Error("Failed to get download URL")
      }
      
      const data = await response.json()
      if (data.success) {
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = data.data.downloadUrl
        link.download = attachment.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast({
          title: "Success",
          description: "Download started successfully!",
        })
      } else {
        throw new Error(data.error || "Failed to get download URL")
      }
    } catch (error) {
      console.error("Error downloading attachment:", error)
      toast({
        title: "Error",
        description: "Failed to download attachment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloadingAttachment(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    console.log("Page is in loading state")
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  console.log("Rendering page with progress reports:", progressReports.length)
  console.log("User state:", user)
  console.log("Loading state:", loading)
  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Progress</h1>
            <p className="text-gray-600">Manage and track your internship progress reports</p>
          </div>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Upload Progress Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Progress Report</DialogTitle>
                <DialogDescription>
                  Submit a new progress report to share your achievements and challenges with your mentor.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleSubmitReport(formData)
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Report Title</Label>
                    <Input id="title" name="title" placeholder="e.g., Week 1 Progress Report" required />
                  </div>
                  <div>
                    <Label htmlFor="category">Report Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEEKLY">Weekly Report</SelectItem>
                        <SelectItem value="MONTHLY">Monthly Report</SelectItem>
                        <SelectItem value="FINAL">Final Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Progress Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Describe your progress, achievements, challenges, and next steps..."
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="progressPercentage">Progress Percentage</Label>
                  <Input 
                    id="progressPercentage" 
                    name="progressPercentage" 
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="Enter progress percentage"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="file">Attach Files (Optional)</Label>
                  <Input 
                    id="file" 
                    type="file" 
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    multiple
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB per file)
                  </p>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <Label className="text-sm font-medium">Selected Files:</Label>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeSelectedFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowUploadDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Submit Report"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-blue-600">{progressReports.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Reports</p>
                  <p className="text-2xl font-bold text-green-600">
                    {progressReports.filter(r => r.status === "APPROVED").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {progressReports.filter(r => r.status === "SUBMITTED").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {progressReports.filter(r => r.performanceRating).length > 0 
                      ? (progressReports.filter(r => r.performanceRating).reduce((sum, r) => sum + (r.performanceRating || 0), 0) / progressReports.filter(r => r.performanceRating).length).toFixed(1)
                      : "N/A"
                    }
                  </p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Reports List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Progress Reports
            </CardTitle>
            <CardDescription>View and manage all your submitted progress reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{report.reportTitle}</h3>
                        {getStatusBadge(report.status)}
                        {getCategoryBadge(report.reportType)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{report.reportContent}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Submitted: {new Date(report.submissionDate).toLocaleDateString()}
                        </span>
                        {report.reviewedDate && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Reviewed: {new Date(report.reviewedDate).toLocaleDateString()}
                          </span>
                        )}
                        {report.performanceRating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            Rating: {report.performanceRating}/5
                          </span>
                        )}
                      </div>
                      {report.attachments.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                          <div className="flex flex-wrap gap-2">
                            {report.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{attachment.fileName}</span>
                                <span className="text-xs text-gray-500">({formatFileSize(attachment.fileSize)})</span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewAttachment(attachment)}
                                    disabled={viewingAttachment?.id === attachment.id}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownloadAttachment(attachment)}
                                    disabled={downloadingAttachment === attachment.id}
                                  >
                                    {downloadingAttachment === attachment.id ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                                    ) : (
                                      <Download className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {report.mentorFeedback && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">Mentor Feedback:</p>
                          <p className="text-sm text-blue-700">{report.mentorFeedback}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {report.status === "DRAFT" && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((report.performanceRating || 0) * 20)}%</span>
                    </div>
                    <Progress value={(report.performanceRating || 0) * 20} className="h-2" />
                  </div>
                </div>
              ))}
              
              {progressReports.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Reports</h3>
                  <p className="text-gray-600 mb-4">Start by uploading your first progress report to track your internship journey.</p>
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload First Report
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 