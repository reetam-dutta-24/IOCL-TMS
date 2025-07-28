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
    
    return NextResponse.json({
      success: true,
      message: `Successfully processed request for ${lndHodUser.firstName} ${lndHodUser.lastName}`,
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