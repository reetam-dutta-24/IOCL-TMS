import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { verifyPassword } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { employeeId, password } = await request.json()

    // Find the user
    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: {
        role: true,
        department: true
      }
    })

    if (!user) {
      return NextResponse.json({
        found: false,
        message: `User with Employee ID '${employeeId}' not found in database`
      })
    }

    // Check password
    let passwordValid = false
    if (user.password && password) {
      passwordValid = await verifyPassword(password, user.password)
    }

    return NextResponse.json({
      found: true,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
        department: user.department?.name || 'No department',
        isActive: user.isActive,
        hasPassword: !!user.password,
        passwordValid: passwordValid
      },
      debug: {
        providedEmployeeId: employeeId,
        providedPassword: password ? `${password.substring(0,3)}***` : 'No password provided',
        expectedPassword: 'Welcome@123',
        passwordHashExists: !!user.password,
        userIsActive: user.isActive
      }
    })

  } catch (error) {
    console.error("Debug user error:", error)
    return NextResponse.json({ 
      error: "Debug failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}