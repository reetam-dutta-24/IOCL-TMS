import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching all users for debug...")

    // Get all users with their roles and departments
    const users = await prisma.user.findMany({
      include: {
        role: true,
        department: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ Found ${users.length} users`)

    const userList = users.map(user => ({
      id: user.id,
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      hasPassword: !!user.password,
      passwordLength: user.password?.length || 0,
      role: user.role?.name || 'No Role',
      department: user.department?.name || 'No Department',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }))

    // Also get access requests
    const accessRequests = await prisma.accessRequest.findMany({
      include: {
        requestedRole: true,
        department: true
      },
      orderBy: {
        requestedAt: 'desc'
      }
    })

    const requestList = accessRequests.map(req => ({
      id: req.id,
      employeeId: req.employeeId,
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      status: req.status,
      requestedRole: req.requestedRole?.name,
      department: req.department?.name,
      requestedAt: req.requestedAt.toISOString(),
      reviewedAt: req.reviewedAt?.toISOString() || null
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: users.length,
        totalRequests: accessRequests.length,
        users: userList,
        accessRequests: requestList
      }
    })

  } catch (error) {
    console.error("💥 Debug users error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch debug data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}