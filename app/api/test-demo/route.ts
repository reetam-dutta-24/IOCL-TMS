import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Test API called")
    
    return NextResponse.json({
      success: true,
      message: "Demo API is working!",
      data: {
        test: "Hello from demo API"
      }
    })
  } catch (error) {
    console.error("Error in test API:", error)
    return NextResponse.json(
      { error: "Test API failed", details: error.message },
      { status: 500 }
    )
  }
} 