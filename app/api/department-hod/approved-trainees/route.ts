import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching approved trainees for department HOD requests...")

    // Get all approved internship requests with trainee details
    const approvedRequests = await prisma.internshipRequest.findMany({
      where: {
        status: "APPROVED"
      },
      include: {
        department: true,
        submitter: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get all approved internship applications
    const approvedApplications = await prisma.internshipApplication.findMany({
      where: {
        status: "APPROVED"
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 Found ${approvedRequests.length} approved requests and ${approvedApplications.length} approved applications`)

    // Format the data for the frontend to match the ApprovedTrainee interface
    const formattedTrainees = []

    // Add approved internship requests
    approvedRequests.forEach(trainee => {
      // Split traineeName into firstName and lastName
      const nameParts = trainee.traineeName.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      formattedTrainees.push({
        id: trainee.id,
        firstName: firstName,
        lastName: lastName,
        email: (trainee.employeeId || 'trainee' + trainee.id) + '@iocl.com', // Generate email from employeeId or fallback
        phone: '', // Not available in internship_requests
        institutionName: trainee.institutionName || 'Unknown Institution',
        courseName: trainee.courseDetails || 'Unknown Course',
        currentYear: 3, // Default value
        cgpa: 8.0, // Default value
        preferredDepartment: trainee.department?.name || trainee.preferredDepartment || 'Unassigned',
        internshipDuration: trainee.internshipDuration || 6,
        skills: trainee.skills || '',
        projectInterests: trainee.projectInterests || '',
        status: trainee.status,
        createdAt: trainee.createdAt.toISOString(),
        approvedAt: trainee.updatedAt.toISOString()
      })
    })

    // Add approved internship applications
    approvedApplications.forEach(application => {
      formattedTrainees.push({
        id: application.id + 1000, // Use different ID range to avoid conflicts
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        institutionName: application.institutionName,
        courseName: application.courseName,
        currentYear: application.currentYear,
        cgpa: application.cgpa,
        preferredDepartment: application.preferredDepartment,
        internshipDuration: application.internshipDuration,
        skills: application.skills || '',
        projectInterests: application.projectInterests || '',
        status: application.status,
        createdAt: application.createdAt.toISOString(),
        approvedAt: application.reviewedAt?.toISOString() || application.updatedAt.toISOString()
      })
    })

    console.log(`📊 Found ${formattedTrainees.length} approved trainees`)

    return NextResponse.json({
      approvedTrainees: formattedTrainees
    })

  } catch (error) {
    console.error("Error fetching approved trainees:", error)
    return NextResponse.json(
      { error: "Failed to fetch approved trainees" },
      { status: 500 }
    )
  }
} 