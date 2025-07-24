import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      employeeId,
      password,
      requestedRoleId,
      departmentId,
      institutionName,
      purpose
    } = await request.json()

    console.log("🚀 Direct registration attempt:", { employeeId, email, firstName, lastName })

    // Check if email already exists
    const existingEmailUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmailUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Check if employee ID already exists
    const existingEmployeeUser = await prisma.user.findUnique({
      where: { employeeId }
    })

    if (existingEmployeeUser) {
      return NextResponse.json(
        { error: "This Employee ID is already registered" },
        { status: 400 }
      )
    }

    // Create user account directly
    const hashedPassword = await hashPassword(password)

    console.log("✅ Creating user account directly...")

    const user = await prisma.user.create({
      data: {
        employeeId,
        firstName,
        lastName,
        email,
        phone: phone || null,
        password: hashedPassword,
        roleId: parseInt(requestedRoleId),
        departmentId: departmentId ? parseInt(departmentId) : null,
        isActive: true,
        profileColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        profileInitials: `${firstName[0]}${lastName[0]}`.toUpperCase()
      },
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isActive: true,
        profileColor: true,
        profileInitials: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    console.log("✅ User created successfully:", {
      id: user.id,
      employeeId: user.employeeId,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role.name,
      isActive: user.isActive
    })

    // Send welcome email (optional)
    try {
      await fetch(`${request.nextUrl.origin}/api/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'account_created',
          to: email,
          userName: `${firstName} ${lastName}`,
          employeeId: employeeId,
          password: password
        })
      })
      console.log("📧 Welcome email sent successfully")
    } catch (emailError) {
      console.error("📧 Failed to send welcome email:", emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully! You can now login.",
      user: {
        id: user.id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
        department: user.department?.name || 'No department'
      },
      loginCredentials: {
        employeeId: user.employeeId,
        password: password,
        loginUrl: `${request.nextUrl.origin}/login`
      }
    })

  } catch (error) {
    console.error("Direct registration error:", error)
    return NextResponse.json(
      { error: "Failed to create account", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}