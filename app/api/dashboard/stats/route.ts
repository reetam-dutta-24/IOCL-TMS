import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force dynamic behavior
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
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

    // Get recent activities - Simple version
    const recentActivities = await prisma.internshipRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    const formattedActivities = recentActivities.map((req) => ({
      id: req.id,
      type: "Internship Request",
      title: `Request from ${req.traineeName}`,
      description: `Status: ${req.status}`,
      user: req.traineeName,
      timestamp: req.createdAt.toISOString(),
      status: req.status,
      department: "N/A",
    }))

    // Simplified department breakdown
    const formattedDepartmentBreakdown = [
      { department: "IT", count: 5 },
      { department: "Operations", count: 3 },
      { department: "Engineering", count: 4 },
      { department: "Finance", count: 2 },
    ]

    // Get monthly trends (simplified)
    const monthlyTrends = [
      { month: "Jan", count: 10 },
      { month: "Feb", count: 15 },
      { month: "Mar", count: 12 },
      { month: "Apr", count: 18 },
      { month: "May", count: 20 },
    ]

    return NextResponse.json(
      {
        success: true,
        data: {
          stats: {
            totalRequests,
            pendingRequests,
            approvedRequests,
            rejectedRequests,
            totalMentors,
            activeMentors,
            totalUsers,
            activeUsers,
          },
          recentActivities: formattedActivities,
          departmentBreakdown: formattedDepartmentBreakdown,
          monthlyTrends,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}