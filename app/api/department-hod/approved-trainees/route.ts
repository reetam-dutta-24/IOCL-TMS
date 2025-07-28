import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching approved trainees for department HOD requests...")

    // Get all approved internship requests with trainee details
    const approvedTrainees = await prisma.internshipRequest.findMany({
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

    // Format the data for the frontend
    const formattedTrainees = approvedTrainees.map(trainee => ({
      id: trainee.id.toString(),
      traineeName: trainee.traineeName,
      employeeId: trainee.employeeId,
      department: trainee.department?.name || "Unassigned",
      courseDetails: trainee.courseDetails,
      institutionName: trainee.institutionName,
      internshipDuration: trainee.internshipDuration,
      skills: trainee.skills,
      projectInterests: trainee.projectInterests,
      approvedDate: trainee.updatedAt.toISOString(),
      submitterName: trainee.submitter ? `${trainee.submitter.firstName} ${trainee.submitter.lastName}` : "Unknown"
    }))

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