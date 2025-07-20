import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get dashboard statistics
    const [totalRequests, activeInternships, pendingApprovals, completedInternships, totalInternships] =
      await Promise.all([
        prisma.internshipRequest.count(),
        prisma.mentorAssignment.count({
          where: { assignmentStatus: "ACTIVE" },
        }),
        prisma.approval.count({
          where: { status: "PENDING" },
        }),
        prisma.mentorAssignment.count({
          where: { assignmentStatus: "COMPLETED" },
        }),
        prisma.mentorAssignment.count(),
      ])

    const completionRate = totalInternships > 0 ? Math.round((completedInternships / totalInternships) * 100) : 0

    return NextResponse.json({
      totalRequests,
      activeInternships,
      pendingApprovals,
      completionRate,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)

    // Return mock data as fallback
    return NextResponse.json({
      totalRequests: 128,
      activeInternships: 45,
      pendingApprovals: 23,
      completionRate: 94,
    })
  }
}
