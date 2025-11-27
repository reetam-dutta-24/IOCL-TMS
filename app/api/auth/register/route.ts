import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, firstName, lastName, email, password, phone, department, role, reason } = body

    // Validate required fields
    if (!employeeId || !firstName || !lastName || !email || !password || !department || !role) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      )
    }

    // Check if employee ID or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { employeeId },
          { email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Employee ID or email already exists" },
        { status: 400 }
      )
    }

    // Find role and department - validate both exist
    const [userRole, userDepartment] = await Promise.all([
      prisma.role.findFirst({ where: { name: role } }),
      prisma.department.findFirst({ where: { name: department } })
    ])

    if (!userRole) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      )
    }

    if (!userDepartment) {
      return NextResponse.json(
        { error: "Invalid department specified" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user account - we know department exists now
    const newUser = await prisma.user.create({
      data: {
        employeeId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || null,
        roleId: userRole.id,
        departmentId: userDepartment.id,
        isActive: true,
      },
      include: {
        role: true,
        department: true,
      }
    })

    // Safe to access department.name since we validated it exists
    return NextResponse.json(
      { 
        success: true, 
        message: "Account created successfully! You can now login.",
        user: {
          id: newUser.id,
          employeeId: newUser.employeeId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role.name,
          department: newUser.department!.name, // Using non-null assertion since we validated
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Employee ID or email already exists" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}