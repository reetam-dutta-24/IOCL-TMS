import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching L&D HOD data from database...")

    // Get L&D HoD role
    const lndHodRole = await prisma.role.findUnique({
      where: { name: "L&D HoD" }
    })

    if (!lndHodRole) {
      console.log("❌ L&D HoD role not found in database")
      return NextResponse.json({
        lndHODs: []
      })
    }

    // Fetch all users with L&D HoD role
    const lndHODs = await prisma.user.findMany({
      where: {
        roleId: lndHodRole.id,
        isActive: true
      },
      include: {
        role: true,
        department: true
      },
      orderBy: {
        firstName: 'asc'
      }
    })

    console.log(`📊 Found ${lndHODs.length} L&D HODs in database`)

    // Get mentor role for statistics
    const mentorRole = await prisma.role.findUnique({
      where: { name: "Mentor" }
    })

    // Format L&D HOD data with real-time statistics
    const formattedHODs = await Promise.all(lndHODs.map(async (hod) => {
      // Calculate real-time statistics
      let currentMentors = 0
      let activeTrainees = 0
      let completedPrograms = 0

      if (mentorRole) {
        // Count mentors under this HOD's department (if any)
        currentMentors = await prisma.user.count({
          where: {
            roleId: mentorRole.id,
            isActive: true
          }
        })
      }

      // Count active trainees (approved and in progress requests)
      activeTrainees = await prisma.internshipRequest.count({
        where: {
          status: {
            in: ["APPROVED", "IN_PROGRESS"]
          }
        }
      })

      // Count completed programs
      completedPrograms = await prisma.internshipRequest.count({
        where: {
          status: "COMPLETED"
        }
      })

      return {
        id: hod.id, // Return the actual database ID as number
        firstName: hod.firstName,
        lastName: hod.lastName,
        email: hod.email,
        phone: hod.phone || "+91-98765-43210",
        department: hod.department?.name || "Learning & Development",
        designation: hod.designation || "L&D HoD",
        employeeId: hod.employeeId || "LND001",
        location: hod.location || "Mumbai",
        experience: "15+ years", // This could be calculated from join date
        specialization: [
          "Learning & Development Strategy",
          "Training Program Management", 
          "Policy Development",
          "Cross-departmental Coordination"
        ],
        currentMentors,
        totalMentors: currentMentors, // Assuming total mentors is current mentors for simplicity
        activeTrainees,
        completedPrograms,
        averageRating: 4.8, // Default rating for L&D HODs
        lastActive: hod.updatedAt.toISOString(),
        status: hod.isActive ? 'ACTIVE' : 'INACTIVE',
        avatar: hod.avatar || "/placeholder.svg?height=64&width=64"
      }
    }))

    console.log(`✅ Successfully formatted ${formattedHODs.length} L&D HODs`)

    return NextResponse.json({
      lndHODs: formattedHODs,
      totalCount: formattedHODs.length,
      activeCount: formattedHODs.filter(hod => hod.status === 'ACTIVE').length
    })

  } catch (error) {
    console.error("💥 Error fetching L&D HOD data:", error)
    return NextResponse.json(
      { error: "Failed to fetch L&D HOD data" },
      { status: 500 }
    )
  }
} 