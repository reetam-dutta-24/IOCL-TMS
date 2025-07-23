import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching L&D HoD dashboard data...")

    // Fetch all access requests for L&D HoD oversight
    const allRequests = await prisma.accessRequest.findMany({
      include: {
        requestedRole: true,
        department: true,
        reviewer: {
          include: {
            role: true
          }
        }
      },
      orderBy: {
        requestedAt: 'desc'
      }
    })

    // Fetch all users for quality assurance oversight
    const allUsers = await prisma.user.findMany({
      include: {
        role: true,
        department: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch internship requests (if table exists, otherwise use access requests as proxy)
    let internshipRequests = []
    try {
      internshipRequests = await prisma.internshipRequest.findMany({
        include: {
          submitter: {
            include: {
              role: true,
              department: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.log("ℹ️ InternshipRequest table not found, using access requests for internship metrics")
      // Use access requests as proxy for internship data
      internshipRequests = allRequests.map(req => ({
        id: req.id,
        status: req.status.toLowerCase(),
        createdAt: req.requestedAt,
        submitter: {
          id: 0,
          firstName: req.firstName,
          lastName: req.lastName,
          role: req.requestedRole,
          department: req.department
        }
      }))
    }

    console.log(`📊 Found ${allRequests.length} access requests, ${allUsers.length} users, ${internshipRequests.length} internship records`)

    // Calculate L&D HoD specific statistics
    const totalInternshipRequests = internshipRequests.length
    const pendingApprovals = internshipRequests.filter(req => req.status === 'pending' || req.status === 'PENDING').length
    const approvedRequests = internshipRequests.filter(req => req.status === 'approved' || req.status === 'APPROVED').length
    const activeInternships = allUsers.filter(user => user.isActive && user.role?.name?.includes('Intern')).length
    
    // Policy compliance metrics
    const totalUsers = allUsers.length
    const activeUsers = allUsers.filter(user => user.isActive).length
    const ldUsers = allUsers.filter(user => user.department?.name === 'Learning & Development').length
    
    // Monthly metrics for executive reporting
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyApprovals = internshipRequests.filter(req => {
      const reqDate = new Date(req.createdAt)
      return reqDate.getMonth() === currentMonth && 
             reqDate.getFullYear() === currentYear &&
             (req.status === 'approved' || req.status === 'APPROVED')
    }).length

    // Quality assurance metrics
    const completedInternships = internshipRequests.filter(req => req.status === 'completed' || req.status === 'approved').length
    const completionRate = totalInternshipRequests > 0 ? Math.round((completedInternships / totalInternshipRequests) * 100) : 0

    // Executive approval trends (last 6 months)
    const approvalTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleString('default', { month: 'short' })
      const monthIndex = date.getMonth()
      const year = date.getFullYear()

      const monthRequests = internshipRequests.filter(req => {
        const reqDate = new Date(req.createdAt)
        return reqDate.getMonth() === monthIndex && reqDate.getFullYear() === year
      })

      const submitted = monthRequests.length
      const approved = monthRequests.filter(req => req.status === 'approved' || req.status === 'APPROVED').length
      const rejected = monthRequests.filter(req => req.status === 'rejected' || req.status === 'REJECTED').length

      approvalTrends.push({ month, submitted, approved, rejected })
    }

    // Department-wise breakdown for resource allocation
    const departments = await prisma.department.findMany()
    const departmentMetrics = departments.map(dept => {
      const deptUsers = allUsers.filter(user => user.departmentId === dept.id)
      const deptRequests = allRequests.filter(req => req.departmentId === dept.id)
      return {
        department: dept.name,
        activeUsers: deptUsers.filter(user => user.isActive).length,
        totalRequests: deptRequests.length,
        pendingRequests: deptRequests.filter(req => req.status === 'PENDING').length,
        approvedRequests: deptRequests.filter(req => req.status === 'APPROVED').length,
        resourceAllocation: Math.round((deptUsers.length / totalUsers) * 100) || 0
      }
    })

    // Recent high-priority items requiring executive attention
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const urgentApprovals = internshipRequests.filter(req => 
      (req.status === 'pending' || req.status === 'PENDING') && 
      new Date(req.createdAt) <= yesterday
    ).slice(0, 10).map(req => ({
      id: req.id,
      applicantName: `${req.submitter?.firstName || ''} ${req.submitter?.lastName || ''}`.trim(),
      requestType: req.submitter?.role?.name || 'Unknown Role',
      department: req.submitter?.department?.name || 'N/A',
      submittedDate: req.createdAt.toISOString().split('T')[0],
      priority: new Date(req.createdAt) <= yesterday ? 'High' : 'Normal',
      daysWaiting: Math.ceil((new Date().getTime() - new Date(req.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      requiresAction: 'Executive Approval Required'
    }))

    // Policy compliance distribution
    const complianceDistribution = [
      { name: "Compliant", value: activeUsers, color: "#10b981" },
      { name: "Pending Review", value: pendingApprovals, color: "#f59e0b" },
      { name: "Non-Compliant", value: totalUsers - activeUsers, color: "#ef4444" },
      { name: "Under Review", value: allRequests.filter(req => req.status === 'PENDING').length, color: "#3b82f6" }
    ]

    const stats = {
      totalInternshipRequests,
      pendingApprovals,
      activeInternships,
      completionRate,
      monthlyApprovals,
      totalUsers,
      activeUsers,
      ldUsers,
      urgentApprovals: urgentApprovals.length
    }

    const metrics = {
      approvalTrends,
      departmentMetrics,
      complianceDistribution,
      resourceUtilization: Math.round((activeUsers / totalUsers) * 100) || 0,
      policyCompliance: Math.round((activeUsers / totalUsers) * 100) || 0
    }

    console.log("✅ Successfully fetched L&D HoD dashboard data:", {
      totalInternshipRequests,
      pendingApprovals,
      activeInternships,
      monthlyApprovals,
      urgentApprovals: urgentApprovals.length
    })

    return NextResponse.json({
      stats,
      metrics,
      urgentApprovals,
      systemOverview: {
        totalUsers,
        activeUsers,
        ldUsers,
        departments: departments.length
      }
    })

  } catch (error) {
    console.error("💥 Failed to fetch L&D HoD dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}