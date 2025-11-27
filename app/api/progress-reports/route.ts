import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { z } from "zod"

const createProgressReportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["WEEKLY", "MONTHLY", "FINAL"]),
  progressPercentage: z.number().min(0).max(100),
  attachments: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data to test the endpoint
    const mockReports = [
      {
        id: 1,
        reportTitle: "Week 1 Progress Report",
        reportContent: "Initial setup and project understanding phase completed.",
        reportType: "WEEKLY",
        status: "SUBMITTED",
        submissionDate: "2024-01-15T00:00:00.000Z",
        performanceRating: 4.5,
        attachments: [],
        submitter: {
          firstName: "John",
          lastName: "Doe",
          employeeId: "EMP001"
        }
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockReports,
    })
  } catch (error) {
    console.error("Error fetching progress reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProgressReportSchema.parse(body)

    // For now, create a mock report
    const mockReport = {
      id: Date.now(),
      assignmentId: 1,
      submittedBy: 1,
      reportType: validatedData.category,
      reportTitle: validatedData.title,
      reportContent: validatedData.description,
      submissionDate: new Date().toISOString(),
      performanceRating: validatedData.progressPercentage / 20,
      status: "SUBMITTED",
      submitter: {
        firstName: "John",
        lastName: "Doe",
        employeeId: "EMP001"
      },
      assignment: {
        mentor: {
          firstName: "Jane",
          lastName: "Smith",
          employeeId: "EMP002"
        },
        request: {
          traineeName: "John Doe",
          institutionName: "Test University"
        }
      },
      attachments: []
    }

    return NextResponse.json({
      success: true,
      data: mockReport,
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating progress report:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 