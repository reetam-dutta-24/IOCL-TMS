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
        department: true
      },
      orderBy: {
        requestedAt: 'desc'
      }
    })

    console.log(`📊 Found ${allRequests.length} total requests`)

    // Fetch all users to check which approved requests have corresponding user accounts
    const allUsers = await prisma.user.findMany({
      select: {
        employeeId: true,
        isActive: true
      }
    })

    // Create a map for quick lookup of user existence by employeeId
    const usersByEmployeeId = new Map()
    allUsers.forEach(user => {
      usersByEmployeeId.set(user.employeeId, user.isActive)
    })

    // Calculate real-time statistics
    const totalRequests = allRequests.length
    const pendingRequests = allRequests.filter(req => req.status === 'PENDING').length
    const approvedRequests = allRequests.filter(req => req.status === 'APPROVED').length
    const rejectedRequests = allRequests.filter(req => req.status === 'REJECTED').length
    
    // Active requests are approved requests that have associated active users
    const activeRequests = allRequests.filter(req => 
      req.status === 'APPROVED' && usersByEmployeeId.has(req.employeeId) && usersByEmployeeId.get(req.employeeId)
    ).length

    // Calculate monthly processed (current month)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyProcessed = allRequests.filter(req => {
      const reqDate = new Date(req.requestedAt)
      return reqDate.getMonth() === currentMonth && 
             reqDate.getFullYear() === currentYear &&
             (req.status === 'APPROVED' || req.status === 'REJECTED')
    }).length

    // Calculate average processing time for approved/rejected requests
    const processedRequests = allRequests.filter(req => 
      req.status === 'APPROVED' || req.status === 'REJECTED'
    )
    
    let avgProcessingDays = 0
    if (processedRequests.length > 0) {
      const totalDays = processedRequests.reduce((sum, req) => {
        const created = new Date(req.requestedAt)
        const reviewed = req.reviewedAt ? new Date(req.reviewedAt) : new Date()
        const diffTime = Math.abs(reviewed.getTime() - created.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return sum + diffDays
      }, 0)
      avgProcessingDays = Math.round((totalDays / processedRequests.length) * 10) / 10
    }

    // Urgent requests (created in last 24 hours and still pending)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const urgentRequests = allRequests.filter(req => 
      req.status === 'PENDING' && new Date(req.requestedAt) <= yesterday
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
        const reqDate = new Date(req.requestedAt)
        return reqDate.getMonth() === monthIndex && reqDate.getFullYear() === year
      })

      const submitted = monthRequests.length
      const processed = monthRequests.filter(req => 
        req.status === 'APPROVED' || req.status === 'REJECTED'
      ).length
      const routed = monthRequests.filter(req => req.status === 'APPROVED').length

      monthlyTrends.push({ month, submitted, processed, routed })
    }

    // Department breakdown
    const departments = await prisma.department.findMany()
    const departmentBreakdown = departments.map(dept => {
      const deptRequests = allRequests.filter(req => req.departmentId === dept.id)
      return {
        department: dept.name,
        pending: deptRequests.filter(req => req.status === 'PENDING').length,
        active: deptRequests.filter(req => req.status === 'APPROVED' && usersByEmployeeId.has(req.employeeId) && usersByEmployeeId.get(req.employeeId)).length,
        completed: deptRequests.filter(req => req.status === 'APPROVED').length
      }
    })

    // Recent requests (last 10)
    const recentRequests = allRequests.slice(0, 10).map(req => {
      const hasUser = usersByEmployeeId.has(req.employeeId)
      const isActiveUser = hasUser && usersByEmployeeId.get(req.employeeId)
      
      return {
        id: req.id,
        employeeId: req.employeeId || `REQ${req.id.toString().padStart(3, '0')}`,
        applicantName: `${req.firstName} ${req.lastName}`,
        department: req.department?.name || 'N/A',
        requestType: req.requestedRole?.name || 'Unknown Role',
        status: req.status === 'PENDING' ? 'Pending Review' : 
                 req.status === 'APPROVED' ? (isActiveUser ? 'Active User' : 'Approved') :
                 'Rejected',
        submittedDate: req.requestedAt.toISOString().split('T')[0],
        urgency: new Date(req.requestedAt) <= yesterday ? 'High' : 'Normal',
        nextAction: req.status === 'PENDING' ? 'Initial Review Required' :
                    req.status === 'APPROVED' ? (isActiveUser ? 'Monitor Progress' : 'User Account Pending') :
                    'Request Completed'
      }
    })

    // Fetch all internship applications, sorted: PENDING > APPROVED > others
    const allApplications = await prisma.internshipApplication.findMany({
      orderBy: [
        { status: 'asc' }, // PENDING < APPROVED < ... (enum order)
        { createdAt: 'desc' }
      ]
    })

    // Custom sort: PENDING first, then APPROVED, then others
    const statusOrder: Record<string, number> = { PENDING: 0, APPROVED: 1 }
    const sortedApplications = allApplications.sort((a, b) => {
      const aOrder = statusOrder[String(a.status)] ?? 2
      const bOrder = statusOrder[String(b.status)] ?? 2
      if (aOrder !== bOrder) return aOrder - bOrder
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    // Map to relevant details for dashboard
    const internshipApplications = sortedApplications.map(app => ({
      id: app.id,
      applicationNumber: app.applicationNumber,
      firstName: app.firstName,
      lastName: app.lastName,
      email: app.email,
      phone: app.phone,
      institutionName: app.institutionName,
      courseName: app.courseName,
      currentYear: app.currentYear,
      cgpa: app.cgpa,
      preferredDepartment: app.preferredDepartment,
      internshipDuration: app.internshipDuration,
      startDate: app.startDate,
      endDate: app.endDate,
      skills: app.skills,
      projectInterests: app.projectInterests,
      motivation: app.motivation,
      resumePath: app.resumePath,
      coverLetterPath: app.coverLetterPath,
      status: app.status,
      reviewNotes: app.reviewNotes,
      reviewedBy: app.reviewedBy,
      reviewedAt: app.reviewedAt,
      decisionDate: app.decisionDate,
      mentorAssignedId: app.mentorAssignedId,
      traineeUserId: app.traineeUserId,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }))

    // Calculate internship application statistics
    const totalInternshipApplications = allApplications.length
    const pendingInternshipApplications = allApplications.filter(app => app.status === 'PENDING').length
    const approvedInternshipApplications = allApplications.filter(app => app.status === 'APPROVED').length
    const rejectedInternshipApplications = allApplications.filter(app => app.status === 'REJECTED').length

    const stats = {
      // Access Request Stats
      totalRequests,
      pendingRequests,
      activeRequests,
      completedRequests: approvedRequests,
      departmentRequests: allRequests.filter(req => req.departmentId).length,
      monthlyProcessed,
      avgProcessingTime: avgProcessingDays > 0 ? `${avgProcessingDays} days` : 'N/A',
      urgentRequests,
      
      // Internship Application Stats
      totalInternshipApplications,
      pendingInternshipApplications,
      approvedInternshipApplications,
      rejectedInternshipApplications,
      
      // Combined Stats for Dashboard
      totalApplications: totalRequests + totalInternshipApplications,
      totalPending: pendingRequests + pendingInternshipApplications
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
      monthlyProcessed,
      avgProcessingDays
    })

    return NextResponse.json({
      stats,
      metrics,
      recentRequests,
      internshipApplications // <-- new field
    })

  } catch (error) {
    console.error("💥 Failed to fetch coordinator dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}