import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import nodemailer from "nodemailer"
import crypto from "crypto"

const prisma = new PrismaClient()

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Configure email transporter
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { 
          error: "Valid email address is required",
          success: false 
        },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { 
          error: "Please provide a valid email address",
          success: false 
        },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    })

    // Always return success message for security (don't reveal if email exists)
    const successMessage = "If an account with that email exists, a reset link has been sent."

    if (!user) {
      return NextResponse.json({
        success: true,
        message: successMessage
      })
    }

    // Check if user account is active
    if (!user.isActive) {
      return NextResponse.json({
        success: true,
        message: successMessage
      })
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 3600000) // 1 hour from now

    // Update user with reset token and expiration
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires
        }
      })
    } catch (updateError) {
      console.error("Error updating user with reset token:", updateError)
      return NextResponse.json(
        { 
          error: "Failed to process password reset request",
          success: false 
        },
        { status: 500 }
      )
    }

    // Send reset email
    try {
      const transporter = createEmailTransporter()
      const resetUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ef4444; margin: 0;">IOCL TAMS</h1>
              <p style="margin: 5px 0; color: #666;">Trainee & Internship Management System</p>
            </div>
            
            <h2 style="color: #333;">Password Reset Request</h2>
            
            <p>Hello ${user.firstName} ${user.lastName},</p>
            
            <p>You have requested to reset your password for your IOCL TAMS account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #ef4444; 
                        color: white; 
                        padding: 14px 28px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block; 
                        font-weight: bold;">
                Reset Your Password
              </a>
            </div>
            
            <p style="margin: 20px 0;">
              <strong>Important:</strong>
            </p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will not be changed until you access the link above</li>
            </ul>
            
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${resetUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              This is an automated message from IOCL TAMS. Please do not reply to this email.
              <br>
              If you need assistance, please contact your system administrator.
            </p>
          </div>
        </body>
        </html>
      `

      await transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@iocl.co.in",
        to: user.email,
        subject: "Password Reset Request - IOCL TAMS",
        html: emailHtml,
        text: `Password Reset Request\n\nHello ${user.firstName} ${user.lastName},\n\nYou requested a password reset for your IOCL TAMS account.\n\nReset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this reset, please ignore this email.`
      })

      console.log(`Password reset email sent to: ${user.email}`)

    } catch (emailError) {
      console.error("Error sending reset email:", emailError)
      
      // Clean up the reset token if email failed
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            passwordResetToken: null,
            passwordResetExpires: null
          }
        })
      } catch (cleanupError) {
        console.error("Error cleaning up reset token:", cleanupError)
      }

      return NextResponse.json(
        { 
          error: "Failed to send reset email. Please try again later.",
          success: false 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: successMessage
    })

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { 
        error: "Failed to process password reset request",
        success: false 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}