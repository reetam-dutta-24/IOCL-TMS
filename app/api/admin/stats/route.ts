import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count()
    
    // Get active users count (users who have logged in recently)
    const activeUsers = await prisma.user.count({
      where: {
        isActive: true
      }
    })

    // Get pending access requests
    const pendingAccessRequests = await prisma.accessRequest.count({
      where: {
        status: 'PENDING'
      }
    })

    // Get total requests (internship requests)
    const totalRequests = await prisma.internshipRequest.count().catch(() => 0)

    // Mock system health and other stats for now
    const stats = {
      totalUsers,
      activeUsers,
      pendingAccessRequests,
      totalRequests,
      systemHealth: 98, // Mock value
      databaseSize: "2.3 GB", // Mock value
      lastBackup: new Date().toLocaleDateString(), // Mock value
      criticalAlerts: 0 // Mock value
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    )
  }
}