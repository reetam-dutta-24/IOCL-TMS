import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const department = searchParams.get("department")

    console.log(`🔍 Fetching requests for role: ${role}, department: ${department}`)

    // Fetch both InternshipRequest and InternshipApplication data
    const [internshipRequests, internshipApplications] = await Promise.all([
      // Fetch InternshipRequest data
      prisma.internshipRequest.findMany({
        where: {
          // Apply role-based filtering for internship requests
          ...(role === "Department HoD" && department ? {
            department: { name: department }
          } : {}),
          ...(role === "Mentor" ? {
            OR: [
              { mentorAssignments: { some: { mentor: { employeeId: searchParams.get("employeeId") } } } },
              { status: "PENDING_MENTOR_ASSIGNMENT" }
            ]
          } : {})
        },
        include: {
          submitter: {
            select: {
              firstName: true,
              lastName: true,
              employeeId: true
            }
          },
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
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }),
      
      // Fetch InternshipApplication data (external student applications)
      prisma.internshipApplication.findMany({
        where: {
          // Apply role-based filtering for internship applications
          ...(role === "Department HoD" && department ? {
            preferredDepartment: department
          } : {})
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    ])

    // Transform InternshipRequest data
    const transformedRequests = internshipRequests.map(req => ({
      id: req.requestNumber,
      traineeName: req.traineeName,
      institution: req.institutionName,
      program: req.courseDetails || "Internship Program",
      department: req.department?.name || "Unassigned",
      status: req.status,
      submittedDate: req.createdAt.toISOString().split('T')[0],
      coordinator: `${req.submitter.firstName} ${req.submitter.lastName}`,
      assignedMentor: req.mentorAssignments[0]?.mentor ? 
        `${req.mentorAssignments[0].mentor.firstName} ${req.mentorAssignments[0].mentor.lastName}` : 
        undefined,
      priority: req.priority,
      description: req.requestDescription,
      duration: `${req.internshipDuration} weeks`,
      type: "INTERNAL_REQUEST"
    }))

    // Transform InternshipApplication data
    const transformedApplications = internshipApplications.map(app => ({
      id: app.applicationNumber,
      traineeName: `${app.firstName} ${app.lastName}`,
      institution: app.institutionName,
      program: app.courseName,
      department: app.preferredDepartment,
      status: app.status,
      submittedDate: app.createdAt.toISOString().split('T')[0],
      coordinator: "External Applicant",
      assignedMentor: undefined,
      priority: "MEDIUM", // Default priority for external applications
      description: app.motivation,
      duration: `${app.internshipDuration} weeks`,
      type: "EXTERNAL_APPLICATION",
      email: app.email,
      phone: app.phone,
      currentYear: app.currentYear,
      cgpa: app.cgpa,
      skills: app.skills,
      projectInterests: app.projectInterests,
      startDate: app.startDate,
      endDate: app.endDate,
      resumePath: app.resumePath,
      coverLetterPath: app.coverLetterPath
    }))

    // Combine and sort all requests (pending first, then by date)
    const allRequests = [...transformedRequests, ...transformedApplications]
    
    // Sort: PENDING first, then by creation date (newest first)
    const statusOrder: Record<string, number> = { 
      PENDING: 0, 
      PENDING_PROCESSING: 0,
      PENDING_MENTOR_ASSIGNMENT: 1,
      PENDING_HOD_APPROVAL: 2,
      APPROVED: 3,
      IN_PROGRESS: 4,
      COMPLETED: 5,
      REJECTED: 6
    }
    
    allRequests.sort((a, b) => {
      const aOrder = statusOrder[a.status] ?? 7
      const bOrder = statusOrder[b.status] ?? 7
      if (aOrder !== bOrder) return aOrder - bOrder
      return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
    })

    console.log(`✅ Found ${allRequests.length} total requests (${transformedRequests.length} internal, ${transformedApplications.length} external)`)

    return NextResponse.json({
      requests: allRequests
    })

  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    )
  }
}