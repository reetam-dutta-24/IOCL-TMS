import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hodId, department, applications } = body

    console.log(`🔍 Forwarding ${applications.length} applications to LND HoD (ID: ${hodId}) for ${department}`)
    console.log(`📊 Request body:`, { hodId, department, applicationsCount: applications.length })

    if (!hodId || !department || !applications || applications.length === 0) {
      console.error(`❌ Missing required fields:`, { hodId, department, applicationsCount: applications?.length })
      return NextResponse.json(
        { error: "Missing required fields: hodId, department and applications" },
        { status: 400 }
      )
    }

    // Find the specific LND HoD user by ID
    const parsedHodId = typeof hodId === 'string' ? parseInt(hodId) : hodId
    console.log(`🔍 Looking for LND HoD with ID: ${parsedHodId} (original: ${hodId})`)
    
    const lndHodUser = await prisma.user.findFirst({
      where: {
        id: parsedHodId,
        role: {
          name: "L&D HoD"
        },
        isActive: true
      }
    })

    if (!lndHodUser) {
      console.error(`❌ LND HoD with ID ${parsedHodId} not found`)
      
      // Let's check what users exist with L&D HoD role
      const allLndHods = await prisma.user.findMany({
        where: {
          role: {
            name: "L&D HoD"
          }
        },
        select: { id: true, firstName: true, lastName: true, email: true }
      })
      console.log(`📊 Available L&D HoDs:`, allLndHods)
      
      return NextResponse.json(
        { error: `LND HoD with ID ${parsedHodId} not found. Available IDs: ${allLndHods.map(u => u.id).join(', ')}` },
        { status: 404 }
      )
    }

    console.log(`✅ Found LND HoD: ${lndHodUser.firstName} ${lndHodUser.lastName} (ID: ${lndHodUser.id})`)

    // Create notification for the LND HoD
    const notification = await prisma.notification.create({
      data: {
        type: "STUDENT_DETAILS_FORWARDED",
        title: "Approved Student Details for Review",
        message: `${applications.length} approved student(s) details forwarded from L&D Coordinator for ${department} department - awaiting LND HoD review`,
        userId: lndHodUser.id,
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

    // Store the forwarded student details for LND HoD review
    const forwardedDetails = await prisma.forwardedStudentDetails.create({
      data: {
        notificationId: notification.id,
        department,
        applicationsCount: applications.length,
        applications: JSON.stringify(applications),
        forwardedBy: coordinatorUser.id,
        forwardedTo: lndHodUser.id,
        status: "PENDING_LND_REVIEW" // New status for LND HoD review
      }
    })

    // Send email notification to LND HoD
    try {
      console.log("📧 Attempting to send email notification...")
      // Temporarily disable email sending for testing
      /*
      await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/notifications/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: lndHodUser.email,
          subject: `Student Details for LND Review - ${department} Department`,
          html: `
            <h2>Student Details for LND Review</h2>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Number of Students:</strong> ${applications.length}</p>
            <p><strong>Sent by:</strong> L&D Coordinator</p>
            <p><strong>Status:</strong> Awaiting LND HoD Review</p>
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
            <p>Please review these student details and approve for department assignment.</p>
            <p>You can view full details and take action in your dashboard.</p>
          `
        })
      })
      */
      console.log("📧 Email sending disabled for testing")
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the entire request if email fails
    }

    console.log(`✅ Successfully forwarded ${applications.length} applications to LND HoD ${lndHodUser.firstName} ${lndHodUser.lastName}`)

    return NextResponse.json({
      success: true,
      message: `Successfully forwarded ${applications.length} student details to LND HoD ${lndHodUser.firstName} ${lndHodUser.lastName}`,
      notificationId: notification.id,
      forwardedDetailsId: forwardedDetails.id,
      hodUser: {
        id: lndHodUser.id,
        name: `${lndHodUser.firstName} ${lndHodUser.lastName}`,
        email: lndHodUser.email
      }
    })

  } catch (error) {
    console.error("Error forwarding details to LND HoD:", error)
    return NextResponse.json(
      { error: "Failed to forward details to LND HoD" },
      { status: 500 }
    )
  }
} 