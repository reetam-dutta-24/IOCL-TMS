import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadFile, generateFileKey } from "@/lib/s3"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const requestId = formData.get("requestId") as string
    const reportId = formData.get("reportId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
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

    // Generate unique file key
    const fileKey = generateFileKey(user.id, requestId ? Number.parseInt(requestId) : 0, file.name)

    // Upload to S3
    const uploadResult = await uploadFile(file, fileKey)

    // Save to database
    const attachment = await prisma.documentAttachment.create({
      data: {
        requestId: requestId ? Number.parseInt(requestId) : undefined,
        reportId: reportId ? Number.parseInt(reportId) : undefined,
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
        url: uploadResult.url,
      },
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
