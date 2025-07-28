import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const traineeId = searchParams.get("traineeId")

    console.log(`🔍 Fetching trainee data for trainee ID: ${traineeId}`)

    if (!traineeId) {
      return NextResponse.json(
        { error: "Trainee ID is required" },
        { status: 400 }
      )
    }

    // Fetch trainee's internship request
    const internshipRequest = await prisma.internshipRequest.findFirst({
      where: {
        submitterId: parseInt(traineeId)
      },
      include: {
        department: {
          select: {
            name: true
          }
        },
        mentorAssignments: {
          include: {
            mentor: {
              select: {
                firstName: true,
                lastName: true,
                employeeId: true,
                email: true,
                phone: true,
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
              }
            }
          }
        }
      }
    })

    if (!internshipRequest) {
      return NextResponse.json({
        internshipData: {
          programType: "Internship Program",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "PENDING",
          progress: 0,
          daysRemaining: 0,
          totalDays: 0,
          reportsSubmitted: 0,
          totalReports: 0,
          averageRating: 0,
          satisfactionScore: 0,
          projectTitle: "Internship Project",
          department: "Unassigned",
          institution: "Institution"
        },
        mentorInfo: {
          name: "Unassigned",
          employeeId: "",
          department: "Unassigned",
          email: "",
          phone: "",
          expertise: [],
          rating: 0,
          experience: 0,
          specialization: ""
        },
        activities: [],
        progressReports: []
      })
    }

    // Transform internship data
    const startDate = internshipRequest.createdAt
    const endDate = new Date(startDate.getTime() + (internshipRequest.internshipDuration * 7 * 24 * 60 * 60 * 1000))
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))
    const progress = Math.min(100, Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100))

    const internshipData = {
      programType: internshipRequest.courseDetails || "Internship Program",
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: internshipRequest.status,
      progress: Math.round(progress),
      daysRemaining,
      totalDays,
      reportsSubmitted: internshipRequest.mentorAssignments[0]?.projectReports.length || 0,
      totalReports: Math.ceil(totalDays / 7), // Weekly reports
      averageRating: 4.2, // Placeholder
      satisfactionScore: 4.5, // Placeholder
      projectTitle: internshipRequest.requestDescription || "Internship Project",
      department: internshipRequest.department?.name || "Unassigned",
      institution: internshipRequest.institutionName || "Institution"
    }

    // Transform mentor info
    const mentorAssignment = internshipRequest.mentorAssignments[0]
    const mentorInfo = mentorAssignment?.mentor ? {
      name: `${mentorAssignment.mentor.firstName} ${mentorAssignment.mentor.lastName}`,
      employeeId: mentorAssignment.mentor.employeeId,
      department: mentorAssignment.mentor.department?.name || "Unassigned",
      email: mentorAssignment.mentor.email,
      phone: mentorAssignment.mentor.phone || "",
      expertise: ["Software Development", "Project Management"], // Placeholder
      rating: 4.8, // Placeholder
      experience: 8, // Placeholder
      specialization: "Full Stack Development" // Placeholder
    } : {
      name: "Unassigned",
      employeeId: "",
      department: "Unassigned",
      email: "",
      phone: "",
      expertise: [],
      rating: 0,
      experience: 0,
      specialization: ""
    }

    // Transform progress reports
    const progressReports = mentorAssignment?.projectReports.map(report => ({
      id: report.id.toString(),
      title: `Week ${Math.ceil((new Date(report.submissionDate).getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))} Progress Report`,
      submittedDate: report.submissionDate.toISOString().split('T')[0],
      status: report.status,
      rating: report.rating || 4.0,
      comments: report.reportContent || "No comments"
    })) || []

    // Generate activities from progress reports
    const activities = progressReports.map(report => ({
      id: `A${report.id}`,
      type: "REPORT_SUBMITTED",
      description: `Submitted ${report.title}`,
      timestamp: new Date(report.submittedDate).toISOString()
    })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    console.log(`✅ Found trainee data for ID: ${traineeId}`)

    return NextResponse.json({
      internshipData,
      mentorInfo,
      activities,
      progressReports
    })

  } catch (error) {
    console.error("Error fetching trainee data:", error)
    return NextResponse.json(
      { error: "Failed to fetch trainee data" },
      { status: 500 }
    )
  }
} 