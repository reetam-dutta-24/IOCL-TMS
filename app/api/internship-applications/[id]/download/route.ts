import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../src/lib/auth";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const applicationId = Number.parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const fileType = searchParams.get("type") // "resume" or "coverLetter"

    if (!fileType || !["resume", "coverLetter"].includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Get the internship application
    const application = await prisma.internshipApplication.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Get user to check permissions
    const user = await prisma.user.findUnique({
      where: { employeeId: session.user.employeeId },
      include: { role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check permissions - L&D Coordinators and Admins have access
    const hasAccess = ["Admin", "L&D Coordinator"].includes(user.role.name)
    
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get the file path based on type
    const filePath = fileType === "resume" ? application.resumePath : application.coverLetterPath

    if (!filePath) {
      console.error(`File not found for application ${applicationId}, type: ${fileType}`)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Read the file from the public uploads directory
    const fullPath = join(process.cwd(), "public", filePath)
    console.log(`Attempting to read file: ${fullPath}`)
    
    try {
      const fileBuffer = await readFile(fullPath)
      
      // Determine content type based on file extension
      const fileName = filePath.split("/").pop() || ""
      const fileExtension = fileName.split(".").pop()?.toLowerCase()
      
      let contentType = "application/octet-stream"
      if (fileExtension === "pdf") {
        contentType = "application/pdf"
      } else if (fileExtension === "doc") {
        contentType = "application/msword"
      } else if (fileExtension === "docx") {
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }

      // Return the file as a response
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      })
    } catch (fileError) {
      console.error("Error reading file:", fileError)
      console.error("Full path attempted:", fullPath)
      console.error("File path from database:", filePath)
      return NextResponse.json({ error: "File not found on server" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 