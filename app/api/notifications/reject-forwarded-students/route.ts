import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { forwardedDetailId, selectedStudentIds, reviewComment, rejectedBy } = body

    console.log(`🔍 Rejecting ${selectedStudentIds.length} students from forwarded detail ${forwardedDetailId}`)

    if (!forwardedDetailId || !selectedStudentIds || selectedStudentIds.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: forwardedDetailId and selectedStudentIds" },
        { status: 400 }
      )
    }

    // Get the forwarded detail
    const forwardedDetail = await prisma.forwardedStudentDetails.findUnique({
      where: { id: forwardedDetailId },
      include: {
        notification: true
      }
    })

    if (!forwardedDetail) {
      return NextResponse.json(
        { error: "Forwarded detail not found" },
        { status: 404 }
      )
    }

    // Parse the applications to get student details
    const applications = JSON.parse(forwardedDetail.applications)
    const selectedApplications = applications.filter((app: any) => 
      selectedStudentIds.includes(app.id)
    )

    // Update the forwarded detail status
    await prisma.forwardedStudentDetails.update({
      where: { id: forwardedDetailId },
      data: {
        status: "REJECTED_BY_LND",
        updatedAt: new Date()
      }
    })

    // Create notifications for each rejected student
    const notifications = await Promise.all(
      selectedApplications.map(async (app: any) => {
        return prisma.notification.create({
          data: {
            type: "STUDENT_REJECTED_BY_LND",
            title: "Student Application Rejected by LND HoD",
            message: `${app.firstName} ${app.lastName} has been rejected by LND HoD for ${forwardedDetail.department} department assignment`,
            userId: forwardedDetail.forwardedBy, // Notify the coordinator
            priority: "HIGH"
          }
        })
      })
    )

    // Update the internship applications status to REJECTED
    await Promise.all(
      selectedStudentIds.map(async (studentId: number) => {
        return prisma.internshipApplication.updateMany({
          where: { id: studentId },
          data: { 
            status: "REJECTED",
            updatedAt: new Date()
          }
        })
      })
    )

    // Send email notification to L&D Coordinator
    try {
      const coordinatorUser = await prisma.user.findUnique({
        where: { id: forwardedDetail.forwardedBy }
      })

      if (coordinatorUser) {
        await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: coordinatorUser.email,
            subject: `Students Rejected by LND HoD - ${forwardedDetail.department}`,
            html: `
              <h2>Students Rejected by LND HoD</h2>
              <p><strong>Department:</strong> ${forwardedDetail.department}</p>
              <p><strong>Number of Students Rejected:</strong> ${selectedStudentIds.length}</p>
              <p><strong>Rejected By:</strong> LND HoD</p>
              ${reviewComment ? `<p><strong>Review Comment:</strong> ${reviewComment}</p>` : ''}
              <br>
              <h3>Rejected Students:</h3>
              ${selectedApplications.map((app: any) => `
                <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px; background-color: #fef2f2;">
                  <h4>${app.firstName} ${app.lastName}</h4>
                  <p><strong>Email:</strong> ${app.email}</p>
                  <p><strong>Institution:</strong> ${app.institutionName}</p>
                  <p><strong>Course:</strong> ${app.courseName}</p>
                  <p><strong>Status:</strong> <span style="color: red; font-weight: bold;">REJECTED</span></p>
                </div>
              `).join('')}
              <br>
              <p>These students have been rejected and will not proceed to department assignment.</p>
              ${reviewComment ? `<p><strong>Reason:</strong> ${reviewComment}</p>` : ''}
            `
          })
        })
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the entire request if email fails
    }

    console.log(`✅ Successfully rejected ${selectedStudentIds.length} students`)

    return NextResponse.json({
      success: true,
      message: `Successfully rejected ${selectedStudentIds.length} students`,
      rejectedCount: selectedStudentIds.length,
      notificationsCreated: notifications.length
    })

  } catch (error) {
    console.error("Error rejecting forwarded students:", error)
    return NextResponse.json(
      { error: "Failed to reject students" },
      { status: 500 }
    )
  }
} 