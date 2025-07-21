import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentName = searchParams.get("department")
    const status = searchParams.get("status")

    // Build where clause for filtering
    const where: any = {
      role: {
        name: "Mentor"
      },
      isActive: true
    }

    if (departmentName && departmentName !== "all") {
      where.department = {
        name: departmentName
      }
    }

    // Fetch mentors from database (simplified)
    const mentors = await prisma.user.findMany({
      where,
      include: {
        role: true,
        department: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    })

    // Get assignment counts separately
    const mentorsWithCounts = await Promise.all(
      mentors.map(async (mentor) => {
        // Get active assignments count
        const activeAssignments = await prisma.mentorAssignment.count({
          where: {
            mentorId: mentor.id,
            assignmentStatus: "ACTIVE"
          }
        })

        // Get total assignments count
        const totalAssignments = await prisma.mentorAssignment.count({
          where: {
            mentorId: mentor.id
          }
        })

        // Get current active assignments with details
        const currentAssignments = await prisma.mentorAssignment.findMany({
          where: {
            mentorId: mentor.id,
            assignmentStatus: "ACTIVE"
          },
          include: {
            request: {
              select: {
                traineeName: true,
                status: true,
              }
            }
          }
        })

        return {
          id: mentor.id,
          name: `${mentor.firstName} ${mentor.lastName}`,
          employeeId: mentor.employeeId,
          department: mentor.department?.name || "Unknown",
          email: mentor.email,
          phone: mentor.phone || "Not provided",
          designation: "Mentor",
          experience: "8+ years",
          specialization: "Technical Mentoring, Project Management",
          activeTrainees: activeAssignments,
          totalTrainees: totalAssignments,
          status: mentor.isActive ? "Active" : "Inactive",
          currentAssignments: currentAssignments.map(assignment => ({
            traineeName: assignment.request.traineeName,
            status: assignment.request.status,
          })),
        }
      })
    )

    // Apply status filter if provided
    let filteredMentors = mentorsWithCounts
    if (status && status !== "all") {
      const statusMap = {
        "ACTIVE": "Active",
        "AVAILABLE": "Active",
        "UNAVAILABLE": "Inactive"
      }
      filteredMentors = mentorsWithCounts.filter(mentor => 
        mentor.status === statusMap[status as keyof typeof statusMap]
      )
    }

    // Further filter available mentors (those with capacity)
    if (status === "AVAILABLE") {
      filteredMentors = filteredMentors.filter(mentor => mentor.activeTrainees < 3)
    }

    return NextResponse.json({
      success: true,
      data: filteredMentors,
      total: filteredMentors.length,
    })
  } catch (error) {
    console.error("GET mentors error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}