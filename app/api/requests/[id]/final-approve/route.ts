import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { reviewerId, comment } = body

    console.log("🎯 Processing final approval for request:", id)

    // Get the internship request by requestNumber
    const internshipRequest = await prisma.internshipRequest.findUnique({
      where: { requestNumber: id },
      include: {
        submitter: true,
        department: true
      }
    })

    if (!internshipRequest) {
      return NextResponse.json(
        { error: "Internship request not found" },
        { status: 404 }
      )
    }

    // Check if the request is already approved
    if (internshipRequest.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Request must be approved before final approval" },
        { status: 400 }
      )
    }

    // Update the request status to FINAL_APPROVED
    const updatedRequest = await prisma.internshipRequest.update({
      where: { requestNumber: id },
      data: {
        status: "FINAL_APPROVED",
        updatedAt: new Date()
      }
    })

    // Create audit trail entry
    await prisma.auditTrail.create({
      data: {
        action: "FINAL_APPROVAL",
        details: `Final approval granted by L&D HoD for trainee: ${internshipRequest.traineeName}`,
        userId: parseInt(reviewerId),
        recordId: internshipRequest.id.toString(),
        tableName: "internship_requests",
        metadata: {
          traineeName: internshipRequest.traineeName,
          department: internshipRequest.department?.name,
          comment: comment || "Final approval granted"
        }
      }
    })

    // Find L&D Coordinator users to send notification
    const coordinatorRole = await prisma.role.findUnique({
      where: { name: "L&D Coordinator" }
    })

    if (coordinatorRole) {
      const coordinators = await prisma.user.findMany({
        where: {
          roleId: coordinatorRole.id,
          isActive: true
        }
      })

      // Send notifications to all L&D Coordinators
      for (const coordinator of coordinators) {
        await prisma.notification.create({
          data: {
            userId: coordinator.id,
            type: "IN_APP",
            title: "Candidate Fully Approved",
            message: `The candidate ${internshipRequest.traineeName} from ${internshipRequest.institution} has been fully approved by L&D HoD and is now accepted for the internship program.`,
            isRead: false,
            data: JSON.stringify({
              requestId: id,
              traineeName: internshipRequest.traineeName,
              department: internshipRequest.department?.name,
              institution: internshipRequest.institution
            })
          }
        })
      }
    }

    console.log("✅ Final approval completed for request:", id)

    return NextResponse.json({
      success: true,
      message: "Candidate has been fully approved and accepted for the internship program. Notification sent to L&D Coordinator.",
      requestId: id,
      status: "FINAL_APPROVED"
    })

  } catch (error) {
    console.error("Error processing final approval:", error)
    return NextResponse.json(
      { error: "Failed to process final approval" },
      { status: 500 }
    )
  }
} 