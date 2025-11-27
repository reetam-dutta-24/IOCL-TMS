import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching L&D HoD dashboard data...")

    // Fetch all internship requests for HoD metrics
    const allInternshipRequests = await prisma.internshipRequest.findMany({
      include: {
        department: true,
        submitter: true,
        mentorAssignments: {
          include: {
            mentor: true
          }
        },
        approvals: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 Found ${allInternshipRequests.length} total internship requests`)

    // Fetch all departments and mentors for department stats
    const allDepartments = await prisma.department.findMany({
      include: {
        users: {
          where: {
            role: {
              name: "Mentor"
            },
            isActive: true
          }
        }
      }
    })

    // Fetch all mentor assignments for mentor performance metrics
    const allMentorAssignments = await prisma.mentorAssignment.findMany({
      include: {
        mentor: true,
        request: true,
        projectReports: true
      }
    })

    // Calculate real-time statistics
    const totalRequests = allInternshipRequests.length
    const pendingRequestsCount = allInternshipRequests.filter(req => 
      req.status === 'SUBMITTED' || req.status === 'PENDING_APPROVAL'
    ).length
    const activeRequests = allInternshipRequests.filter(req => 
      req.status === 'APPROVED' && req.mentorAssignments.some(ma => ma.assignmentStatus === 'ACTIVE')
    ).length
    const completedRequests = allInternshipRequests.filter(req => 
      req.status === 'COMPLETED'
    ).length

    // Calculate total trainees (approved by L&D HoD)
    const totalTrainees = allInternshipRequests.filter(req => 
      req.status === 'APPROVED' || req.status === 'IN_PROGRESS' || req.status === 'COMPLETED'
    ).length

    // Calculate active trainees (currently in progress)
    const activeTrainees = allInternshipRequests.filter(req => 
      req.status === 'IN_PROGRESS'
    ).length

    // Calculate pending requests (sent by L&D Coordinator, not yet approved by HoD)
    const pendingRequests = allInternshipRequests.filter(req => 
      req.status === 'SUBMITTED' || req.status === 'PENDING_APPROVAL'
    ).length

    // Calculate completion rate
    const completionRate = totalRequests > 0 ? 
      parseFloat(((completedRequests / totalRequests) * 100).toFixed(1)) : 0

    // Calculate department breakdown
    const departmentBreakdown = allDepartments.map(dept => {
      const deptRequests = allInternshipRequests.filter(req => req.preferredDepartment === dept.id)
      
      return {
        department: dept.name,
        totalRequests: deptRequests.length,
        pendingRequests: deptRequests.filter(req => 
          req.status === 'SUBMITTED' || req.status === 'PENDING_APPROVAL'
        ).length,
        activeRequests: deptRequests.filter(req => 
          req.status === 'APPROVED' && req.mentorAssignments.some(ma => ma.assignmentStatus === 'ACTIVE')
        ).length,
        completedRequests: deptRequests.filter(req => req.status === 'COMPLETED').length,
        totalMentors: dept.users.length,
        activeMentors: dept.users.filter(user => 
          user.mentorAssignments && user.mentorAssignments.some(ma => ma.assignmentStatus === 'ACTIVE')
        ).length
      }
    })

    // Calculate mentor performance metrics
    const mentorPerformance = await prisma.user.findMany({
      where: {
        role: {
          name: "Mentor"
        },
        isActive: true,
        mentorAssignments: {
          some: {}
        }
      },
      include: {
        mentorAssignments: {
          include: {
            projectReports: true
          }
        },
        department: true
      },
      take: 10 // Limit to top 10 mentors
    })

    // Format mentor performance data
    const formattedMentorPerformance = mentorPerformance.map(mentor => {
      const activeAssignments = mentor.mentorAssignments.filter(ma => ma.assignmentStatus === 'ACTIVE').length
      const completedAssignments = mentor.mentorAssignments.filter(ma => ma.assignmentStatus === 'COMPLETED').length
      const totalAssignments = mentor.mentorAssignments.length
      
      // Calculate average rating from project reports
      let totalRating = 0
      let ratingCount = 0
      
      mentor.mentorAssignments.forEach(assignment => {
        assignment.projectReports.forEach(report => {
          if (report.performanceRating) {
            totalRating += report.performanceRating
            ratingCount++
          }
        })
      })
      
      const avgRating = ratingCount > 0 ? parseFloat((totalRating / ratingCount).toFixed(1)) : 0
      
      return {
        id: mentor.id,
        name: `${mentor.firstName} ${mentor.lastName}`,
        department: mentor.department?.name || 'N/A',
        capacity: Math.min(Math.round((activeAssignments / 4) * 100), 100), // Assuming max capacity is 4
        rating: avgRating,
        trainees: activeAssignments,
        maxCapacity: 4, // This could be dynamic based on department policy
        completedTrainees: completedAssignments,
        totalAssigned: totalAssignments
      }
    })

    // Sort mentors by rating and capacity
    const sortedMentorPerformance = formattedMentorPerformance.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating
      return b.capacity - a.capacity
    })

    // Get pending assignments that need mentor assignment
    const pendingAssignmentRequests = allInternshipRequests
      .filter(req => 
        req.status === 'PENDING_ASSIGNMENT' || 
        (req.status === 'SUBMITTED' && req.mentorAssignments.length === 0)
      )
      .map(req => ({
        id: req.requestNumber,
        trainee: req.traineeName,
        program: req.courseDetails || 'Internship Program',
        priority: req.priority,
        submittedDate: req.createdAt.toISOString(),
        department: req.department?.name || 'Unassigned'
      }))
      .slice(0, 10) // Limit to 10 most recent

    // Get recent activities
    const recentActivities = await prisma.auditTrail.findMany({
      orderBy: {
        changedAt: 'desc'
      },
      include: {
        user: true
      },
      take: 10
    })

    const formattedActivities = recentActivities.map(activity => ({
      action: activity.action,
      details: `${activity.tableName} ID:${activity.recordId}`,
      time: formatTimeAgo(activity.changedAt)
    }))

    // Prepare response data
    const departmentStats = {
      totalTrainees,
      activeTrainees,
      pendingRequests,
      completionRate,
      departmentRequests: totalRequests
    }

    console.log("✅ Successfully fetched L&D HoD dashboard data")

    return NextResponse.json({
      stats: {
        totalRequests,
        pendingRequests: pendingRequestsCount,
        activeRequests,
        completedRequests,
        departmentStats
      },
      departmentBreakdown,
      mentorPerformance: sortedMentorPerformance,
      pendingAssignments: pendingAssignmentRequests,
      recentActivities: formattedActivities
    })

  } catch (error) {
    console.error("💥 Failed to fetch L&D HoD dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  
  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
}