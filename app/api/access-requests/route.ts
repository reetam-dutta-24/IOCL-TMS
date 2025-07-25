import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "@/lib/auth"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      employeeId,
      requestedRoleId,
      departmentId,
      institutionName,
      purpose
    } = await request.json()

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Check if employee ID already exists
    const existingEmployeeId = await prisma.user.findUnique({
      where: { employeeId }
    })

    if (existingEmployeeId) {
      return NextResponse.json(
        { error: "This Employee ID is already registered" },
        { status: 400 }
      )
    }

    // Check for existing pending request
    const existingRequest = await prisma.accessRequest.findFirst({
      where: {
        OR: [
          { email },
          { employeeId }
        ],
        status: 'PENDING'
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: "A pending access request already exists for this email or Employee ID" },
        { status: 400 }
      )
    }

    // Create access request
    const accessRequest = await prisma.accessRequest.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        employeeId,
        requestedRoleId: parseInt(requestedRoleId),
        departmentId: departmentId ? parseInt(departmentId) : null,
        institutionName,
        purpose,
        status: 'PENDING'
      },
      include: {
        requestedRole: true,
        department: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Access request submitted successfully",
      requestId: accessRequest.id
    })

  } catch (error) {
    console.error("Access request submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit access request" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const accessRequests = await prisma.accessRequest.findMany({
      include: {
        requestedRole: true,
        department: true,
        reviewer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        requestedAt: 'desc'
      }
    })

    return NextResponse.json(accessRequests)
  } catch (error) {
    console.error("Failed to fetch access requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch access requests" },
      { status: 500 }
    )
  }
}