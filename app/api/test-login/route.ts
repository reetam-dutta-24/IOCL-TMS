import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { verifyPassword } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { employeeId, password } = await request.json()

    console.log(`🧪 TEST: Checking user ${employeeId} with password ${password}`)

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
        success: false,
        message: `User with Employee ID '${employeeId}' not found`,
        availableUsers: await prisma.user.findMany({
          select: {
            employeeId: true,
            firstName: true,
            lastName: true,
            email: true,
            isActive: true
          }
        })
      })
    }

    // Test password
    let passwordTest = {
      provided: password,
      hasStoredPassword: !!user.password,
      passwordLength: user.password?.length || 0,
      isValid: false
    }

    if (user.password && password) {
      passwordTest.isValid = await verifyPassword(password, user.password)
    }

    // Test with common passwords
    const testPasswords = ['Welcome@123', 'welcome123', 'admin123', '123456']
    const passwordTests = {}
    
    for (const testPwd of testPasswords) {
      if (user.password) {
        passwordTests[testPwd] = await verifyPassword(testPwd, user.password)
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
        department: user.department?.name || 'No department',
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      passwordTest,
      passwordTests,
      recommendations: [
        `Try Employee ID: ${user.employeeId}`,
        `Try Password: Welcome@123`,
        user.isActive ? '✅ User is active' : '❌ User is not active',
        user.password ? '✅ Password hash exists' : '❌ No password hash'
      ]
    })

  } catch (error) {
    console.error("Test login error:", error)
    return NextResponse.json({ 
      error: "Test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}