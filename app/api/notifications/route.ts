import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const role = searchParams.get("role")
    const type = searchParams.get("type")

    console.log(`🔔 Fetching notifications for user: ${userId}, role: ${role}, type: ${type}`)

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Get notifications based on user role
    let notifications = []

    if (role === "L&D Coordinator") {
      // Get recent internship applications
      const recentApplications = await prisma.internshipApplication.findMany({
        where: {
          status: "PENDING"
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 10
      })

      // Get recent access requests
      const recentRequests = await prisma.accessRequest.findMany({
        where: {
          status: "PENDING"
        },
        orderBy: {
          requestedAt: "desc"
        },
        take: 10
      })

      // Transform to notifications
      notifications = [
        ...recentApplications.map(app => ({
          id: `app_${app.id}`,
          type: "INTERNSHIP_APPLICATION",
          title: "New Internship Application",
          message: `${app.firstName} ${app.lastName} from ${app.institutionName} has submitted an internship application`,
          timestamp: app.createdAt,
          status: "UNREAD",
          priority: "HIGH",
          actionUrl: `/internship-applications/${app.id}`,
          data: {
            applicationId: app.id,
            applicantName: `${app.firstName} ${app.lastName}`,
            institution: app.institutionName,
            department: app.preferredDepartment
          }
        })),
        ...recentRequests.map(req => ({
          id: `req_${req.id}`,
          type: "ACCESS_REQUEST",
          title: "New Access Request",
          message: `${req.firstName} ${req.lastName} has requested access for ${req.requestedRole?.name || 'Unknown Role'}`,
          timestamp: req.requestedAt,
          status: "UNREAD",
          priority: "MEDIUM",
          actionUrl: `/requests/${req.id}`,
          data: {
            requestId: req.id,
            applicantName: `${req.firstName} ${req.lastName}`,
            role: req.requestedRole?.name,
            department: req.department?.name
          }
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } else if (role === "Department HoD" || role === "L&D HoD") {
      // Get actual notifications from database for Department HoD
      const whereClause: any = {
        userId: parseInt(userId)
      }
      
      if (type) {
        whereClause.type = type
      }

      const dbNotifications = await prisma.notification.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc"
        },
        take: 20
      })

      notifications = dbNotifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        timestamp: notification.createdAt,
        status: notification.isRead ? "READ" : "UNREAD",
        priority: notification.priority,
        actionUrl: null, // Not available in current schema
        data: null // Not available in current schema
      }))
    }

    console.log(`✅ Found ${notifications.length} notifications`)

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter(n => n.status === "UNREAD").length
    })

  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, userId, priority = "MEDIUM", actionUrl, data } = body

    console.log(`🔔 Creating notification: ${type} - ${title}`)

    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId: parseInt(userId),
        priority
      }
    })

    console.log(`✅ Created notification with ID: ${notification.id}`)

    return NextResponse.json({
      success: true,
      notification
    })

  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationIds, status } = body

    console.log(`🔔 Updating notifications: ${notificationIds} to ${status}`)

    // Update multiple notifications
    const updatePromises = notificationIds.map((id: number) =>
      prisma.notification.update({
        where: { id },
        data: { isRead: status === "READ" }
      })
    )

    const updatedNotifications = await Promise.all(updatePromises)

    console.log(`✅ Updated ${updatedNotifications.length} notifications`)

    return NextResponse.json({
      success: true,
      notifications: updatedNotifications
    })

  } catch (error) {
    console.error("Error updating notifications:", error)
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    )
  }
} 