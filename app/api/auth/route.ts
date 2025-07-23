import { type NextRequest, NextResponse } from "next/server"

// Mock user data - in production, this would come from your database
const users = [
  {
    employeeId: "EMP001",
    password: "demo123",
    name: "Rajesh Kumar",
    role: "L&D HoD",
    department: "Learning & Development",
    email: "rajesh.kumar@iocl.co.in",
  },
  {
    employeeId: "EMP002",
    password: "demo123",
    name: "Priya Sharma",
    role: "L&D Coordinator",
    department: "Learning & Development",
    email: "priya.sharma@iocl.co.in",
  },
  {
    employeeId: "EMP003",
    password: "demo123",
    name: "Amit Singh",
    role: "Department HoD",
    department: "Information Technology",
    email: "amit.singh@iocl.co.in",
  },
  {
    employeeId: "EMP004",
    password: "demo123",
    name: "Sunita Patel",
    role: "Mentor",
    department: "Information Technology",
    email: "sunita.patel@iocl.co.in",
  },
  // Trainee users
  {
    employeeId: "TRN001",
    password: "demo123",
    name: "Arjun Reddy",
    role: "Trainee",
    department: "Information Technology",
    email: "arjun.reddy@student.edu",
    institutionName: "IIT Delhi",
    courseDetails: "Computer Science Engineering",
    currentSemester: "8th Semester",
    phone: "+91-8765432109"
  },
  {
    employeeId: "TRN002",
    password: "demo123",
    name: "Sneha Agarwal",
    role: "Trainee",
    department: "Information Technology",
    email: "sneha.agarwal@student.edu",
    institutionName: "NIT Trichy",
    courseDetails: "Information Technology",
    currentSemester: "Final Year",
    phone: "+91-8765432108"
  },
]

export async function POST(request: NextRequest) {
  try {
    const { employeeId, password } = await request.json()

    // Find user
    const user = users.find((u) => u.employeeId === employeeId && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
