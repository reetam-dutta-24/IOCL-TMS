import { type NextRequest, NextResponse } from "next/server"

// Mock data - in production, this would come from your database
const requests = [
  {
    id: "REQ001",
    requestNumber: "REQ001",
    traineeName: "Arjun Reddy",
    traineeEmail: "arjun.reddy@student.edu",
    traineePhone: "+91-8765432109",
    institutionName: "IIT Delhi",
    courseDetails: "Computer Science Engineering",
    internshipDuration: 60,
    preferredDepartment: "Information Technology",
    requestDescription: "Summer internship in software development",
    status: "SUBMITTED",
    priority: "HIGH",
    submittedDate: "2024-01-15",
    requestedBy: "EMP002",
  },
  {
    id: "REQ002",
    requestNumber: "REQ002",
    traineeName: "Sneha Agarwal",
    traineeEmail: "sneha.agarwal@student.edu",
    traineePhone: "+91-8765432108",
    institutionName: "NIT Trichy",
    courseDetails: "Information Technology",
    internshipDuration: 90,
    preferredDepartment: "Information Technology",
    requestDescription: "Internship in data analytics and AI",
    status: "UNDER_REVIEW",
    priority: "MEDIUM",
    submittedDate: "2024-01-14",
    requestedBy: "EMP002",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const department = searchParams.get("department")

    let filteredRequests = requests

    if (status) {
      filteredRequests = filteredRequests.filter((req) => req.status === status)
    }

    if (department) {
      filteredRequests = filteredRequests.filter((req) => req.preferredDepartment === department)
    }

    return NextResponse.json({
      success: true,
      data: filteredRequests,
      total: filteredRequests.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    // Generate new request ID
    const newId = `REQ${String(requests.length + 1).padStart(3, "0")}`

    const newRequest = {
      id: newId,
      requestNumber: newId,
      ...requestData,
      status: "SUBMITTED",
      submittedDate: new Date().toISOString().split("T")[0],
    }

    requests.push(newRequest)

    return NextResponse.json(
      {
        success: true,
        data: newRequest,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
