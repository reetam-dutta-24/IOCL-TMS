import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
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
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, department: true }
    })

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, we've sent a password reset link."
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    })

    // Send reset email
    const resetURL = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@iocl.co.in',
      to: email,
      subject: 'IOCL TAMS - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">IOCL TAMS</h1>
            <p style="color: #fee2e2; margin: 5px 0 0 0;">Trainee Approval & Management System</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Hello ${user.firstName},
            </p>
            
            <p style="color: #6b7280; line-height: 1.6;">
              We received a request to reset your password for your IOCL TAMS account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" 
                 style="background: #ef4444; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6; font-size: 14px;">
              This link will expire in 1 hour for security reasons.
            </p>
            
            <p style="color: #6b7280; line-height: 1.6; font-size: 14px;">
              If you didn't request this password reset, please ignore this email or contact support 
              if you have concerns.
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2024 Indian Oil Corporation Limited. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link."
    })

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    )
  }
}