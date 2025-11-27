import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching departments...")

    const departments = await prisma.department.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    console.log(`✅ Found ${departments.length} departments`)

    return NextResponse.json(departments)

  } catch (error) {
    console.error("💥 Failed to fetch departments:", error)
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    )
  }
}