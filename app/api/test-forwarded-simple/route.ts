import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing simple forwarded student details API...")
    
    // Test 1: Basic count
    const count = await prisma.forwardedStudentDetails.count()
    console.log(`📊 Total records: ${count}`)
    
    // Test 2: Simple query
    const records = await prisma.forwardedStudentDetails.findMany({
      take: 2
    })
    console.log(`📋 Found ${records.length} records`)
    
    // Test 3: Test with user filter
    const userRecords = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: 1
      }
    })
    console.log(`📋 Records for user 1: ${userRecords.length}`)
    
    return NextResponse.json({
      success: true,
      count: count,
      records: records.length,
      userRecords: userRecords.length,
      sampleRecord: records[0] ? {
        id: records[0].id,
        department: records[0].department,
        status: records[0].status
      } : null
    })
    
  } catch (error) {
    console.error("❌ Error in test API:", error)
    return NextResponse.json(
      { 
        error: "Test API failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 