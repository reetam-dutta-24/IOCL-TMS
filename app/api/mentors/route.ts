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

    // Fetch mentors from database
    const mentors = await prisma.user.findMany({
      where,
      include: {
        role: {
          select: {
            name: true,
          },
        },
        department: {
          select: {
            name: true,
            code: true,
          },
        },
        mentorAssignments: {
          where: {
            assignmentStatus: "ACTIVE"
          },
          include: {
            request: {
              select: {
                traineeName: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            mentorAssignments: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    })

    // Format response data
    const formattedMentors = mentors.map((mentor) => ({
      id: mentor.id,
      name: `${mentor.firstName} ${mentor.lastName}`,
      employeeId: mentor.employeeId,
      department: mentor.department?.name || "Unknown",
      email: mentor.email,
      phone: mentor.phone || "Not provided",
      designation: "Mentor", // You can add this field to user table if needed
      experience: "8+ years", // Placeholder - add to user table if needed
      specialization: "Technical Mentoring, Project Management", // Placeholder
      activeTrainees: mentor.mentorAssignments.length,
      totalTrainees: mentor._count.mentorAssignments,
      status: mentor.isActive ? "Active" : "Inactive",
      currentAssignments: mentor.mentorAssignments.map(assignment => ({
        traineeName: assignment.request.traineeName,
        status: assignment.request.status,
      })),
    }))

    // Apply status filter if provided
    let filteredMentors = formattedMentors
    if (status && status !== "all") {
      const statusMap = {
        "ACTIVE": "Active",
        "AVAILABLE": "Active", // Available mentors are active mentors with capacity
        "UNAVAILABLE": "Inactive"
      }
      filteredMentors = formattedMentors.filter(mentor => 
        mentor.status === statusMap[status as keyof typeof statusMap]
      )
    }

    // Further filter available mentors (those with capacity)
    if (status === "AVAILABLE") {
      filteredMentors = filteredMentors.filter(mentor => mentor.activeTrainees < 3) // Assuming max capacity of 3
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
