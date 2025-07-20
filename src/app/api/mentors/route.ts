import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("departmentId")
    const available = searchParams.get("available")

    const where: any = {
      user: {
        role: {
          name: "MENTOR",
        },
        isActive: true,
      },
    }

    if (departmentId) {
      where.departmentId = departmentId
    }

    const mentors = await prisma.mentor.findMany({
      where,
      include: {
        user: true,
        department: true,
        internships: {
          where: {
            status: {
              in: ["APPROVED", "IN_PROGRESS"],
            },
          },
        },
        _count: {
          select: {
            internships: {
              where: {
                status: {
                  in: ["APPROVED", "IN_PROGRESS"],
                },
              },
            },
          },
        },
      },
    })

    // Filter available mentors if requested
    let filteredMentors = mentors
    if (available === "true") {
      filteredMentors = mentors.filter((mentor) => mentor._count.internships < mentor.maxInterns)
    }

    return NextResponse.json(filteredMentors)
  } catch (error) {
    console.error("Error fetching mentors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
