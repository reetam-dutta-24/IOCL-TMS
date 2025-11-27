import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    console.log(`🔍 Fetching forwarded student details for user: ${userId}`)

    // Test database connection first
    try {
      const testCount = await prisma.forwardedStudentDetails.count()
      console.log(`✅ Database connection successful. Total records: ${testCount}`)
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      )
    }

    // Fetch forwarded student details
    const forwardedDetails = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: parseInt(userId)
      },
      include: {
        notification: true,
        forwardedByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ Found ${forwardedDetails.length} forwarded details for user ${userId}`)

    // Format the response to match the expected interface
    const formattedDetails = forwardedDetails.map((detail: any) => {
      let applications = []
      try {
        applications = JSON.parse(detail.applications)
      } catch (error) {
        console.error("Error parsing applications JSON:", error)
        applications = []
      }

      // Map database status to frontend status
      let frontendStatus: 'UNREAD' | 'READ' = 'UNREAD'
      if (detail.status === 'APPROVED_BY_LND' || detail.status === 'REJECTED_BY_LND') {
        frontendStatus = 'READ'
      }

      return {
        id: detail.id,
        notificationId: detail.notificationId,
        department: detail.department,
        applicationsCount: detail.applicationsCount,
        applications: applications,
        forwardedBy: `${detail.forwardedByUser.firstName} ${detail.forwardedByUser.lastName}`,
        forwardedByEmail: detail.forwardedByUser.email,
        receivedAt: detail.createdAt.toISOString(),
        status: frontendStatus,
        notification: {
          title: detail.notification.title,
          message: detail.notification.message,
          priority: detail.notification.priority
        },
        forwardedByUser: {
          firstName: detail.forwardedByUser.firstName,
          lastName: detail.forwardedByUser.lastName,
          email: detail.forwardedByUser.email
        }
      }
    })

    return NextResponse.json({
      success: true,
      forwardedDetails: formattedDetails,
      message: `Found ${formattedDetails.length} forwarded student details`
    })

  } catch (error) {
    console.error("❌ Error fetching forwarded student details:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch forwarded student details",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 