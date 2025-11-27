import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = parseInt(params.id)
    const { status, reviewNotes } = await request.json()

    // Validate status
    const validStatuses = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "MENTOR_ASSIGNED", "ACCEPTED", "DECLINED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // Get current user (you'll need to implement authentication)
    // For now, we'll use a default reviewer
    const reviewerId = 1 // This should come from authentication

    // Update the application
    const updatedApplication = await prisma.internshipApplication.update({
      where: { id: applicationId },
      data: {
        status,
        reviewNotes,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        decisionDate: new Date(),
      },
      include: {
        reviewer: true,
      }
    })

    // Send notification email to applicant
    try {
      const emailSubject = status === "APPROVED" 
        ? "Congratulations! Your Internship Application Has Been Approved"
        : status === "REJECTED"
        ? "Update on Your Internship Application"
        : "Your Internship Application is Under Review"

      const emailBody = status === "APPROVED" 
        ? `
          <h2>Congratulations! 🎉</h2>
          <p>Dear ${updatedApplication.firstName} ${updatedApplication.lastName},</p>
          <p>We are pleased to inform you that your internship application (${updatedApplication.applicationNumber}) has been <strong>APPROVED</strong>!</p>
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>You will receive further instructions via email within 24 hours</li>
            <li>You'll need to create a Trainee account in our system</li>
            <li>A mentor will be assigned to guide you through your internship</li>
            <li>You'll receive access to our training materials and resources</li>
          </ul>
          <p>Welcome to the IOCL family!</p>
          <p>Best regards,<br>IOCL Training & Assessment Team</p>
        `
        : status === "REJECTED"
        ? `
          <h2>Application Update</h2>
          <p>Dear ${updatedApplication.firstName} ${updatedApplication.lastName},</p>
          <p>Thank you for your interest in interning at IOCL. After careful review, we regret to inform you that your application (${updatedApplication.applicationNumber}) has not been approved at this time.</p>
          <p>We encourage you to apply again in the future when new opportunities become available.</p>
          <p>Best regards,<br>IOCL Training & Assessment Team</p>
        `
        : `
          <h2>Application Under Review</h2>
          <p>Dear ${updatedApplication.firstName} ${updatedApplication.lastName},</p>
          <p>Your internship application (${updatedApplication.applicationNumber}) is currently under review by our team.</p>
          <p>We will notify you of the decision within 5-7 business days.</p>
          <p>Best regards,<br>IOCL Training & Assessment Team</p>
        `

      await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: updatedApplication.email,
          subject: emailSubject,
          html: emailBody
        })
      })
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
    }

    // If approved, notify Department HoD to assign mentor
    if (status === "APPROVED") {
      try {
        // Find department by name
        const department = await prisma.department.findFirst({
          where: { name: updatedApplication.preferredDepartment },
        })
        if (department && department.hodId) {
          // Find HoD user
          const hod = await prisma.user.findUnique({ where: { id: department.hodId } })
          if (hod && hod.email) {
            const hodSubject = `New Trainee Application Approved - Assign Mentor`
            const hodBody = `
              <h2>New Trainee Application Approved</h2>
              <p>A trainee application has been approved by the L&D Coordinator and requires mentor assignment.</p>
              <h3>Trainee Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${updatedApplication.firstName} ${updatedApplication.lastName}</li>
                <li><strong>Email:</strong> ${updatedApplication.email}</li>
                <li><strong>Institution:</strong> ${updatedApplication.institutionName}</li>
                <li><strong>Course:</strong> ${updatedApplication.courseName}</li>
                <li><strong>Department:</strong> ${updatedApplication.preferredDepartment}</li>
                <li><strong>Duration:</strong> ${updatedApplication.internshipDuration} weeks</li>
                <li><strong>Application #:</strong> ${updatedApplication.applicationNumber}</li>
              </ul>
              <p>Please log in to the portal and assign a mentor for this trainee in your department.</p>
            `
            await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: hod.email,
                subject: hodSubject,
                html: hodBody
              })
            })
          }
        }
      } catch (hodError) {
        console.error("Failed to notify HoD:", hodError)
      }
    }

    console.log(`✅ Application ${applicationId} status updated to ${status}`)

    return NextResponse.json({
      success: true,
      message: "Application status updated successfully",
      application: updatedApplication
    })

  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    )
  }
} 