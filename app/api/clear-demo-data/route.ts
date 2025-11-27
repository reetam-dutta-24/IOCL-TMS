import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log("🧹 Clearing all demo data from database...")
    
    // Delete all forwarded student details
    const deletedForwardedDetails = await prisma.forwardedStudentDetails.deleteMany({})
    console.log(`✅ Deleted ${deletedForwardedDetails.count} forwarded student details records`)
    
    // Delete related notifications
    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        type: "STUDENT_DETAILS_FORWARDED"
      }
    })
    console.log(`✅ Deleted ${deletedNotifications.count} related notifications`)
    
    return NextResponse.json({
      success: true,
      message: "Database cleared successfully",
      deletedForwardedDetails: deletedForwardedDetails.count,
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