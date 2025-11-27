import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hodId, department, message, requestedBy, traineeId, traineeDetails } = body

    console.log("📨 Processing request for trainee details...", { hodId, department, traineeId })

    // Validate required fields
    if (!hodId || !department || !message || !requestedBy || !traineeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create audit trail entry for the request
    const auditEntry = await prisma.auditTrail.create({
      data: {
        action: "REQUEST_TRAINEE_DETAILS",
        details: `Request for trainee details from ${department} department - Trainee: ${traineeDetails?.traineeName || 'Unknown'}`,
        userId: parseInt(requestedBy),
        targetUserId: parseInt(hodId),
        metadata: {
          department,
          message,
          traineeId,
          traineeDetails,
          status: "PENDING"
        }
      }
    })

    // In a real implementation, you might also:
    // 1. Send email notification to the Department HOD
    // 2. Create a notification record
    // 3. Update request status in a separate table

    console.log("✅ Request created successfully:", auditEntry.id)

    return NextResponse.json({
      success: true,
      requestId: auditEntry.id,
      message: "Request sent successfully"
    })

  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
} 