import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mentorId = searchParams.get("mentorId")

    console.log(`🔍 Fetching mentor data for mentor ID: ${mentorId}`)

    if (!mentorId) {
      return NextResponse.json(
        { error: "Mentor ID is required" },
        { status: 400 }
      )
    }

    // Fetch mentor assignments
    const mentorAssignments = await prisma.mentorAssignment.findMany({
      where: {
        mentorId: parseInt(mentorId)
      },
      include: {
        request: {
          include: {
            submitter: {
              select: {
                firstName: true,
                lastName: true,
                employeeId: true,
                email: true
              }
            },
            department: {
              select: {
                name: true
              }
            }
          }
        },
        projectReports: {
          orderBy: {
            submissionDate: "desc"
          },
          take: 5
        }
      },
      orderBy: {
        assignmentDate: "desc"
      }
    })

    // Transform to trainees format
    const trainees = mentorAssignments.map(assignment => ({
      id: assignment.request.requestNumber,
      name: assignment.request.traineeName || "Unknown Trainee",
      employeeId: assignment.request.submitter?.employeeId || "N/A",
      department: assignment.request.department?.name || "Unassigned",
      email: assignment.request.submitter?.email || "N/A",
      programType: assignment.request.courseDetails || "Internship Program",
      startDate: assignment.startDate?.toISOString().split('T')[0] || assignment.request.createdAt.toISOString().split('T')[0],
      endDate: assignment.endDate?.toISOString().split('T')[0] || new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: assignment.assignmentStatus,
      progress: assignment.projectReports.length > 0 ? 
        Math.min(100, (assignment.projectReports.length * 20)) : 0,
      lastReportDate: assignment.projectReports[0]?.submissionDate.toISOString().split('T')[0],
      nextReportDate: assignment.projectReports[0] ? 
        new Date(new Date(assignment.projectReports[0].submissionDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))

    // Calculate performance metrics
    const totalTrainees = trainees.length
    const activeTrainees = trainees.filter(t => t.status === "ACTIVE").length
    const completedPrograms = trainees.filter(t => t.status === "COMPLETED").length
    const totalReports = mentorAssignments.reduce((sum, assignment) => sum + assignment.projectReports.length, 0)
    const pendingReports = trainees.filter(t => t.status === "ACTIVE").length // Simplified logic
    const completionRate = totalTrainees > 0 ? Math.round((completedPrograms / totalTrainees) * 100) : 0
    const averageRating = 4.5 // Placeholder - would need rating system
    const satisfactionScore = 4.6 // Placeholder - would need feedback system

    const performance = {
      totalTrainees,
      activeTrainees,
      completedPrograms,
      averageRating,
      totalReports,
      pendingReports,
      completionRate,
      satisfactionScore
    }

    // Generate recent activities from project reports
    const activities = mentorAssignments.flatMap(assignment => 
      assignment.projectReports.map(report => ({
        id: `A${report.id}`,
        type: "REPORT_SUBMITTED",
        description: `Submitted progress report for ${assignment.request.traineeName || "Unknown Trainee"}`,
        timestamp: report.submissionDate.toISOString(),
        traineeName: assignment.request.traineeName || "Unknown Trainee"
      }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

    console.log(`✅ Found ${trainees.length} trainees for mentor`)

    return NextResponse.json({
      trainees,
      performance,
      activities
    })

  } catch (error) {
    console.error("Error fetching mentor data:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { error: "Failed to fetch mentor data", details: error.message },
      { status: 500 }
    )
  }
}