import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Simple forward API called")
    
    const body = await request.json()
    console.log("📊 Request body:", body)
    
    const { hodId, department, applications } = body
    
    if (!hodId || !department || !applications) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    console.log(`✅ Valid request: hodId=${hodId}, department=${department}, applications=${applications.length}`)
    
    // Find the LND HoD user
    const lndHodUser = await prisma.user.findFirst({
      where: {
        id: parseInt(hodId.toString()),
        role: {
          name: "L&D HoD"
        }
      }
    })
    
    if (!lndHodUser) {
      return NextResponse.json(
        { error: `LND HoD with ID ${hodId} not found` },
        { status: 404 }
      )
    }
    
    console.log(`✅ Found LND HoD: ${lndHodUser.firstName} ${lndHodUser.lastName}`)
    
    // Create notification for the LND HoD
    const notification = await prisma.notification.create({
      data: {
        type: "STUDENT_DETAILS_FORWARDED",
        title: "Approved Student Details for Review",
        message: `${applications.length} approved student(s) details forwarded for ${department} department - awaiting LND HoD review`,
        userId: lndHodUser.id,
        priority: "HIGH"
      }
    })

    // Get the L&D Coordinator user ID
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
        status: "PENDING_LND_REVIEW"
      }
    })

    console.log(`✅ Successfully stored forwarded details with ID: ${forwardedDetails.id}`)
    
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
    console.error("💥 Error in simple forward API:", error)
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    )
  }
} 