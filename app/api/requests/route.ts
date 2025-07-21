import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force dynamic behavior
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const departmentName = searchParams.get("department")

    // Build where clause for filtering
    const where: any = {}
    
    if (status && status !== "all") {
      where.status = status
    }

    if (departmentName && departmentName !== "all") {
      where.department = {
        name: departmentName
      }
    }

    // Fetch requests from database
    const requests = await prisma.internshipRequest.findMany({
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response data
    const formattedRequests = requests.map((req) => ({
      id: req.id,
      requestNumber: req.requestNumber,
      traineeName: req.traineeName,
      traineeEmail: req.traineeEmail,
      traineePhone: req.traineePhone,
      institutionName: req.institutionName,
      courseDetails: req.courseDetails,
      internshipDuration: req.internshipDuration,
      preferredDepartment: req.department?.name || "Not specified",
      requestDescription: req.requestDescription,
      status: req.status,
      priority: req.priority,
      submittedDate: req.createdAt.toISOString().split("T")[0],
      requestedBy: `${req.submitter.firstName} ${req.submitter.lastName} (${req.submitter.employeeId})`,
    }))

    return NextResponse.json({
      success: true,
      data: formattedRequests,
      total: formattedRequests.length,
    })
  } catch (error) {
    console.error("GET requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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
      requestedBy,
    } = await request.json()

    // Validate required fields
    if (!traineeName || !institutionName || !internshipDuration || !requestedBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get department ID
    let departmentId = null
    if (preferredDepartment) {
      const department = await prisma.department.findFirst({
        where: { name: preferredDepartment },
      })
      departmentId = department?.id || null
    }

    // Get user ID for requestedBy
    const submitter = await prisma.user.findUnique({
      where: { employeeId: requestedBy },
    })

    if (!submitter) {
      return NextResponse.json(
        { error: "Invalid submitter employee ID" },
        { status: 400 }
      )
    }

    // Generate request number
    const requestCount = await prisma.internshipRequest.count()
    const requestNumber = `REQ${String(requestCount + 1).padStart(3, "0")}`

    // Create new request
    const newRequest = await prisma.internshipRequest.create({
      data: {
        requestNumber,
        traineeName,
        traineeEmail,
        traineePhone,
        institutionName,
        courseDetails,
        internshipDuration: parseInt(internshipDuration),
        preferredDepartment: departmentId,
        requestDescription,
        priority: priority as any,
        status: "SUBMITTED",
        requestedBy: submitter.id,
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

    // Format response
    const formattedRequest = {
      id: newRequest.id,
      requestNumber: newRequest.requestNumber,
      traineeName: newRequest.traineeName,
      traineeEmail: newRequest.traineeEmail,
      traineePhone: newRequest.traineePhone,
      institutionName: newRequest.institutionName,
      courseDetails: newRequest.courseDetails,
      internshipDuration: newRequest.internshipDuration,
      preferredDepartment: newRequest.department?.name || "Not specified",
      requestDescription: newRequest.requestDescription,
      status: newRequest.status,
      priority: newRequest.priority,
      submittedDate: newRequest.createdAt.toISOString().split("T")[0],
      requestedBy: `${newRequest.submitter.firstName} ${newRequest.submitter.lastName} (${newRequest.submitter.employeeId})`,
    }

    return NextResponse.json(
      {
        success: true,
        data: formattedRequest,
        message: "Request created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
