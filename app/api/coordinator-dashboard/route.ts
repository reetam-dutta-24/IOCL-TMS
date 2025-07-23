import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching coordinator dashboard data...")

    // Fetch all access requests for coordinator metrics
    const allRequests = await prisma.accessRequest.findMany({
      include: {
        requestedRole: true,
        department: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 Found ${allRequests.length} total requests`)

    // Calculate real-time statistics
    const totalRequests = allRequests.length
    const pendingRequests = allRequests.filter(req => req.status === 'pending').length
    const approvedRequests = allRequests.filter(req => req.status === 'approved').length
    const rejectedRequests = allRequests.filter(req => req.status === 'rejected').length
    
    // Active requests are approved requests that have associated users
    const activeRequests = allRequests.filter(req => 
      req.status === 'approved' && req.user
    ).length

    // Calculate monthly processed (current month)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyProcessed = allRequests.filter(req => {
      const reqDate = new Date(req.createdAt)
      return reqDate.getMonth() === currentMonth && 
             reqDate.getFullYear() === currentYear &&
             (req.status === 'approved' || req.status === 'rejected')
    }).length

    // Calculate average processing time for approved/rejected requests
    const processedRequests = allRequests.filter(req => 
      req.status === 'approved' || req.status === 'rejected'
    )
    
    let avgProcessingDays = 0
    if (processedRequests.length > 0) {
      const totalDays = processedRequests.reduce((sum, req) => {
        const created = new Date(req.createdAt)
        const updated = new Date(req.updatedAt)
        const diffTime = Math.abs(updated.getTime() - created.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return sum + diffDays
      }, 0)
      avgProcessingDays = Math.round((totalDays / processedRequests.length) * 10) / 10
    }

    // Urgent requests (created in last 24 hours and still pending)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const urgentRequests = allRequests.filter(req => 
      req.status === 'pending' && new Date(req.createdAt) <= yesterday
    ).length

    // Status distribution for pie chart
    const statusDistribution = [
      { name: "Pending Review", value: pendingRequests, color: "#f59e0b" },
      { name: "Approved", value: approvedRequests, color: "#10b981" },
      { name: "Active Users", value: activeRequests, color: "#3b82f6" },
      { name: "Rejected", value: rejectedRequests, color: "#ef4444" }
    ]

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleString('default', { month: 'short' })
      const year = date.getFullYear()
      const monthIndex = date.getMonth()

      const monthRequests = allRequests.filter(req => {
        const reqDate = new Date(req.createdAt)
        return reqDate.getMonth() === monthIndex && reqDate.getFullYear() === year
      })

      const submitted = monthRequests.length
      const processed = monthRequests.filter(req => 
        req.status === 'approved' || req.status === 'rejected'
      ).length
      const routed = monthRequests.filter(req => req.status === 'approved').length

      monthlyTrends.push({ month, submitted, processed, routed })
    }

    // Department breakdown
    const departments = await prisma.department.findMany()
    const departmentBreakdown = departments.map(dept => {
      const deptRequests = allRequests.filter(req => req.departmentId === dept.id)
      return {
        department: dept.name,
        pending: deptRequests.filter(req => req.status === 'pending').length,
        active: deptRequests.filter(req => req.status === 'approved' && req.user).length,
        completed: deptRequests.filter(req => req.status === 'approved').length
      }
    })

    // Recent requests (last 10)
    const recentRequests = allRequests.slice(0, 10).map(req => ({
      id: req.id,
      employeeId: req.employeeId || `REQ${req.id.toString().padStart(3, '0')}`,
      applicantName: `${req.firstName} ${req.lastName}`,
      department: req.department?.name || 'N/A',
      requestType: req.requestedRole?.name || 'Unknown Role',
      status: req.status === 'pending' ? 'Pending Review' : 
               req.status === 'approved' ? (req.user ? 'Active User' : 'Approved') :
               'Rejected',
      submittedDate: req.createdAt.toISOString().split('T')[0],
      urgency: new Date(req.createdAt) <= yesterday ? 'High' : 'Normal',
      nextAction: req.status === 'pending' ? 'Initial Review Required' :
                  req.status === 'approved' ? 'Monitor Progress' :
                  'Request Completed'
    }))

    const stats = {
      totalRequests,
      pendingRequests,
      activeRequests,
      completedRequests: approvedRequests,
      departmentRequests: allRequests.filter(req => req.departmentId).length,
      monthlyProcessed,
      avgProcessingTime: avgProcessingDays > 0 ? `${avgProcessingDays} days` : 'N/A',
      urgentRequests
    }

    const metrics = {
      statusDistribution,
      monthlyTrends,
      departmentBreakdown
    }

    console.log("✅ Successfully fetched coordinator dashboard data:", {
      totalRequests,
      pendingRequests,
      activeRequests,
      monthlyProcessed
    })

    return NextResponse.json({
      stats,
      metrics,
      recentRequests
    })

  } catch (error) {
    console.error("💥 Failed to fetch coordinator dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}