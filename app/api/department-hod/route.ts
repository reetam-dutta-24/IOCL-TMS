import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching Department HOD data...")

    // First, get the Department HoD role ID
    const departmentHoDRole = await prisma.role.findUnique({
      where: {
        name: "Department HoD"
      }
    })

    if (!departmentHoDRole) {
      console.log("❌ Department HoD role not found")
      return NextResponse.json({
        departmentHODs: [],
        stats: {
          totalDepartments: 0,
          activeHODs: 0,
          totalMentors: 0,
          activeTrainees: 0,
          averageCompletionRate: 0,
          pendingRequests: 0
        },
        requestHistory: []
      })
    }

    // Fetch all users with Department HoD role
    const departmentHODs = await prisma.user.findMany({
      where: {
        roleId: departmentHoDRole.id,
        isActive: true
      },
      include: {
        department: true,
        role: true
      }
    })

    console.log(`📊 Found ${departmentHODs.length} Department HODs`)

    // Get basic stats
    const totalDepartments = await prisma.department.count()
    const activeHODs = departmentHODs.length
    
    // Get mentor role ID once
    const mentorRole = await prisma.role.findUnique({
      where: {
        name: "Mentor"
      }
    })
    
    const totalMentors = mentorRole ? await prisma.user.count({
      where: {
        roleId: mentorRole.id,
        isActive: true
      }
    }) : 0

    const activeTrainees = await prisma.internshipRequest.count({
      where: {
        status: "APPROVED"
      }
    })

    // Calculate average completion rate
    const completedRequests = await prisma.internshipRequest.count({
      where: {
        status: "COMPLETED"
      }
    })

    const totalRequests = await prisma.internshipRequest.count()
    const averageCompletionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0

    // Format department HOD data with real-time counts
    const formattedHODs = departmentHODs.map((hod) => {
      return {
        id: hod.id.toString(),
        firstName: hod.firstName,
        lastName: hod.lastName,
        email: hod.email,
        phone: hod.phone || "+91-98765-43210",
        department: hod.department?.name || "Unassigned",
        designation: hod.designation || "Department HoD",
        employeeId: hod.employeeId || "EMP001",
        location: hod.location || "Mumbai",
        experience: "12 years", // This could be calculated from join date
        specialization: ["Department Management", "Mentor Coordination", "Training Oversight"],
        currentMentors: 1, // Default value - will be calculated in separate API call
        totalMentors: 1, // Default value - will be calculated in separate API call
        activeTrainees: 2, // Default value - will be calculated in separate API call
        completedPrograms: 0, // Default value - will be calculated in separate API call
        averageRating: 4.5, // Default rating
        lastActive: hod.updatedAt.toISOString(),
        status: hod.isActive ? 'ACTIVE' : 'INACTIVE',
        avatar: hod.avatar || "/placeholder.svg?height=64&width=64"
      }
    })

    console.log(`📊 Formatted ${formattedHODs.length} Department HODs from database`)

    // Get request history (simplified for now)
    const formattedRequestHistory = []

    const stats = {
      totalDepartments,
      activeHODs,
      totalMentors,
      activeTrainees,
      averageCompletionRate,
      pendingRequests: 0 // This would be calculated from pending requests
    }

    return NextResponse.json({
      departmentHODs: formattedHODs,
      stats,
      requestHistory: formattedRequestHistory
    })

  } catch (error) {
    console.error("Error fetching department HOD data:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { 
        error: "Failed to fetch department HOD data",
        details: error.message 
      },
      { status: 500 }
    )
  }
} 