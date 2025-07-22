import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force dynamic behavior
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const departmentName = searchParams.get("department")

    // Build where clause for filtering
    const where: any = {}
    
    if (status && status !== "all") {
      where.status = status
    }

    if (departmentName && departmentName !== "all") {
      where.department = {
        name: departmentName
      }
    }

    // Fetch requests from database - Only include department relation for now
    const requests = await prisma.internshipRequest.findMany({
      where,
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ success: true, data: requests }, { status: 200 })
  } catch (error) {
    console.error("Requests API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}