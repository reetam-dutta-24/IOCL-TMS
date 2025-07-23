import { NextRequest, NextResponse } from "next/server"

// Mock trainee dashboard data
const getTraineeDashboardData = (traineeId: string) => {
  return {
    overallProgress: 65,
    technicalSkillRating: 8.2,
    behavioralRating: 8.8,
    attendancePercentage: 95,
    completedGoals: 3,
    totalGoals: 5,
    pendingSubmissions: 2,
    unreadMessages: 4,
    daysRemaining: 45,
    weeksCompleted: 8,
    currentWeek: 9,
    internshipDuration: 120,
    progressHistory: [
      { week: 1, technical: 6.5, behavioral: 7.0, overall: 15 },
      { week: 2, technical: 7.2, behavioral: 7.5, overall: 30 },
      { week: 3, technical: 7.8, behavioral: 8.0, overall: 45 },
      { week: 4, technical: 8.0, behavioral: 8.2, overall: 60 },
      { week: 5, technical: 8.2, behavioral: 8.5, overall: 65 }
    ],
    recentActivities: [
      {
        id: 1,
        type: "submission_approved",
        title: "React Assignment Approved",
        description: "Your React component assignment has been approved with grade A",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "approved"
      },
      {
        id: 2,
        type: "report_submitted",
        title: "Weekly Report Submitted",
        description: "Week 8 progress report submitted for mentor review",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      },
      {
        id: 3,
        type: "goal_completed",
        title: "Goal Completed",
        description: "Successfully completed 'Master React Framework' goal",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed"
      }
    ],
    upcomingDeadlines: [
      {
        id: 1,
        title: "Weekly Report",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "high",
        type: "report"
      },
      {
        id: 2,
        title: "Project Demo",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "medium",
        type: "presentation"
      },
      {
        id: 3,
        title: "Skill Assessment",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "low",
        type: "assessment"
      }
    ],
    mentor: {
      id: 1,
      name: "Sunita Patel",
      email: "sunita.patel@iocl.co.in",
      phone: "+91-9876543213",
      department: "Information Technology",
      specialization: "Full-Stack Development"
    },
    currentAssignments: [
      {
        id: 1,
        title: "Advanced React Patterns",
        description: "Implement advanced React patterns including HOCs and render props",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "assigned",
        priority: "high"
      },
      {
        id: 2,
        title: "Database Optimization",
        description: "Optimize existing database queries for better performance",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "in_progress",
        priority: "medium"
      }
    ]
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const traineeId = params.id

    // In a real application, you would:
    // 1. Verify the user is authenticated and authorized
    // 2. Fetch data from the database using Prisma
    // 3. Calculate real-time statistics

    const dashboardData = getTraineeDashboardData(traineeId)

    return NextResponse.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error("Error fetching trainee dashboard data:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}