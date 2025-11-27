import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching department mentors data...")

    // Fetch all mentors with their department information
    const mentors = await prisma.user.findMany({
      where: {
        role: {
          name: "Mentor"
        },
        isActive: true
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        mentorAssignments: {
          where: {
            assignmentStatus: "ACTIVE"
          },
          include: {
            request: {
              select: {
                traineeName: true,
                courseDetails: true
              }
            }
          }
        },
        projectReports: {
          where: {
            submissionDate: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          orderBy: {
            submissionDate: "desc"
          }
        }
      },
      orderBy: [
        { department: { name: "asc" } },
        { firstName: "asc" }
      ]
    })

    // Group mentors by department
    const departmentMentors = mentors.reduce((acc, mentor) => {
      const deptName = mentor.department?.name || "Unassigned"
      
      if (!acc[deptName]) {
        acc[deptName] = {
          department: deptName,
          departmentCode: mentor.department?.code || "UNK",
          mentors: []
        }
      }

      // Calculate mentor availability and workload
      const activeAssignments = mentor.mentorAssignments.length
      const recentReports = mentor.projectReports.length
      const maxCapacity = 5 // Assuming max 5 trainees per mentor
      const availability = Math.max(0, maxCapacity - activeAssignments)
      const workloadPercentage = Math.round((activeAssignments / maxCapacity) * 100)
      
      // Determine availability status
      let availabilityStatus = "AVAILABLE"
      let availabilityColor = "green"
      
      if (workloadPercentage >= 100) {
        availabilityStatus = "FULL"
        availabilityColor = "red"
      } else if (workloadPercentage >= 80) {
        availabilityStatus = "BUSY"
        availabilityColor = "orange"
      } else if (workloadPercentage >= 50) {
        availabilityStatus = "MODERATE"
        availabilityColor = "yellow"
      }

      acc[deptName].mentors.push({
        id: mentor.id,
        employeeId: mentor.employeeId,
        name: `${mentor.firstName} ${mentor.lastName}`,
        email: mentor.email,
        phone: mentor.phone,
        activeAssignments,
        maxCapacity,
        availability,
        workloadPercentage,
        availabilityStatus,
        availabilityColor,
        recentReports,
        lastActive: mentor.projectReports[0]?.submissionDate || mentor.updatedAt,
        currentTrainees: mentor.mentorAssignments.map(assignment => ({
          name: assignment.request.traineeName,
          program: assignment.request.courseDetails || "Internship Program"
        }))
      })

      return acc
    }, {} as Record<string, any>)

    // Convert to array and sort by department name
    const departments = Object.values(departmentMentors).sort((a: any, b: any) => 
      a.department.localeCompare(b.department)
    )

    // Calculate department statistics
    const departmentStats = departments.map((dept: any) => ({
      department: dept.department,
      departmentCode: dept.departmentCode,
      totalMentors: dept.mentors.length,
      availableMentors: dept.mentors.filter((m: any) => m.availabilityStatus === "AVAILABLE").length,
      busyMentors: dept.mentors.filter((m: any) => m.availabilityStatus === "BUSY").length,
      fullMentors: dept.mentors.filter((m: any) => m.availabilityStatus === "FULL").length,
      totalAssignments: dept.mentors.reduce((sum: number, m: any) => sum + m.activeAssignments, 0),
      totalCapacity: dept.mentors.reduce((sum: number, m: any) => sum + m.maxCapacity, 0),
      utilizationRate: dept.mentors.length > 0 ? 
        Math.round((dept.mentors.reduce((sum: number, m: any) => sum + m.activeAssignments, 0) / 
                   dept.mentors.reduce((sum: number, m: any) => sum + m.maxCapacity, 0)) * 100) : 0
    }))

    console.log(`✅ Found ${mentors.length} mentors across ${departments.length} departments`)

    return NextResponse.json({
      departments,
      departmentStats,
      totalMentors: mentors.length,
      totalDepartments: departments.length,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error fetching department mentors:", error)
    return NextResponse.json(
      { error: "Failed to fetch department mentors data" },
      { status: 500 }
    )
  }
} 