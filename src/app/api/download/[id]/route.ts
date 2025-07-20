import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getFileUrl } from "@/lib/s3"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const attachmentId = Number.parseInt(params.id)

    const attachment = await prisma.documentAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        request: {
          include: {
            submitter: true,
          },
        },
        report: {
          include: {
            assignment: {
              include: {
                mentor: true,
              },
            },
          },
        },
        uploader: true,
      },
    })

    if (!attachment) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: { employeeId: session.user.employeeId },
      include: { role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check permissions
    let hasAccess = false

    // Admin and L&D Coordinators have access to all files
    if (["Admin", "L&D Coordinator"].includes(user.role.name)) {
      hasAccess = true
    }
    // File uploader has access
    else if (attachment.uploadedBy === user.id) {
      hasAccess = true
    }
    // Request submitter has access to their request files
    else if (attachment.request && attachment.request.submitter.id === user.id) {
      hasAccess = true
    }
    // Mentor has access to their mentee's files
    else if (attachment.report && attachment.report.assignment.mentor.id === user.id) {
      hasAccess = true
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Generate signed URL
    const signedUrl = await getFileUrl(attachment.filePath, 3600) // 1 hour expiry

    return NextResponse.json({
      success: true,
      data: {
        fileName: attachment.fileName,
        fileSize: attachment.fileSize,
        fileType: attachment.fileType,
        downloadUrl: signedUrl,
      },
    })
  } catch (error) {
    console.error("Error generating download URL:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
