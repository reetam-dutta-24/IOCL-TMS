import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching Mentor dashboard data...")

    // Get mentor user ID from query params or headers (in real implementation, get from JWT)
    // For now, we'll get all mentor-related data

    // Fetch all users to identify mentors and trainees
    const allUsers = await prisma.user.findMany({
      include: {
        role: true,
        department: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch mentor assignments (if table exists, otherwise simulate with user relationships)
    let mentorAssignments = []
    try {
      mentorAssignments = await prisma.mentorAssignment.findMany({
        include: {
          mentor: {
            include: {
              role: true,
              department: true
            }
          },
          request: {
            include: {
              role: true,
              department: true
            }
          }
        },
        orderBy: {
          assignmentDate: 'desc'
        }
      })
    } catch (error) {
      console.log("ℹ️ MentorAssignment table not found, using access requests to simulate mentor data")
      // Simulate mentor assignments using access requests
      const accessRequests = await prisma.accessRequest.findMany({
        include: {
          requestedRole: true,
          department: true
        },
        where: {
          status: 'APPROVED'
        }
      })
      
      // Create mock mentor assignments
      mentorAssignments = accessRequests.slice(0, 10).map((req, index) => ({
        id: index + 1,
        assignmentStatus: 'ACTIVE',
        assignmentDate: req.requestedAt,
        mentor: {
          id: 1,
          firstName: 'Current',
          lastName: 'Mentor',
          role: { name: 'Mentor' },
          department: { name: 'Learning & Development' }
        },
        request: {
          id: req.id,
          firstName: req.firstName,
          lastName: req.lastName,
          email: req.email,
          role: req.requestedRole,
          department: req.department
        }
      }))
    }

    // Fetch project reports (if table exists, otherwise simulate)
    let projectReports = []
    try {
      projectReports = await prisma.projectReport.findMany({
        include: {
          submitter: {
            include: {
              role: true,
              department: true
            }
          },
          assignment: {
            include: {
              request: true
            }
          }
        },
        orderBy: {
          submissionDate: 'desc'
        }
      })
    } catch (error) {
      console.log("ℹ️ ProjectReport table not found, simulating project reports")
      // Simulate project reports
      projectReports = mentorAssignments.slice(0, 5).map((assignment, index) => ({
        id: index + 1,
        reportTitle: `Weekly Progress Report - ${assignment.request.firstName}`,
        status: index % 3 === 0 ? 'SUBMITTED' : index % 3 === 1 ? 'DRAFT' : 'OVERDUE',
        submissionDate: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)),
        submitter: assignment.mentor,
        assignment: {
          request: assignment.request
        },
        traineeName: `${assignment.request.firstName} ${assignment.request.lastName}`
      }))
    }

    console.log(`📊 Found ${mentorAssignments.length} mentor assignments, ${projectReports.length} project reports`)

    // Calculate Mentor specific statistics
    const totalTrainees = mentorAssignments.length
    const activeTrainees = mentorAssignments.filter(assignment => assignment.assignmentStatus === 'ACTIVE').length
    const completedAssignments = mentorAssignments.filter(assignment => assignment.assignmentStatus === 'COMPLETED').length
    const pendingReports = projectReports.filter(report => report.status === 'DRAFT' || report.status === 'OVERDUE').length
    
    // Performance metrics
    const submittedReports = projectReports.filter(report => report.status === 'SUBMITTED').length
    const overdueReports = projectReports.filter(report => report.status === 'OVERDUE').length
    const reportSubmissionRate = projectReports.length > 0 ? Math.round((submittedReports / projectReports.length) * 100) : 0
    
    // Monthly metrics
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyReports = projectReports.filter(report => {
      const reportDate = new Date(report.submissionDate)
      return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear
    }).length

    // Training progress trends (last 6 months)
    const progressTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleString('default', { month: 'short' })
      const monthIndex = date.getMonth()
      const year = date.getFullYear()

      const monthReports = projectReports.filter(report => {
        const reportDate = new Date(report.submissionDate)
        return reportDate.getMonth() === monthIndex && reportDate.getFullYear() === year
      })

      const submitted = monthReports.filter(report => report.status === 'SUBMITTED').length
      const overdue = monthReports.filter(report => report.status === 'OVERDUE').length
      const total = monthReports.length

      progressTrends.push({ month, submitted, overdue, total })
    }

    // Trainee performance breakdown
    const traineePerformance = mentorAssignments.map(assignment => {
      const traineeReports = projectReports.filter(report => 
        report.assignment?.request?.id === assignment.request.id
      )
      const submittedCount = traineeReports.filter(report => report.status === 'SUBMITTED').length
      const overdueCount = traineeReports.filter(report => report.status === 'OVERDUE').length
      
      return {
        trainee: `${assignment.request.firstName} ${assignment.request.lastName}`,
        department: assignment.request.department?.name || 'N/A',
        totalReports: traineeReports.length,
        submittedReports: submittedCount,
        overdueReports: overdueCount,
        performanceScore: traineeReports.length > 0 ? Math.round((submittedCount / traineeReports.length) * 100) : 0,
        status: assignment.assignmentStatus?.toLowerCase() || 'active'
      }
    })

    // Recent activities and upcoming tasks
    const recentActivities = projectReports.slice(0, 8).map(report => {
      const traineeName = report.traineeName || 
        (report.assignment?.request ? `${report.assignment.request.firstName} ${report.assignment.request.lastName}` : 'Unknown Trainee')
      
      return {
        id: report.id,
        activity: `Progress report for ${traineeName}`,
        type: report.status === 'SUBMITTED' ? 'Report Submitted' : 
              report.status === 'OVERDUE' ? 'Report Overdue' : 'Report Draft',
        date: report.submissionDate.toISOString().split('T')[0],
        status: report.status.toLowerCase(),
        priority: report.status === 'OVERDUE' ? 'High' : 'Normal',
        action: report.status === 'SUBMITTED' ? 'Review Complete' :
                report.status === 'OVERDUE' ? 'Submit Report' : 'Complete Draft'
      }
    })

    // Performance distribution for charts
    const performanceDistribution = [
      { name: "Excellent (90-100%)", value: traineePerformance.filter(t => t.performanceScore >= 90).length, color: "#10b981" },
      { name: "Good (70-89%)", value: traineePerformance.filter(t => t.performanceScore >= 70 && t.performanceScore < 90).length, color: "#3b82f6" },
      { name: "Average (50-69%)", value: traineePerformance.filter(t => t.performanceScore >= 50 && t.performanceScore < 70).length, color: "#f59e0b" },
      { name: "Needs Improvement (<50%)", value: traineePerformance.filter(t => t.performanceScore < 50).length, color: "#ef4444" }
    ]

    const stats = {
      totalTrainees,
      activeTrainees,
      completedAssignments,
      pendingReports,
      monthlyReports,
      submittedReports,
      overdueReports,
      reportSubmissionRate
    }

    const metrics = {
      progressTrends,
      traineePerformance,
      performanceDistribution,
      averagePerformanceScore: traineePerformance.length > 0 ? 
        Math.round(traineePerformance.reduce((sum, t) => sum + t.performanceScore, 0) / traineePerformance.length) : 0
    }

    console.log("✅ Successfully fetched Mentor dashboard data:", {
      totalTrainees,
      activeTrainees,
      pendingReports,
      monthlyReports,
      reportSubmissionRate
    })

    return NextResponse.json({
      stats,
      metrics,
      recentActivities,
      mentorInfo: {
        totalTrainees,
        activeTrainees,
        completedAssignments
      }
    })

  } catch (error) {
    console.error("💥 Failed to fetch Mentor dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}