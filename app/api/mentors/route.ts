import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force dynamic behavior
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const departmentName = searchParams.get("department")
    const status = searchParams.get("status")

    // Build where clause for filtering
    const where: any = {
      role: {
        name: "Mentor"
      },
      isActive: true
    }

    if (departmentName && departmentName !== "all") {
      where.department = {
        name: departmentName
      }
    }

    // Fetch mentors from database (simplified)
    const mentors = await prisma.user.findMany({
      where,
      include: {
        department: true,
        role: true,
      },
      orderBy: {
        firstName: "asc"
      }
    })

    return NextResponse.json({ success: true, data: mentors }, { status: 200 })
  } catch (error) {
    console.error("Mentors API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}