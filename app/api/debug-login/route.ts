import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { verifyPassword } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { employeeId, password } = await request.json()

    console.log(`🔍 Debug login attempt for Employee ID: ${employeeId}`)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: {
        role: true,
        department: true
      }
    })

    if (!user) {
      console.log(`❌ User not found for Employee ID: ${employeeId}`)
      return NextResponse.json({
        success: false,
        error: "User not found",
        debug: {
          userExists: false,
          employeeId: employeeId
        }
      })
    }

    console.log(`✅ User found:`, {
      id: user.id,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      hasPassword: !!user.password,
      passwordLength: user.password?.length || 0,
      role: user.role?.name,
      department: user.department?.name
    })

    // Test password verification
    let isPasswordValid = false
    if (user.password && password) {
      isPasswordValid = await verifyPassword(password, user.password)
      console.log(`🔑 Password verification result: ${isPasswordValid}`)
    }

    // Return debug information
    return NextResponse.json({
      success: true,
      debug: {
        userExists: true,
        userDetails: {
          id: user.id,
          employeeId: user.employeeId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isActive: user.isActive,
          role: user.role?.name,
          department: user.department?.name
        },
        passwordInfo: {
          hasPassword: !!user.password,
          passwordLength: user.password?.length || 0,
          providedPasswordLength: password?.length || 0,
          isPasswordValid: isPasswordValid
        },
        canLogin: user.isActive && !!user.password && isPasswordValid
      }
    })

  } catch (error) {
    console.error("💥 Debug login error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}