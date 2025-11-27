import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing simple API route...")
    
    const internships = await prisma.internshipApplication.findMany({
      where: { status: "APPROVED" },
      include: {
        reviewer: true,
        assignedMentor: true,
        traineeUser: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ Found ${internships.length} approved internships`)

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
      { error: "Failed to fetch internships", details: error.message },
      { status: 500 }
    )
  }
} 