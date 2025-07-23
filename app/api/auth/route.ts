import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, password } = await request.json()

    console.log(`🚀 Login attempt - Employee ID: ${employeeId}, Password provided: ${!!password}`)

    if (!employeeId || !password) {
      console.log(`❌ Missing credentials - Employee ID: ${!!employeeId}, Password: ${!!password}`)
      return NextResponse.json({ error: "Employee ID and password are required" }, { status: 400 })
    }

    // Authenticate user against database
    const user = await authenticateUser(employeeId, password)

    if (!user) {
      console.log(`❌ Authentication failed for Employee ID: ${employeeId}`)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log(`✅ Authentication successful for: ${user.employeeId} - ${user.firstName} ${user.lastName}`)

    // Generate JWT token
    const token = generateToken(user)

    // Create response with user data (fixed the role and department access)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role, // This is already a string from authenticateUser
        department: user.department, // This is already a string from authenticateUser
        isActive: true,
      },
      token,
    })

    // Set HTTP-only cookie for token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}