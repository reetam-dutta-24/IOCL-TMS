import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing database connection...")
    
    // Test 1: Basic connection
    await prisma.$connect()
    console.log("✅ Database connected")
    
    // Test 2: Simple query
    const userCount = await prisma.user.count()
    console.log(`📊 Users in database: ${userCount}`)
    
    // Test 3: Test forwarded details table
    const forwardedCount = await prisma.forwardedStudentDetails.count()
    console.log(`📊 Forwarded details in database: ${forwardedCount}`)
    
    return NextResponse.json({
      success: true,
      userCount: userCount,
      forwardedCount: forwardedCount,
      message: "Database connection successful"
    })
    
  } catch (error) {
    console.error("❌ Database test error:", error)
    return NextResponse.json(
      { 
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 