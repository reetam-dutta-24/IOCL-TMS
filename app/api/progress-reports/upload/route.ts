import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../src/lib/auth"
import { prisma } from "../../../../lib/prisma"
import { uploadFile, generateFileKey } from "../../../../src/lib/s3"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const reportId = formData.get("reportId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { employeeId: session.user.employeeId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify the report exists and user has permission
    const report = await prisma.projectReport.findUnique({
      where: { id: Number.parseInt(reportId) },
      include: {
        submitter: true,
        assignment: {
          include: {
            mentor: true,
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Check permissions - only the report submitter or their mentor can upload attachments
    if (report.submittedBy !== user.id && report.assignment.mentorId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Generate unique file key
    const fileKey = generateFileKey(user.id.toString(), file.name, "progress-reports")

    // Upload to S3
    const uploadResult = await uploadFile(file, fileKey)

    // Save to database
    const attachment = await prisma.documentAttachment.create({
      data: {
        reportId: Number.parseInt(reportId),
        fileName: file.name,
        filePath: uploadResult.key,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: user.id,
      },
    })

    // Create audit trail entry
    await prisma.auditTrail.create({
      data: {
        tableName: "document_attachments",
        recordId: attachment.id,
        action: "CREATE",
        newValues: attachment,
        changedBy: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: attachment.id,
        fileName: attachment.fileName,
        fileSize: attachment.fileSize,
        fileType: attachment.fileType,
        uploadDate: attachment.uploadDate,
      },
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 