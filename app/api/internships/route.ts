import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    
    console.log(`🔍 Fetching internships with status: ${status}`)

    let whereClause: any = {}
    
    if (status === "approved") {
      whereClause.status = "APPROVED"
    } else if (status) {
      whereClause.status = status.toUpperCase()
    }

    const internships = await prisma.internshipApplication.findMany({
      where: whereClause,
      include: {
        reviewer: true,
        assignedMentor: true,
        traineeUser: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ Found ${internships.length} internships`)

    // Transform the data to match the frontend's ApprovedTrainee interface
    const transformedInternships = internships.map(internship => ({
      id: internship.id,
      firstName: internship.firstName,
      lastName: internship.lastName,
      email: internship.email,
      phone: internship.phone,
      institutionName: internship.institutionName,
      courseName: internship.courseName,
      currentYear: internship.currentYear,
      cgpa: internship.cgpa,
      preferredDepartment: internship.preferredDepartment,
      internshipDuration: internship.internshipDuration,
      skills: internship.skills,
      projectInterests: internship.projectInterests,
      status: internship.status,
      createdAt: internship.createdAt.toISOString(),
      approvedAt: internship.reviewedAt?.toISOString() || internship.updatedAt.toISOString()
    }))

    return NextResponse.json(transformedInternships)

  } catch (error) {
    console.error("💥 Failed to fetch internships:", error)
    return NextResponse.json(
      { error: "Failed to fetch internships" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      institutionName,
      courseName,
      currentYear,
      cgpa,
      preferredDepartment,
      internshipDuration,
      skills,
      projectInterests
    } = body

    console.log(`🔍 Creating new internship application for ${firstName} ${lastName}`)

    const application = await prisma.internshipApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        institutionName,
        courseName,
        currentYear: parseInt(currentYear),
        cgpa: parseFloat(cgpa),
        preferredDepartment,
        internshipDuration: parseInt(internshipDuration),
        skills,
        projectInterests,
        status: "PENDING"
      }
    })

    console.log(`✅ Created internship application with ID: ${application.id}`)

    return NextResponse.json(application, { status: 201 })

  } catch (error) {
    console.error("💥 Failed to create internship application:", error)
    return NextResponse.json(
      { error: "Failed to create internship application" },
      { status: 500 }
    )
  }
} 