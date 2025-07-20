import { type NextRequest, NextResponse } from "next/server"

// Mock mentor data
const mentors = [
  {
    id: "M001",
    name: "Vikram Gupta",
    employeeId: "EMP005",
    department: "Information Technology",
    email: "vikram.gupta@iocl.co.in",
    phone: "+91-9876543214",
    expertise: ["Software Development", "Data Analytics", "AI/ML"],
    currentTrainees: 2,
    maxCapacity: 3,
    totalMentored: 15,
    rating: 4.8,
    status: "ACTIVE",
  },
  {
    id: "M002",
    name: "Meera Joshi",
    employeeId: "EMP006",
    department: "Operations",
    email: "meera.joshi@iocl.co.in",
    phone: "+91-9876543215",
    expertise: ["Process Engineering", "Quality Control", "Safety Management"],
    currentTrainees: 1,
    maxCapacity: 3,
    totalMentored: 12,
    rating: 4.6,
    status: "ACTIVE",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const status = searchParams.get("status")

    let filteredMentors = mentors

    if (department) {
      filteredMentors = filteredMentors.filter((mentor) =>
        mentor.department.toLowerCase().includes(department.toLowerCase()),
      )
    }

    if (status) {
      filteredMentors = filteredMentors.filter((mentor) => mentor.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredMentors,
      total: filteredMentors.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
