import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing Prisma client...")
    
    // Test basic connection
    const userCount = await prisma.user.count()
    console.log(`✅ User count: ${userCount}`)
    
    // Test forwardedStudentDetails table
    const forwardedCount = await prisma.forwardedStudentDetails.count()
    console.log(`✅ ForwardedStudentDetails count: ${forwardedCount}`)
    
    // Test simple query
    const records = await prisma.forwardedStudentDetails.findMany({
      take: 2
    })
    
    return NextResponse.json({
      success: true,
      userCount,
      forwardedCount,
      records: records.map(r => ({
        id: r.id,
        department: r.department,
        status: r.status,
        forwardedTo: r.forwardedTo
      }))
    })
    
  } catch (error) {
    console.error("❌ Prisma test failed:", error)
    return NextResponse.json(
      { 
        error: "Prisma test failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 