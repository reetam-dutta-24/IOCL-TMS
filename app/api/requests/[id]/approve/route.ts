import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { action, comment, reviewerId } = body

    console.log(`🔍 Processing ${action} for request/application: ${id}`)

    // Determine if this is an external application or internal request
    const isExternalApplication = id.startsWith('INT')
    
    if (isExternalApplication) {
      // Handle InternshipApplication (external student application)
      const application = await prisma.internshipApplication.findFirst({
        where: { applicationNumber: id }
      })

      if (!application) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        )
      }

      let newStatus: string
      let notificationMessage: string

      if (action === "APPROVE") {
        newStatus = "APPROVED"
        notificationMessage = `Your internship application has been approved!`
        
        // Send notification to Department HoD
        try {
          const departmentHoD = await prisma.user.findFirst({
            where: {
              role: { name: "Department HoD" },
              department: { name: application.preferredDepartment }
            }
          })

          if (departmentHoD) {
            await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "INTERNSHIP_APPROVED",
                title: "Internship Application Approved",
                message: `${application.firstName} ${application.lastName} from ${application.institutionName} has been approved for ${application.preferredDepartment} department`,
                userId: departmentHoD.id,
                priority: "HIGH",
                actionUrl: `/requests`,
                data: {
                  applicantName: `${application.firstName} ${application.lastName}`,
                  institution: application.institutionName,
                  department: application.preferredDepartment,
                  applicationNumber: application.applicationNumber
                }
              })
            })
          }
        } catch (notificationError) {
          console.error("Failed to send notification to Department HoD:", notificationError)
        }

      } else if (action === "REJECT") {
        newStatus = "REJECTED"
        notificationMessage = `Your internship application has been rejected.`
      } else {
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
      }

      // Update application status
      await prisma.internshipApplication.update({
        where: { id: application.id },
        data: {
          status: newStatus,
          reviewNotes: comment || null,
          reviewedAt: new Date(),
          reviewedBy: reviewerId
        }
      })

      // Send email notification to applicant
      try {
        await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: application.email,
            subject: `Internship Application ${action === "APPROVE" ? "Approved" : "Rejected"}`,
            html: `
              <h2>Internship Application Update</h2>
              <p><strong>Application Number:</strong> ${application.applicationNumber}</p>
              <p><strong>Status:</strong> ${newStatus}</p>
              <p><strong>Message:</strong> ${notificationMessage}</p>
              ${comment ? `<p><strong>Review Notes:</strong> ${comment}</p>` : ''}
              <br>
              <p>Thank you for your interest in our internship program.</p>
            `
          })
        })
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError)
      }

    } else {
      // Handle InternshipRequest (internal request)
      const internshipRequest = await prisma.internshipRequest.findFirst({
        where: { requestNumber: id }
      })

      if (!internshipRequest) {
        return NextResponse.json(
          { error: "Request not found" },
          { status: 404 }
        )
      }

      let newStatus: string

      if (action === "APPROVE") {
        newStatus = "APPROVED"
      } else if (action === "REJECT") {
        newStatus = "REJECTED"
      } else if (action === "PROCESS") {
        newStatus = "PENDING_MENTOR_ASSIGNMENT"
      } else if (action === "ASSIGN_MENTOR") {
        newStatus = "PENDING_HOD_APPROVAL"
      } else {
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
      }

      // Update request status
      await prisma.internshipRequest.update({
        where: { id: internshipRequest.id },
        data: {
          status: newStatus,
          updatedAt: new Date()
        }
      })
    }

    console.log(`✅ Successfully processed ${action} for ${id}`)

    return NextResponse.json({
      success: true,
      message: `Request ${action.toLowerCase()}d successfully`
    })

  } catch (error) {
    console.error("Error processing request action:", error)
    return NextResponse.json(
      { error: "Failed to process request action" },
      { status: 500 }
    )
  }
} 