import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "@/lib/auth"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

// Configure email transporter
const transporter = nodemailer.createTransporter({
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

    // Send notification email to admins
    const admins = await prisma.user.findMany({
      where: {
        role: {
          name: {
            in: ['L&D HoD', 'System Administrator']
          }
        },
        isActive: true
      }
    })

    for (const admin of admins) {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@iocl.co.in',
        to: admin.email,
        subject: 'IOCL TAMS - New Access Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">IOCL TAMS</h1>
              <p style="color: #fee2e2; margin: 5px 0 0 0;">New Access Request</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #374151; margin-bottom: 20px;">New Access Request Received</h2>
              
              <p style="color: #6b7280; line-height: 1.6;">
                A new access request has been submitted for IOCL TAMS:
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Employee ID:</strong> ${employeeId}</p>
                <p><strong>Requested Role:</strong> ${accessRequest.requestedRole.name}</p>
                <p><strong>Department:</strong> ${accessRequest.department?.name || 'Not specified'}</p>
                <p><strong>Institution:</strong> ${institutionName || 'Not specified'}</p>
                <p><strong>Purpose:</strong> ${purpose || 'Not specified'}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard/admin/access-requests" 
                   style="background: #ef4444; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 6px; display: inline-block;
                          font-weight: bold;">
                  Review Request
                </a>
              </div>
            </div>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
    }

    return NextResponse.json({
      message: "Access request submitted successfully. You will receive an email once your request is reviewed.",
      requestId: accessRequest.id
    })

  } catch (error) {
    console.error("Access request error:", error)
    return NextResponse.json(
      { error: "Failed to submit access request" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { status: status as any } : {}

    const accessRequests = await prisma.accessRequest.findMany({
      where,
      include: {
        requestedRole: true,
        department: true,
        reviewer: true
      },
      orderBy: {
        requestedAt: 'desc'
      }
    })

    return NextResponse.json(accessRequests)

  } catch (error) {
    console.error("Get access requests error:", error)
    return NextResponse.json(
      { error: "Failed to fetch access requests" },
      { status: 500 }
    )
  }
}