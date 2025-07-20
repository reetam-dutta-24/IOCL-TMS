import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createReportSchema = z.object({
  assignmentId: z.number(),
  reportType: z.enum(["WEEKLY", "MONTHLY", "FINAL", "BEHAVIORAL"]),
  reportTitle: z.string().optional(),
  reportContent: z.string().optional(),
  performanceRating: z.number().min(1).max(10).optional(),
  behavioralComments: z.string().optional(),
  technicalSkills: z.string().optional(),
  areasOfImprovement: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get("assignmentId")
    const reportType = searchParams.get("reportType")

    const where: any = {}

    if (assignmentId) {
      where.assignmentId = Number.parseInt(assignmentId)
    }

    if (reportType) {
      where.reportType = reportType
    }

    const reports = await prisma.projectReport.findMany({
      where,
      include: {
        assignment: {
          include: {
            request: {
              select: {
                traineeName: true,
                institutionName: true,
                requestNumber: true,
              },
            },
            mentor: {
              select: {
                firstName: true,
                lastName: true,
                employeeId: true,
              },
            },
          },
        },
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
          },
        },
        attachments: true,
      },
      orderBy: {
        submissionDate: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: reports,
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createReportSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { employeeId: session.user.employeeId },
      include: { role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify assignment exists and user has permission
    const assignment = await prisma.mentorAssignment.findUnique({
      where: { id: validatedData.assignmentId },
      include: {
        mentor: true,
        request: true,
      },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Check if user is the mentor or has admin permissions
    if (assignment.mentorId !== user.id && !["L&D Coordinator", "Admin"].includes(user.role.name)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const report = await prisma.projectReport.create({
      data: {
        ...validatedData,
        submittedBy: user.id,
      },
      include: {
        assignment: {
          include: {
            request: true,
            mentor: true,
          },
        },
        submitter: true,
      },
    })

    // Create audit trail entry
    await prisma.auditTrail.create({
      data: {
        tableName: "project_reports",
        recordId: report.id,
        action: "CREATE",
        newValues: report,
        changedBy: user.id,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: report,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
