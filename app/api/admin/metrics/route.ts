import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching admin metrics data")

    // Get user growth data (last 6 months)
    const userGrowth = []
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      })
      
      userGrowth.push({
        month: months[5 - i],
        count
      })
    }

    // Get request trends (last 6 months)
    const requestTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const submitted = await prisma.internshipRequest.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      })
      
      const approved = await prisma.internshipRequest.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          status: "APPROVED"
        }
      })
      
      requestTrends.push({
        month: months[5 - i],
        submitted,
        approved
      })
    }

    // Get department statistics
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            users: true,
            internshipRequests: true
          }
        }
      }
    })

    const departmentStats = departments.map(dept => ({
      department: dept.name,
      users: dept._count.users,
      requests: dept._count.internshipRequests
    }))

    console.log(`✅ Found metrics: ${userGrowth.length} months user growth, ${requestTrends.length} months request trends, ${departmentStats.length} departments`)

    return NextResponse.json({
      userGrowth,
      requestTrends,
      departmentStats
    })

  } catch (error) {
    console.error("Error fetching admin metrics:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin metrics" },
      { status: 500 }
    )
  }
} 