"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Upload, Plus, Calendar, CheckCircle, Clock, AlertCircle, Download } from "lucide-react"
import { SubmissionType, SubmissionStatus } from "@/types"

interface Submission {
  id: number
  title: string
  description?: string
  submissionType: SubmissionType
  status: SubmissionStatus
  submittedAt: string
  reviewedAt?: string
  mentorFeedback?: string
  grade?: string
  fileName?: string
}

interface SubmissionsSectionProps {
  userId: string
}

export function SubmissionsSection({ userId }: SubmissionsSectionProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSubmission, setNewSubmission] = useState({
    title: "",
    description: "",
    submissionType: "WEEKLY_REPORT" as SubmissionType,
    content: "",
    file: null as File | null
  })

  useEffect(() => {
    loadSubmissions()
  }, [userId])

  const loadSubmissions = async () => {
    try {
      // Mock data for demonstration
      const mockSubmissions: Submission[] = [
        {
          id: 1,
          title: "Week 8 Progress Report",
          description: "Weekly progress summary with achievements and challenges",
          submissionType: "WEEKLY_REPORT",
          status: "APPROVED",
          submittedAt: "2024-01-20T10:00:00Z",
          reviewedAt: "2024-01-21T14:30:00Z",
          mentorFeedback: "Excellent progress report with clear objectives and achievements",
          grade: "A",
          fileName: "week8_report.pdf"
        },
        {
          id: 2,
          title: "React Component Assignment",
          description: "Build responsive user interface components",
          submissionType: "ASSIGNMENT",
          status: "UNDER_REVIEW",
          submittedAt: "2024-01-19T16:45:00Z",
          fileName: "react_components.zip"
        },
        {
          id: 3,
          title: "Database Schema Design",
          description: "Design comprehensive database schema for e-commerce platform",
          submissionType: "PROJECT_DELIVERABLE",
          status: "NEEDS_REVISION",
          submittedAt: "2024-01-18T11:20:00Z",
          reviewedAt: "2024-01-19T09:15:00Z",
          mentorFeedback: "Good foundation but needs optimization for performance",
          fileName: "db_schema.sql"
        },
        {
          id: 4,
          title: "Mid-term Presentation",
          description: "Presentation on project progress and learning outcomes",
          submissionType: "PRESENTATION",
          status: "APPROVED",
          submittedAt: "2024-01-15T14:00:00Z",
          reviewedAt: "2024-01-16T10:30:00Z",
          mentorFeedback: "Well-structured presentation with clear communication",
          grade: "A+",
          fileName: "midterm_presentation.pptx"
        }
      ]
      setSubmissions(mockSubmissions)
      setLoading(false)
    } catch (error) {
      console.error("Failed to load submissions:", error)
      setLoading(false)
    }
  }

  const handleCreateSubmission = async () => {
    try {
      // In real implementation, this would upload file and call API
      const submission: Submission = {
        id: submissions.length + 1,
        title: newSubmission.title,
        description: newSubmission.description,
        submissionType: newSubmission.submissionType,
        status: "SUBMITTED",
        submittedAt: new Date().toISOString(),
        fileName: newSubmission.file?.name
      }
      
      setSubmissions([submission, ...submissions])
      setNewSubmission({
        title: "",
        description: "",
        submissionType: "WEEKLY_REPORT",
        content: "",
        file: null
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create submission:", error)
    }
  }

  const getStatusIcon = (status: SubmissionStatus) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "UNDER_REVIEW":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "NEEDS_REVISION":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "REJECTED":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800"
      case "NEEDS_REVISION":
        return "bg-yellow-100 text-yellow-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: SubmissionType) => {
    switch (type) {
      case "WEEKLY_REPORT":
        return "bg-blue-100 text-blue-800"
      case "PROJECT_DELIVERABLE":
        return "bg-purple-100 text-purple-800"
      case "ASSIGNMENT":
        return "bg-orange-100 text-orange-800"
      case "PRESENTATION":
        return "bg-indigo-100 text-indigo-800"
      case "FINAL_REPORT":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div>Loading submissions...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">My Submissions</h3>
          <p className="text-sm text-gray-600">Manage your assignments and project deliverables</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Submission
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Submission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newSubmission.title}
                  onChange={(e) => setNewSubmission({ ...newSubmission, title: e.target.value })}
                  placeholder="Enter submission title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSubmission.description}
                  onChange={(e) => setNewSubmission({ ...newSubmission, description: e.target.value })}
                  placeholder="Describe your submission"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="submissionType">Type</Label>
                <Select value={newSubmission.submissionType} onValueChange={(value: SubmissionType) => setNewSubmission({ ...newSubmission, submissionType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEEKLY_REPORT">Weekly Report</SelectItem>
                    <SelectItem value="PROJECT_DELIVERABLE">Project Deliverable</SelectItem>
                    <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                    <SelectItem value="PRESENTATION">Presentation</SelectItem>
                    <SelectItem value="FINAL_REPORT">Final Report</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newSubmission.content}
                  onChange={(e) => setNewSubmission({ ...newSubmission, content: e.target.value })}
                  placeholder="Enter submission content or description"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="file">Attach File (Optional)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setNewSubmission({ ...newSubmission, file: e.target.files?.[0] || null })}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                />
              </div>
              <Button onClick={handleCreateSubmission} className="w-full">
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status)}
                  <CardTitle className="text-base">{submission.title}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Badge className={getTypeColor(submission.submissionType)} variant="secondary">
                    {submission.submissionType.replace('_', ' ')}
                  </Badge>
                  <Badge className={getStatusColor(submission.status)} variant="secondary">
                    {submission.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {submission.description && (
                <p className="text-sm text-gray-600">{submission.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </div>
                  {submission.fileName && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{submission.fileName}</span>
                    </div>
                  )}
                </div>
                {submission.fileName && (
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                )}
              </div>

              {submission.mentorFeedback && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mentor Feedback</span>
                    {submission.grade && (
                      <Badge variant="secondary">Grade: {submission.grade}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{submission.mentorFeedback}</p>
                  {submission.reviewedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Reviewed on {new Date(submission.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {submission.status === "NEEDS_REVISION" && (
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="h-3 w-3 mr-1" />
                  Submit Revision
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Yet</h3>
          <p className="text-gray-600 mb-4">Start by submitting your first assignment or report</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Submission
          </Button>
        </div>
      )}
    </div>
  )
}