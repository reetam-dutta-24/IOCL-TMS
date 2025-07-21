import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, firstName, lastName, email, password, department, role } = await request.json()

    // Validate required fields
    if (!employeeId || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { employeeId },
          { email },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this employee ID or email already exists" },
        { status: 409 }
      )
    }

    // Get role ID (default to L&D Coordinator for new registrations)
    const userRole = await prisma.role.findFirst({
      where: { name: role || "L&D Coordinator" },
    })

    if (!userRole) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      )
    }

    // Get department ID
    let departmentId = null
    if (department) {
      const userDepartment = await prisma.department.findFirst({
        where: { name: department },
      })
      departmentId = userDepartment?.id || null
    }

    // Create user
    const newUser = await createUser({
      employeeId,
      firstName,
      lastName,
      email,
      password,
      roleId: userRole.id,
      
    })

    if (!newUser) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          employeeId: newUser.employeeId,
          name: `${newUser.firstName} ${newUser.lastName}`,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
