import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching L&D quality metrics...")

    // Fetch all internship requests for quality analysis
    const allInternshipRequests = await prisma.internshipRequest.findMany({
      include: {
        department: true,
        mentorAssignments: {
          include: {
            mentor: true,
            projectReports: true
          }
        }
      }
    })

    // Calculate quality metrics based on real data
    const totalPrograms = allInternshipRequests.length
    const completedPrograms = allInternshipRequests.filter(req => req.status === 'COMPLETED').length
    const activePrograms = allInternshipRequests.filter(req => 
      req.status === 'APPROVED' || req.status === 'IN_PROGRESS'
    ).length

    // Calculate compliance rate (programs with proper mentor assignments)
    const compliantPrograms = allInternshipRequests.filter(req => 
      req.mentorAssignments.length > 0 && req.mentorAssignments.some(ma => ma.assignmentStatus === 'ACTIVE')
    ).length

    const nonCompliantPrograms = totalPrograms - compliantPrograms

    // Calculate average satisfaction from project reports
    let totalSatisfaction = 0
    let satisfactionCount = 0
    
    allInternshipRequests.forEach(req => {
      req.mentorAssignments.forEach(assignment => {
        assignment.projectReports.forEach(report => {
          if (report.performanceRating) {
            totalSatisfaction += report.performanceRating
            satisfactionCount++
          }
        })
      })
    })

    const averageSatisfaction = satisfactionCount > 0 ? 
      parseFloat((totalSatisfaction / satisfactionCount).toFixed(1)) : 0

    // Calculate completion rate
    const averageCompletion = totalPrograms > 0 ? 
      parseFloat(((completedPrograms / totalPrograms) * 100).toFixed(1)) : 0

    // Calculate mentor performance (based on active assignments)
    const activeMentors = await prisma.user.count({
      where: {
        role: { name: "Mentor" },
        isActive: true,
        mentorAssignments: {
          some: { assignmentStatus: 'ACTIVE' }
        }
      }
    })

    const totalMentors = await prisma.user.count({
      where: {
        role: { name: "Mentor" },
        isActive: true
      }
    })

    const mentorPerformance = totalMentors > 0 ? 
      parseFloat(((activeMentors / totalMentors) * 100).toFixed(1)) : 0

    // Calculate overall quality score
    const overallScore = parseFloat((
      (averageCompletion * 0.4) + 
      (averageSatisfaction * 20) + 
      (mentorPerformance * 0.4)
    ).toFixed(1))

    // Count total feedbacks (project reports)
    const totalFeedbacks = await prisma.projectReport.count()

    console.log("✅ Successfully fetched L&D quality metrics")

    return NextResponse.json({
      overallScore,
      totalPrograms,
      compliantPrograms,
      nonCompliantPrograms,
      averageSatisfaction,
      averageCompletion,
      totalFeedbacks,
      mentorPerformance
    })

  } catch (error) {
    console.error("💥 Failed to fetch L&D quality metrics:", error)
    return NextResponse.json(
      { error: "Failed to fetch quality metrics" },
      { status: 500 }
    )
  }
} 