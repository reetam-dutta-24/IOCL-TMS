import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    // Get overall stats
    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalMentors,
      activeMentors,
      totalUsers,
      activeUsers,
    ] = await Promise.all([
      prisma.internshipRequest.count(),
      prisma.internshipRequest.count({ where: { status: "SUBMITTED" } }),
      prisma.internshipRequest.count({ where: { status: "APPROVED" } }),
      prisma.internshipRequest.count({ where: { status: "REJECTED" } }),
      prisma.user.count({ where: { role: { name: "Mentor" } } }),
      prisma.user.count({ where: { role: { name: "Mentor" }, isActive: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
    ])

    // Get recent activities
    const recentRequests = await prisma.internshipRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    })

    // Format recent activities
    const recentActivities = recentRequests.map((req) => ({
      id: req.id,
      type: "request",
      title: `New request from ${req.traineeName}`,
      description: `Request ${req.requestNumber} from ${req.institutionName}`,
      user: `${req.submitter.firstName} ${req.submitter.lastName}`,
      timestamp: req.createdAt.toISOString(),
      status: req.status,
      department: req.department?.name || "Unknown",
    }))

    // Role-based stats
    let roleBasedStats = {}

    if (role === "L&D HoD" || role === "Admin") {
      // Admin/HoD can see all stats
      roleBasedStats = {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        totalMentors,
        activeMentors,
        totalUsers,
        activeUsers,
      }
    } else if (role === "L&D Coordinator") {
      // Coordinators see limited stats
      roleBasedStats = {
        totalRequests,
        pendingRequests,
        approvedRequests,
        totalMentors,
        activeMentors,
      }
    } else if (role === "Mentor") {
      // Mentors see only their assignments
      const mentorAssignments = await prisma.mentorAssignment.count({
        where: {
          mentor: {
            role: { name: "Mentor" },
          },
          assignmentStatus: "ACTIVE",
        },
      })

      roleBasedStats = {
        totalRequests: mentorAssignments,
        pendingRequests: 0,
        approvedRequests: mentorAssignments,
        totalMentors: 1,
        activeMentors: 1,
      }
    }

    // Get department-wise breakdown
    const departmentStats = await prisma.internshipRequest.groupBy({
      by: ['preferredDepartment'],
      _count: {
        id: true,
      },
      where: {
        preferredDepartment: {
          not: null,
        },
      },
    })

    // Format department stats
    const departmentBreakdown = await Promise.all(
      departmentStats.map(async (stat) => {
        const department = await prisma.department.findUnique({
          where: { id: stat.preferredDepartment! },
        })
        return {
          department: department?.name || "Unknown",
          count: stat._count.id,
        }
      })
    )

    // Get monthly trends (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyTrends = await prisma.internshipRequest.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        stats: roleBasedStats,
        recentActivities,
        departmentBreakdown,
        monthlyTrends: monthlyTrends.map(trend => ({
          month: trend.createdAt.toISOString().split('T')[0].substring(0, 7), // YYYY-MM format
          count: trend._count.id,
        })),
      },
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}