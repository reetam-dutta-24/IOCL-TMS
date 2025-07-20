import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, comments, level = 1 } = body
    const requestId = Number.parseInt(params.id)

    // Get the approver user
    const approver = await prisma.user.findUnique({
      where: { employeeId: session.user.employeeId },
      include: { role: true },
    })

    if (!approver) {
      return NextResponse.json({ error: "Approver not found" }, { status: 404 })
    }

    // Check if user has approval permissions
    const canApprove = ["L&D HoD", "Department HoD", "Admin"].includes(approver.role.name)
    if (!canApprove) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Create or update approval record
    const approval = await prisma.approval.upsert({
      where: {
        internshipRequestId_approverId_level: {
          internshipRequestId: requestId,
          approverId: approver.id,
          level,
        },
      },
      update: {
        status: action === "approve" ? "APPROVED" : "REJECTED",
        comments,
        approvedAt: new Date(),
      },
      create: {
        internshipRequestId: requestId,
        approverId: approver.id,
        level,
        status: action === "approve" ? "APPROVED" : "REJECTED",
        comments,
        approvedAt: new Date(),
      },
    })

    // Update the internship request status
    let newStatus = "UNDER_REVIEW"
    if (action === "approve") {
      newStatus = "APPROVED"
    } else if (action === "reject") {
      newStatus = "REJECTED"
    }

    const updatedRequest = await prisma.internshipRequest.update({
      where: { id: requestId },
      data: { status: newStatus },
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
          },
        },
      },
    })

    // Create notification for the submitter
    await prisma.notification.create({
      data: {
        userId: updatedRequest.requestedBy,
        type: "IN_APP",
        title: `Request ${action === "approve" ? "Approved" : "Rejected"}`,
        message: `Your internship request ${updatedRequest.requestNumber} has been ${action}d by ${approver.firstName} ${approver.lastName}`,
        priority: "HIGH",
      },
    })

    return NextResponse.json({ success: true, approval, request: updatedRequest })
  } catch (error) {
    console.error("Error processing approval:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
