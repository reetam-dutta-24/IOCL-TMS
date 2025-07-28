import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { department, applications } = body

    console.log(`🔍 Forwarding ${applications.length} applications to Department HoD for ${department}`)

    if (!department || !applications || applications.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: department and applications" },
        { status: 400 }
      )
    }

    // Find the department and its HOD
    const departmentRecord = await prisma.department.findFirst({
      where: {
        name: {
          contains: department,
          mode: 'insensitive'
        }
      },
      include: {
        users: {
          where: {
            role: {
              name: "Department HoD"
            },
            isActive: true
          }
        }
      }
    })

    if (!departmentRecord) {
      return NextResponse.json(
        { error: `Department '${department}' not found` },
        { status: 404 }
      )
    }

    // Find the Department HoD for this department
    const hodUser = departmentRecord.users.find(user => 
      user.role.name === "Department HoD" && user.isActive
    )

    if (!hodUser) {
      return NextResponse.json(
        { error: `No active Department HoD found for ${department} department` },
        { status: 404 }
      )
    }

    console.log(`✅ Found Department HoD: ${hodUser.firstName} ${hodUser.lastName} (ID: ${hodUser.id})`)

    // Create notification for the Department HoD
    const notification = await prisma.notification.create({
      data: {
        type: "STUDENT_DETAILS_FORWARDED",
        title: "Approved Student Details Received",
        message: `${applications.length} approved student(s) details forwarded from L&D Coordinator for ${department} department`,
        userId: hodUser.id,
        priority: "HIGH"
      }
    })

    // Get the L&D Coordinator user ID from the request
    const coordinatorUser = await prisma.user.findFirst({
      where: {
        role: {
          name: "L&D Coordinator"
        },
        isActive: true
      }
    });

    if (!coordinatorUser) {
      return NextResponse.json(
        { error: "L&D Coordinator not found" },
        { status: 404 }
      )
    }

    // Store the forwarded student details
    const forwardedDetails = await prisma.forwardedStudentDetails.create({
      data: {
        notificationId: notification.id,
        department,
        applicationsCount: applications.length,
        applications: JSON.stringify(applications),
        forwardedBy: coordinatorUser.id,
        forwardedTo: hodUser.id
      }
    })

    // Send email notification to Department HoD
    try {
      await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: hodUser.email,
          subject: `Approved Student Details - ${department} Department`,
          html: `
            <h2>Approved Student Details Received</h2>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Number of Students:</strong> ${applications.length}</p>
            <p><strong>Sent by:</strong> L&D Coordinator</p>
            <br>
            <h3>Student Details:</h3>
            ${applications.map((app: any) => `
              <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
                <h4>${app.firstName} ${app.lastName}</h4>
                <p><strong>Email:</strong> ${app.email}</p>
                <p><strong>Institution:</strong> ${app.institutionName}</p>
                <p><strong>Course:</strong> ${app.courseName}</p>
                <p><strong>Duration:</strong> ${app.internshipDuration} weeks</p>
                ${app.skills ? `<p><strong>Skills:</strong> ${app.skills}</p>` : ''}
                ${app.projectInterests ? `<p><strong>Project Interests:</strong> ${app.projectInterests}</p>` : ''}
              </div>
            `).join('')}
            <br>
            <p>Please review these student details and assign appropriate mentors.</p>
            <p>You can view full details in your dashboard.</p>
          `
        })
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the entire request if email fails
    }

    console.log(`✅ Successfully forwarded ${applications.length} applications to Department HoD ${hodUser.firstName} ${hodUser.lastName}`)

    return NextResponse.json({
      success: true,
      message: `Successfully forwarded ${applications.length} student details to Department HoD ${hodUser.firstName} ${hodUser.lastName}`,
      notificationId: notification.id,
      forwardedDetailsId: forwardedDetails.id,
      hodUser: {
        id: hodUser.id,
        name: `${hodUser.firstName} ${hodUser.lastName}`,
        email: hodUser.email
      }
    })

  } catch (error) {
    console.error("Error forwarding details to HoD:", error)
    return NextResponse.json(
      { error: "Failed to forward details to Department HoD" },
      { status: 500 }
    )
  }
} 