import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Test forwarded API called")
    
    return NextResponse.json({
      success: true,
      message: "Test forwarded API is working",
      data: []
    })
    
  } catch (error) {
    console.error("❌ Error in test API:", error)
    return NextResponse.json(
      { error: "Test API failed" },
      { status: 500 }
    )
  }
} 