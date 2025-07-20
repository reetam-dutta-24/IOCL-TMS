import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const internshipRequest = await prisma.internshipRequest.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            email: true,
          },
        },
        department: {
          select: {
            name: true,
            code: true,
          },
        },
        mentorAssignments: {
          include: {
            mentor: {
              select: {
                firstName: true,
                lastName: true,
                employeeId: true,
                email: true,
              },
            },
          },
        },
        approvals: {
          include: {
            approver: {
              select: {
                firstName: true,
                lastName: true,
                employeeId: true,
              },
            },
          },
          orderBy: { level: "asc" },
        },
        documentAttachments: true,
      },
    })

    if (!internshipRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json(internshipRequest)
  } catch (error) {
    console.error("Error fetching internship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const requestId = Number.parseInt(params.id)

    const updatedRequest = await prisma.internshipRequest.update({
      where: { id: requestId },
      data: body,
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
          },
        },
        department: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Error updating internship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
