import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { writeFile } from "fs/promises"
import { join } from "path"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const institutionName = formData.get("institutionName") as string
    const courseName = formData.get("courseName") as string
    const currentYear = formData.get("currentYear") as string
    const cgpa = formData.get("cgpa") as string
    const preferredDepartment = formData.get("preferredDepartment") as string
    const internshipDuration = formData.get("internshipDuration") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    const skills = formData.get("skills") as string
    const projectInterests = formData.get("projectInterests") as string
    const motivation = formData.get("motivation") as string
    
    // Handle file uploads
    const resume = formData.get("resume") as File | null
    const coverLetter = formData.get("coverLetter") as File | null

    // Validation
    if (!firstName || !lastName || !email || !phone || !institutionName || 
        !courseName || !currentYear || !preferredDepartment || !internshipDuration || 
        !startDate || !endDate || !motivation) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Check if application already exists for this email
    const existingApplication = await prisma.internshipApplication.findFirst({
      where: { email }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: "An application with this email already exists" },
        { status: 400 }
      )
    }

    // Handle file uploads
    let resumePath = null
    let coverLetterPath = null

    if (resume) {
      const bytes = await resume.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `resume_${Date.now()}_${resume.name}`
      const uploadDir = join(process.cwd(), "public", "uploads")
      resumePath = `/uploads/${fileName}`
      await writeFile(join(uploadDir, fileName), buffer)
    }

    if (coverLetter) {
      const bytes = await coverLetter.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `cover_${Date.now()}_${coverLetter.name}`
      const uploadDir = join(process.cwd(), "public", "uploads")
      coverLetterPath = `/uploads/${fileName}`
      await writeFile(join(uploadDir, fileName), buffer)
    }

    // Create internship application
    const application = await prisma.internshipApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        institutionName,
        courseName,
        currentYear: parseInt(currentYear),
        cgpa: cgpa ? parseFloat(cgpa) : null,
        preferredDepartment,
        internshipDuration: parseInt(internshipDuration),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        skills: skills || null,
        projectInterests: projectInterests || null,
        motivation,
        resumePath,
        coverLetterPath,
        status: "PENDING",
        applicationNumber: `INT${Date.now()}`,
      }
    })

    // Create notification for L&D Coordinator
    try {
      // Get L&D Coordinator user
      const coordinator = await prisma.user.findFirst({
        where: {
          role: {
            name: "L&D Coordinator"
          }
        }
      })

      if (coordinator) {
        await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "INTERNSHIP_APPLICATION",
            title: "New Internship Application",
            message: `${firstName} ${lastName} from ${institutionName} has submitted an internship application for ${preferredDepartment}`,
            userId: coordinator.id,
            priority: "HIGH",
            actionUrl: `/internship-applications/${application.id}`,
            data: {
              applicationId: application.id,
              applicantName: `${firstName} ${lastName}`,
              institution: institutionName,
              department: preferredDepartment,
              applicationNumber: application.applicationNumber
            }
          })
        })
      }
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError)
    }

    // Send notification email to L&D Coordinator
    try {
      await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "priya.sharma@iocl.co.in", // L&D Coordinator email
          subject: "New Internship Application Received",
          html: `
            <h2>New Internship Application</h2>
            <p><strong>Applicant:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Institution:</strong> ${institutionName}</p>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Preferred Department:</strong> ${preferredDepartment}</p>
            <p><strong>Duration:</strong> ${internshipDuration} weeks</p>
            <p><strong>Application Number:</strong> ${application.applicationNumber}</p>
            <br>
            <p>Please review this application in the admin dashboard.</p>
          `
        })
      })
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
    }

    console.log(`✅ Internship application submitted: ${application.applicationNumber}`)

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationNumber: application.applicationNumber
    })

  } catch (error) {
    console.error("Error submitting internship application:", error)
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const department = searchParams.get("department")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (department) {
      where.preferredDepartment = department
    }

    const applications = await prisma.internshipApplication.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      skip: offset,
      take: limit,
    })

    const total = await prisma.internshipApplication.count({ where })

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching internship applications:", error)
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
} 