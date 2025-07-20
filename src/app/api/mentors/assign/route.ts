import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { internshipRequestId, mentorId, notes } = body

    // Get the assigner user
    const assigner = await prisma.user.findUnique({
      where: { employeeId: session.user.employeeId },
    })

    if (!assigner) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create mentor assignment
    const assignment = await prisma.mentorAssignment.create({
      data: {
        internshipRequestId: Number.parseInt(internshipRequestId),
        mentorId: Number.parseInt(mentorId),
        assignedBy: assigner.id,
        notes,
      },
      include: {
        mentor: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            email: true,
          },
        },
        request: {
          select: {
            requestNumber: true,
            traineeName: true,
          },
        },
      },
    })

    // Update request status
    await prisma.internshipRequest.update({
      where: { id: Number.parseInt(internshipRequestId) },
      data: { status: "MENTOR_ASSIGNED" },
    })

    // Create notifications
    await Promise.all([
      // Notify the mentor
      prisma.notification.create({
        data: {
          userId: Number.parseInt(mentorId),
          type: "IN_APP",
          title: "New Mentor Assignment",
          message: `You have been assigned as mentor for ${assignment.request.traineeName} (${assignment.request.requestNumber})`,
          priority: "HIGH",
        },
      }),
      // Notify the request submitter
      prisma.notification.create({
        data: {
          userId: assignment.request.requestedBy,
          type: "IN_APP",
          title: "Mentor Assigned",
          message: `${assignment.mentor.firstName} ${assignment.mentor.lastName} has been assigned as your mentor`,
          priority: "MEDIUM",
        },
      }),
    ])

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error("Error assigning mentor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
