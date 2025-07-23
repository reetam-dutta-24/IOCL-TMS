import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { employeeId, newPassword } = await request.json()

    console.log(`🔄 Password reset attempt for Employee ID: ${employeeId}`)

    if (!employeeId || !newPassword) {
      return NextResponse.json(
        { error: "Employee ID and new password are required" },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { employeeId }
    })

    if (!user) {
      console.log(`❌ User not found for Employee ID: ${employeeId}`)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword)

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { employeeId },
      data: { 
        password: hashedPassword,
        isActive: true // Ensure user is active
      }
    })

    console.log(`✅ Password reset successful for: ${employeeId}`)

    return NextResponse.json({
      success: true,
      message: `Password reset successfully for ${employeeId}`,
      debug: {
        employeeId: updatedUser.employeeId,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        isActive: updatedUser.isActive,
        hasPassword: !!updatedUser.password,
        newPasswordLength: newPassword.length
      }
    })

  } catch (error) {
    console.error("💥 Password reset error:", error)
    return NextResponse.json(
      { 
        error: "Password reset failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}