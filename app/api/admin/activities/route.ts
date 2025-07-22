import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // For now, we'll create mock activities based on real data
    // In a full implementation, you'd have an audit log table
    
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        firstName: true,
        lastName: true,
        createdAt: true,
        role: {
          select: {
            name: true
          }
        }
      }
    })

    const recentAccessRequests = await prisma.accessRequest.findMany({
      take: 5,
      orderBy: {
        requestedAt: 'desc'
      },
      select: {
        firstName: true,
        lastName: true,
        requestedAt: true,
        status: true
      }
    })

    // Convert to activities format
    const activities = []
    let id = 1

    // Add user creation activities
    recentUsers.forEach(user => {
      activities.push({
        id: id++,
        type: "USER_CREATED",
        user: `${user.firstName} ${user.lastName}`,
        action: `New user account created with role: ${user.role.name}`,
        timestamp: user.createdAt.toISOString(),
        status: "SUCCESS"
      })
    })

    // Add access request activities
    recentAccessRequests.forEach(request => {
      activities.push({
        id: id++,
        type: "REQUEST_SUBMITTED",
        user: `${request.firstName} ${request.lastName}`,
        action: "Submitted system access request",
        timestamp: request.requestedAt.toISOString(),
        status: request.status
      })
    })

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Return only the most recent 10 activities
    return NextResponse.json(activities.slice(0, 10))

  } catch (error) {
    console.error("Error fetching admin activities:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin activities" },
      { status: 500 }
    )
  }
}