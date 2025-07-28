import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing final approve functionality...")

    // Test 1: Check if we can find any internship requests
    const requests = await prisma.internshipRequest.findMany({
      take: 5,
      include: {
        submitter: true,
        department: true
      }
    })

    console.log(`Found ${requests.length} requests`)

    // Test 2: Check if we can find L&D Coordinator role
    const coordinatorRole = await prisma.role.findUnique({
      where: { name: "L&D Coordinator" }
    })

    console.log("Coordinator role found:", !!coordinatorRole)

    // Test 3: Check if we can find any coordinators
    const coordinators = coordinatorRole ? await prisma.user.findMany({
      where: {
        roleId: coordinatorRole.id,
        isActive: true
      }
    }) : []

    console.log(`Found ${coordinators.length} coordinators`)

    return NextResponse.json({
      success: true,
      message: "Database connection and queries working",
      data: {
        requestsCount: requests.length,
        coordinatorRoleExists: !!coordinatorRole,
        coordinatorsCount: coordinators.length,
        sampleRequests: requests.map(r => ({
          id: r.id,
          requestNumber: r.requestNumber,
          traineeName: r.traineeName,
          status: r.status
        }))
      }
    })

  } catch (error) {
    console.error("Error in test:", error)
    return NextResponse.json(
      { error: "Test failed", details: error.message },
      { status: 500 }
    )
  }
} 