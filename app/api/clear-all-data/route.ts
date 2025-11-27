import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log("🧹 Clearing ALL trainee data from database...")
    
    // Delete all forwarded student details
    const deletedForwardedDetails = await prisma.forwardedStudentDetails.deleteMany({})
    console.log(`✅ Deleted ${deletedForwardedDetails.count} forwarded student details records`)
    
    // Delete all internship applications
    const deletedApplications = await prisma.internshipApplication.deleteMany({})
    console.log(`✅ Deleted ${deletedApplications.count} internship applications`)
    
    // Delete all internship requests
    const deletedRequests = await prisma.internshipRequest.deleteMany({})
    console.log(`✅ Deleted ${deletedRequests.count} internship requests`)
    
    // Delete related notifications
    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        type: {
          in: ["STUDENT_DETAILS_FORWARDED", "INTERNSHIP_APPLICATION", "INTERNSHIP_REQUEST"]
        }
      }
    })
    console.log(`✅ Deleted ${deletedNotifications.count} related notifications`)
    
    return NextResponse.json({
      success: true,
      message: "All trainee data cleared successfully",
      deletedForwardedDetails: deletedForwardedDetails.count,
      deletedApplications: deletedApplications.count,
      deletedRequests: deletedRequests.count,
      deletedNotifications: deletedNotifications.count
    })
    
  } catch (error) {
    console.error("❌ Error clearing database:", error)
    return NextResponse.json(
      { error: "Failed to clear database", details: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 