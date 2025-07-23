import { NextRequest, NextResponse } from "next/server"

// Mock submissions data
let submissions = [
  {
    id: 1,
    traineeId: 1,
    title: "Week 8 Progress Report",
    description: "Weekly progress summary with achievements and challenges",
    submissionType: "WEEKLY_REPORT",
    status: "APPROVED",
    submittedAt: "2024-01-20T10:00:00Z",
    reviewedAt: "2024-01-21T14:30:00Z",
    mentorFeedback: "Excellent progress report with clear objectives and achievements",
    grade: "A",
    fileName: "week8_report.pdf",
    fileSize: 2048000
  },
  {
    id: 2,
    traineeId: 1,
    title: "React Component Assignment",
    description: "Build responsive user interface components",
    submissionType: "ASSIGNMENT",
    status: "UNDER_REVIEW",
    submittedAt: "2024-01-19T16:45:00Z",
    fileName: "react_components.zip",
    fileSize: 5120000
  },
  {
    id: 3,
    traineeId: 1,
    title: "Database Schema Design",
    description: "Design comprehensive database schema for e-commerce platform",
    submissionType: "PROJECT_DELIVERABLE",
    status: "NEEDS_REVISION",
    submittedAt: "2024-01-18T11:20:00Z",
    reviewedAt: "2024-01-19T09:15:00Z",
    mentorFeedback: "Good foundation but needs optimization for performance",
    fileName: "db_schema.sql",
    fileSize: 1024000
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const traineeId = searchParams.get("traineeId")
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let filteredSubmissions = submissions

    if (traineeId) {
      filteredSubmissions = filteredSubmissions.filter(sub => sub.traineeId === parseInt(traineeId))
    }

    if (status) {
      filteredSubmissions = filteredSubmissions.filter(sub => sub.status === status)
    }

    if (type) {
      filteredSubmissions = filteredSubmissions.filter(sub => sub.submissionType === type)
    }

    // Sort by submission date (newest first)
    filteredSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({
      success: true,
      data: filteredSubmissions,
      total: filteredSubmissions.length
    })
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const submissionData = {
      traineeId: parseInt(formData.get("traineeId") as string),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      submissionType: formData.get("submissionType") as string,
      content: formData.get("content") as string
    }

    const file = formData.get("file") as File | null

    const newSubmission = {
      id: submissions.length + 1,
      ...submissionData,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
      fileName: file?.name || null,
      fileSize: file?.size || null
    }

    // In real implementation, you would:
    // 1. Upload file to storage (AWS S3, etc.)
    // 2. Save submission to database
    // 3. Send notifications to mentors

    submissions.push(newSubmission)

    return NextResponse.json(
      {
        success: true,
        data: newSubmission,
        message: "Submission created successfully"
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating submission:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json()
    const submissionIndex = submissions.findIndex(sub => sub.id === updateData.id)

    if (submissionIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      )
    }

    submissions[submissionIndex] = {
      ...submissions[submissionIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: submissions[submissionIndex],
      message: "Submission updated successfully"
    })
  } catch (error) {
    console.error("Error updating submission:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get("id")

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: "Submission ID is required" },
        { status: 400 }
      )
    }

    const submissionIndex = submissions.findIndex(sub => sub.id === parseInt(submissionId))

    if (submissionIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      )
    }

    submissions.splice(submissionIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting submission:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}