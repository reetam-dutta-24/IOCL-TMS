import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching Department HoD dashboard data...")

    // Get HoD user ID from query params or headers (in real implementation, get from JWT)
    // For now, we'll get all department-related data

    // Fetch all users to identify HoDs and their departments
    const allUsers = await prisma.user.findMany({
      include: {
        role: true,
        department: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch all departments to understand HoD scope
    const departments = await prisma.department.findMany({
      include: {
        hod: {
          include: {
            role: true
          }
        }
      }
    })

    // Get current user's department (in real implementation, get from JWT)
    const currentDepartment = departments[0] // Mock for now

    // Fetch internship requests assigned to this department
    let departmentRequests = []
    try {
      departmentRequests = await prisma.internshipRequest.findMany({
        where: {
          preferredDepartment: currentDepartment?.id
        },
        include: {
          submitter: {
            include: {
              role: true,
              department: true
            }
          },
          department: true,
          mentorAssignments: {
            include: {
              mentor: {
                include: {
                  role: true,
                  department: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.log("ℹ️ InternshipRequest table not found, using access requests to simulate")
      // Simulate with access requests
      const accessRequests = await prisma.accessRequest.findMany({
        include: {
          requestedRole: true,
          department: true
        },
        where: {
          status: 'APPROVED'
        }
      })
      
      departmentRequests = accessRequests.slice(0, 15).map((req, index) => ({
        id: req.id,
        requestNumber: `REQ-${req.id.toString().padStart(4, '0')}`,
        traineeName: `${req.firstName} ${req.lastName}`,
        traineeEmail: req.email,
        institutionName: 'Mock Institution',
        status: index % 4 === 0 ? 'SUBMITTED' : index % 4 === 1 ? 'UNDER_REVIEW' : index % 4 === 2 ? 'APPROVED' : 'ASSIGNED',
        createdAt: req.requestedAt,
        department: req.department,
        mentorAssignments: index % 3 === 0 ? [{
          id: index + 1,
          mentor: {
            id: index + 10,
            firstName: 'Mentor',
            lastName: `${index + 1}`,
            role: { name: 'Mentor' },
            department: req.department
          }
        }] : []
      }))
    }

    // Fetch mentor assignments for this department
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
              department: true
            }
          }
        },
        where: {
          mentor: {
            departmentId: currentDepartment?.id
          }
        },
        orderBy: {
          assignmentDate: 'desc'
        }
      })
    } catch (error) {
      console.log("ℹ️ MentorAssignment table not found, simulating mentor assignments")
      // Create mock mentor assignments from department requests
      mentorAssignments = departmentRequests
        .filter(req => req.mentorAssignments.length > 0)
        .map((req, index) => ({
          id: index + 1,
          assignmentStatus: 'ACTIVE',
          assignmentDate: req.createdAt,
          mentor: req.mentorAssignments[0].mentor,
          request: {
            id: req.id,
            traineeName: req.traineeName,
            traineeEmail: req.traineeEmail,
            institutionName: req.institutionName,
            department: req.department
          }
        }))
    }

    // Fetch department team members (potential mentors)
    const departmentTeam = allUsers.filter(user => 
      user.department?.id === currentDepartment?.id && 
      (user.role?.name === 'Mentor' || user.role?.name === 'Senior Developer' || user.role?.name === 'Team Lead')
    )

    console.log(`📊 Found ${departmentRequests.length} department requests, ${mentorAssignments.length} mentor assignments, ${departmentTeam.length} team members`)

    // Calculate Department HoD specific statistics
    const totalRequests = departmentRequests.length
    const pendingAssignments = departmentRequests.filter(req => 
      req.status === 'APPROVED' && req.mentorAssignments.length === 0
    ).length
    const activeAssignments = mentorAssignments.filter(assignment => 
      assignment.assignmentStatus === 'ACTIVE'
    ).length
    const availableMentors = departmentTeam.length
    
    // Resource allocation metrics
    const assignedMentors = mentorAssignments.length
    const mentorUtilization = availableMentors > 0 ? Math.round((assignedMentors / availableMentors) * 100) : 0
    const avgMentorWorkload = assignedMentors > 0 ? Math.round(activeAssignments / assignedMentors) : 0
    
    // Request status distribution
    const requestsByStatus = {
      submitted: departmentRequests.filter(req => req.status === 'SUBMITTED').length,
      underReview: departmentRequests.filter(req => req.status === 'UNDER_REVIEW').length,
      approved: departmentRequests.filter(req => req.status === 'APPROVED').length,
      assigned: departmentRequests.filter(req => req.status === 'ASSIGNED').length
    }

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleString('default', { month: 'short' })
      const monthIndex = date.getMonth()
      const year = date.getFullYear()

      const monthRequests = departmentRequests.filter(req => {
        const reqDate = new Date(req.createdAt)
        return reqDate.getMonth() === monthIndex && reqDate.getFullYear() === year
      })

      const monthAssignments = mentorAssignments.filter(assignment => {
        const assignDate = new Date(assignment.assignmentDate)
        return assignDate.getMonth() === monthIndex && assignDate.getFullYear() === year
      })

      monthlyTrends.push({ 
        month, 
        requests: monthRequests.length, 
        assignments: monthAssignments.length,
        efficiency: monthRequests.length > 0 ? Math.round((monthAssignments.length / monthRequests.length) * 100) : 0
      })
    }

    // Mentor workload analysis
    const mentorWorkloads = departmentTeam.map(mentor => {
      const mentorAssignmentsCount = mentorAssignments.filter(assignment => 
        assignment.mentor.id === mentor.id
      ).length
      
      return {
        mentorId: mentor.id,
        mentorName: `${mentor.firstName} ${mentor.lastName}`,
        role: mentor.role?.name || 'Staff',
        currentAssignments: mentorAssignmentsCount,
        capacity: mentor.role?.name === 'Senior Developer' ? 3 : mentor.role?.name === 'Team Lead' ? 2 : 4,
        utilizationRate: mentorAssignmentsCount > 0 ? Math.round((mentorAssignmentsCount / (mentor.role?.name === 'Senior Developer' ? 3 : mentor.role?.name === 'Team Lead' ? 2 : 4)) * 100) : 0,
        availability: mentorAssignmentsCount < (mentor.role?.name === 'Senior Developer' ? 3 : mentor.role?.name === 'Team Lead' ? 2 : 4) ? 'Available' : 'At Capacity'
      }
    })

    // Recent departmental activities
    const recentActivities = [
      ...departmentRequests.slice(0, 5).map(req => ({
        id: req.id,
        activity: `New internship request from ${req.traineeName}`,
        type: 'Request Received',
        date: req.createdAt.toISOString().split('T')[0],
        status: req.status.toLowerCase(),
        priority: req.status === 'SUBMITTED' ? 'High' : 'Normal',
        action: req.status === 'APPROVED' && req.mentorAssignments.length === 0 ? 'Assign Mentor' : 'Review Request'
      })),
      ...mentorAssignments.slice(0, 3).map(assignment => ({
        id: assignment.id + 1000,
        activity: `Mentor assigned to ${assignment.request.traineeName}`,
        type: 'Mentor Assignment',
        date: assignment.assignmentDate.toISOString().split('T')[0],
        status: assignment.assignmentStatus.toLowerCase(),
        priority: 'Normal',
        action: 'Monitor Progress'
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)

    // Performance distribution for charts
    const performanceDistribution = [
      { name: "Excellent Mentors (>80%)", value: mentorWorkloads.filter(m => m.utilizationRate > 80 && m.utilizationRate <= 100).length, color: "#10b981" },
      { name: "Good Utilization (60-80%)", value: mentorWorkloads.filter(m => m.utilizationRate >= 60 && m.utilizationRate <= 80).length, color: "#3b82f6" },
      { name: "Moderate Load (40-59%)", value: mentorWorkloads.filter(m => m.utilizationRate >= 40 && m.utilizationRate < 60).length, color: "#f59e0b" },
      { name: "Low Utilization (<40%)", value: mentorWorkloads.filter(m => m.utilizationRate < 40).length, color: "#ef4444" }
    ]

    const stats = {
      totalRequests,
      pendingAssignments,
      activeAssignments,
      availableMentors,
      assignedMentors,
      mentorUtilization,
      avgMentorWorkload,
      requestsByStatus
    }

    const metrics = {
      monthlyTrends,
      mentorWorkloads,
      performanceDistribution,
      departmentEfficiency: totalRequests > 0 ? Math.round((activeAssignments / totalRequests) * 100) : 0
    }

    console.log("✅ Successfully fetched Department HoD dashboard data:", {
      totalRequests,
      pendingAssignments,
      activeAssignments,
      mentorUtilization
    })

    return NextResponse.json({
      stats,
      metrics,
      recentActivities,
      departmentInfo: {
        departmentName: currentDepartment?.name || 'Department',
        hodName: currentDepartment?.hod ? `${currentDepartment.hod.firstName} ${currentDepartment.hod.lastName}` : 'Current HoD',
        teamSize: departmentTeam.length,
        totalRequests,
        activeAssignments
      },
      departmentRequests: departmentRequests.slice(0, 10), // Latest 10 requests
      mentorTeam: mentorWorkloads
    })

  } catch (error) {
    console.error("💥 Failed to fetch Department HoD dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}