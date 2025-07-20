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
