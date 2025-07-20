import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const department = searchParams.get("department")

    const skip = (page - 1) * limit

    const where: any = {}
    if (status && status !== "all") {
      where.status = status
    }
    if (department && department !== "all") {
      where.preferredDepartment = Number.parseInt(department)
    }

    const [requests, total] = await Promise.all([
      prisma.internshipRequest.findMany({
        where,
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
          mentorAssignments: {
            include: {
              mentor: {
                select: {
                  firstName: true,
                  lastName: true,
                  employeeId: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.internshipRequest.count({ where }),
    ])

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching internship requests:", error)
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
    const {
      traineeName,
      traineeEmail,
      traineePhone,
      institutionName,
      courseDetails,
      internshipDuration,
      preferredDepartment,
      requestDescription,
      priority = "MEDIUM",
    } = body

    // Get the user ID from session
    const user = await prisma.user.findUnique({
      where: { employeeId: session.user.employeeId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate request number
    const currentYear = new Date().getFullYear()
    const requestCount = await prisma.internshipRequest.count()
    const requestNumber = `IOCL-INT-${currentYear}-${String(requestCount + 1).padStart(4, "0")}`

    const internshipRequest = await prisma.internshipRequest.create({
      data: {
        requestNumber,
        traineeName,
        traineeEmail,
        traineePhone,
        institutionName,
        courseDetails,
        internshipDuration,
        preferredDepartment: preferredDepartment ? Number.parseInt(preferredDepartment) : null,
        requestDescription,
        priority,
        requestedBy: user.id,
      },
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

    return NextResponse.json(internshipRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating internship request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
