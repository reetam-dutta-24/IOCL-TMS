import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const department = searchParams.get("department")

    console.log(`🔍 Fetching users for role: ${role}, department: ${department}`)

    let where: any = {}

    if (role) {
      where.role = {
        name: role
      }
    }

    if (department) {
      where.department = {
        name: department
      }
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        role: {
          select: {
            name: true
          }
        },
        department: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        firstName: 'asc'
      }
    })

    console.log(`✅ Found ${users.length} users`)

    return NextResponse.json({
      users: users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role?.name,
        department: user.department?.name,
        isActive: user.isActive
      }))
    })

  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
} 