import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Find all users who might have password issues
    const usersWithIssues = await prisma.user.findMany({
      where: {
        OR: [
          { password: null },
          { password: "" },
          { isActive: false }
        ]
      },
      include: {
        role: true,
        department: true
      }
    })

    console.log(`Found ${usersWithIssues.length} users with potential issues`)

    // Fix each user
    const fixedUsers = []
    const defaultPassword = "Welcome@123"
    const hashedPassword = await hashPassword(defaultPassword)

    for (const user of usersWithIssues) {
      try {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            isActive: true,
            profileColor: user.profileColor || `#${Math.floor(Math.random()*16777215).toString(16)}`,
            profileInitials: user.profileInitials || `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
          }
        })

        fixedUsers.push({
          id: updatedUser.id,
          employeeId: updatedUser.employeeId,
          name: `${updatedUser.firstName} ${updatedUser.lastName}`,
          email: updatedUser.email,
          role: user.role.name,
          department: user.department?.name || 'No department'
        })

        console.log(`Fixed user: ${updatedUser.employeeId} - ${updatedUser.firstName} ${updatedUser.lastName}`)
      } catch (userError) {
        console.error(`Failed to fix user ${user.employeeId}:`, userError)
      }
    }

    // Also check for users who might have invalid password hashes
    const allUsers = await prisma.user.findMany({
      where: {
        password: { not: null }
      },
      include: {
        role: true,
        department: true
      }
    })

    return NextResponse.json({
      success: true,
      summary: {
        totalUsers: allUsers.length,
        usersWithIssues: usersWithIssues.length,
        usersFixed: fixedUsers.length
      },
      fixedUsers: fixedUsers,
      allUsers: allUsers.map(user => ({
        id: user.id,
        employeeId: user.employeeId,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role.name,
        department: user.department?.name || 'No department',
        isActive: user.isActive,
        hasPassword: !!user.password
      })),
      defaultPassword: defaultPassword,
      instructions: {
        loginWith: "Use Employee ID (not email) and password 'Welcome@123'",
        example: "Employee ID: EMP001, Password: Welcome@123"
      }
    })

  } catch (error) {
    console.error("Fix existing users error:", error)
    return NextResponse.json({ 
      error: "Failed to fix existing users", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Just check existing users without fixing
    const allUsers = await prisma.user.findMany({
      include: {
        role: true,
        department: true
      }
    })

    const usersWithIssues = allUsers.filter(user => 
      !user.password || user.password === "" || !user.isActive
    )

    return NextResponse.json({
      totalUsers: allUsers.length,
      usersWithIssues: usersWithIssues.length,
      users: allUsers.map(user => ({
        id: user.id,
        employeeId: user.employeeId,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role.name,
        department: user.department?.name || 'No department',
        isActive: user.isActive,
        hasPassword: !!user.password,
        hasValidPassword: user.password && user.password.length > 10 // Hashed passwords are long
      })),
      problematicUsers: usersWithIssues.map(user => ({
        employeeId: user.employeeId,
        name: `${user.firstName} ${user.lastName}`,
        issues: [
          !user.password ? 'No password' : '',
          user.password === "" ? 'Empty password' : '',
          !user.isActive ? 'Not active' : ''
        ].filter(Boolean)
      }))
    })

  } catch (error) {
    console.error("Check existing users error:", error)
    return NextResponse.json({ 
      error: "Failed to check existing users", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}