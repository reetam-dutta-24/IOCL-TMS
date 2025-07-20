import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, employeeId, department, designation, phoneNumber, password, requestReason } =
      body

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { employeeId }],
      },
    })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or employee ID already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Find or create department
    let departmentRecord = await prisma.department.findFirst({
      where: { name: department },
    })

    if (!departmentRecord) {
      departmentRecord = await prisma.department.create({
        data: {
          name: department,
          description: `${department} Department`,
        },
      })
    }

    // Find default role (Employee)
    let employeeRole = await prisma.role.findFirst({
      where: { name: "Employee" },
    })

    if (!employeeRole) {
      employeeRole = await prisma.role.create({
        data: {
          name: "Employee",
          description: "Standard employee role",
        },
      })
    }

    // Create user with pending status
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        employeeId,
        phoneNumber,
        designation,
        password: hashedPassword,
        departmentId: departmentRecord.id,
        roleId: employeeRole.id,
        isActive: false, // Pending approval
        requestReason,
      },
    })

    // Create notification for L&D team about new registration request
    const ldRole = await prisma.role.findFirst({
      where: { name: "L&D HoD" },
    })

    if (ldRole) {
      const ldUsers = await prisma.user.findMany({
        where: { roleId: ldRole.id },
      })

      for (const ldUser of ldUsers) {
        await prisma.notification.create({
          data: {
            userId: ldUser.id,
            title: "New Access Request",
            message: `${firstName} ${lastName} (${employeeId}) has requested access to TAMS`,
            type: "ACCESS_REQUEST",
            isRead: false,
          },
        })
      }
    }

    return NextResponse.json(
      {
        message: "Registration request submitted successfully. You will be notified once approved.",
        userId: user.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
