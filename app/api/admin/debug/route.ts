import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get detailed database information for debugging
    const users = await prisma.user.findMany({
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        email: true,
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
        },
        isActive: true,
        createdAt: true
      }
    })

    const accessRequests = await prisma.accessRequest.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        requestedRoleId: true,
        departmentId: true,
        status: true,
        requestedAt: true,
        requestedRole: {
          select: {
            name: true
          }
        },
        department: {
          select: {
            name: true
          }
        }
      }
    })

    const internshipRequests = await prisma.internshipRequest.findMany().catch(() => [])

    const debugInfo = {
      database: {
        totalUsers: users.length,
        totalAccessRequests: accessRequests.length,
        totalInternshipRequests: internshipRequests.length
      },
      users: users.map(user => ({
        id: user.id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleName: user.role.name,
        departmentName: user.department?.name || "No Department",
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString()
      })),
      accessRequests: accessRequests.map(req => ({
        id: req.id,
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email,
        requestedRoleId: req.requestedRoleId,
        departmentId: req.departmentId,
        status: req.status,
        requestedAt: req.requestedAt.toISOString(),
        roleName: req.requestedRole.name,
        departmentName: req.department?.name || "Not specified"
      })),
      summary: {
        usersByRole: users.reduce((acc, user) => {
          const roleName = user.role.name
          acc[roleName] = (acc[roleName] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        usersByDepartment: users.reduce((acc, user) => {
          const deptName = user.department?.name || "No Department"
          acc[deptName] = (acc[deptName] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        accessRequestsByStatus: accessRequests.reduce((acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    }

    return NextResponse.json(debugInfo)

  } catch (error) {
    console.error("Error fetching debug info:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch debug information",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}