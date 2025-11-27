import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Basic API is working" })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ 
      message: "POST is working", 
      receivedData: body 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to parse request", 
      details: error.message 
    }, { status: 500 })
  }
} 